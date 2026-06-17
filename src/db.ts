/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Review, User } from './types';
import { INITIAL_REVIEWS } from './data';

// Persistent storage keys
const REVIEWS_KEY = 'torra_platform_reviews';
const USERS_KEY = 'torra_platform_users';
const SESSION_KEY = 'torra_platform_session';

// Direct initial preseeded credentials
export const PRESEEDED_ADMIN = {
  email: 'hello.meareg@gmail.com',
  name: 'Admin Meareg',
  role: 'admin' as const
};

// Seed initial users if none exist
function seedDatabase() {
  try {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      // Create a default admin user and a customer user for mock/trial purposes
      const preseededUsers = [
        {
          id: 'user-admin',
          email: PRESEEDED_ADMIN.email,
          name: PRESEEDED_ADMIN.name,
          role: PRESEEDED_ADMIN.role,
          createdAt: new Date().toISOString(),
          // simple secure string check
          passwordHash: 'admin123'
        },
        {
          id: 'user-customer',
          email: 'customer@torra.com',
          name: 'Jane Doe',
          role: 'user' as const,
          createdAt: new Date().toISOString(),
          passwordHash: 'user123'
        }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(preseededUsers));
    }

    const existingReviews = localStorage.getItem(REVIEWS_KEY);
    if (!existingReviews) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
    }
  } catch (error) {
    console.error('Error seeding localStorage database:', error);
  }
}

// Boot database automatically on load
seedDatabase();

export const dbService = {
  // --- REVIEWS CRUD / QUERY SYSTEM ---
  getReviews(): Review[] {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading reviews from database:', e);
    }
    return INITIAL_REVIEWS;
  },

  saveReviews(reviews: Review[]): void {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews to database:', e);
    }
  },

  createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'status'> & { status?: 'Pending' | 'Approved' }): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `tr-rev-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: reviewData.status || 'Pending' // Start as Pending for moderation flow!
    };
    
    reviews.unshift(newReview);
    this.saveReviews(reviews);
    return newReview;
  },

  updateReviewStatus(id: string, status: 'Approved' | 'Pending' | 'Flagged'): Review[] {
    const reviews = this.getReviews();
    const updated = reviews.map(r => r.id === id ? { ...r, status } : r);
    this.saveReviews(updated);
    return updated;
  },

  addReviewResponse(id: string, adminResponse: string): Review[] {
    const reviews = this.getReviews();
    const updated = reviews.map(r => r.id === id ? { ...r, adminResponse } : r);
    this.saveReviews(updated);
    return updated;
  },

  deleteReview(id: string): Review[] {
    const reviews = this.getReviews();
    const filtered = reviews.filter(r => r.id !== id);
    this.saveReviews(filtered);
    return filtered;
  },

  // --- AUTH / ACCOUNTS SYSTEM ---
  getUsers(): Array<User & { passwordHash: string }> {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  registerUser(email: string, password: string, name: string, role: 'admin' | 'user'): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const emailNormalized = email.trim().toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, error: 'User with this email already exists in our database.' };
    }

    const newUser = {
      id: `u-${Date.now().toString().slice(-4)}`,
      email: emailNormalized,
      name: name.trim(),
      role,
      createdAt: new Date().toISOString(),
      passwordHash: password
    };

    users.push(newUser);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      return { success: false, error: 'Database resource shortage. Please try again.' };
    }

    // Return object omitting password
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },

  authenticateUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const emailNormalized = email.trim().toLowerCase();
    
    const user = users.find(u => u.email.toLowerCase() === emailNormalized);
    if (!user) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, error: 'Incorrect email or password.' };
    }

    // Set active session
    const { passwordHash: _, ...authenticatedUser } = user;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
    } catch (e) {
      console.error('Session write failed:', e);
    }

    return { success: true, user: authenticatedUser };
  },

  getCurrentSession(): User | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
  }
};

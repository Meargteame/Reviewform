/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  name: string;
  email?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  category: string; // Product / Service selection
  recommend: boolean;
  image?: string; // Optional image URL or Base64 data
  createdAt: string;
  status: 'Approved' | 'Pending' | 'Flagged';
  adminResponse?: string;
}

export type ReviewStep = 'profile' | 'rating' | 'feedback' | 'submit';

export interface CategoryOption {
  value: string;
  label: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

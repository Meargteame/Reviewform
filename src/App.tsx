/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox,
  PenTool,
  Shield,
  LogOut,
  LogIn,
  Key,
  Layers
} from 'lucide-react';
import { Review, User } from './types';
import { CATEGORIES } from './data';
import ReviewForm from './components/ReviewForm';
import AdminDashboard from './components/AdminDashboard';
import AuthPages from './components/AuthPages';
import { dbService } from './db';

type AppViewMode = 'appraise' | 'admin' | 'auth';

export default function App() {
  // Local state synced with dbService
  const [reviews, setReviews] = useState<Review[]>(() => dbService.getReviews());
  const [currentUser, setCurrentUser] = useState<User | null>(() => dbService.getCurrentSession());

  // Default to Review Form view page
  const [activeTab, setActiveTab] = useState<AppViewMode>('appraise');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Create review feedback handler
  const handleCreateReview = (newReview: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    // If user is logged-in, auto-approve, otherwise Pending approval
    const statusVal = currentUser?.role === 'admin' ? ('Approved' as const) : ('Pending' as const);
    
    dbService.createReview({
      ...newReview,
      status: statusVal
    });

    const updatedFeed = dbService.getReviews();
    setReviews(updatedFeed);

    if (statusVal === 'Approved') {
      showToast('Your review has been published successfully.');
    } else {
      showToast('Thank you! Your review has been submitted for moderation.');
    }
  };

  // Moderation triggers
  const handleApprove = (id: string) => {
    const updated = dbService.updateReviewStatus(id, 'Approved');
    setReviews(updated);
    showToast('Review approved successfully.');
  };

  const handleFlag = (id: string) => {
    const updated = dbService.updateReviewStatus(id, 'Flagged');
    setReviews(updated);
    showToast('Review flagged as spam.');
  };

  const handleDelete = (id: string) => {
    const updated = dbService.deleteReview(id);
    setReviews(updated);
    showToast('Review deleted permanently.');
  };

  const handleAddResponse = (id: string, response: string) => {
    const updated = dbService.addReviewResponse(id, response);
    setReviews(updated);
    showToast('Official answer response posted.');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('appraise');
    }
    showToast(`Signed in as ${user.name}`);
  };

  const handleLogout = () => {
    dbService.clearSession();
    setCurrentUser(null);
    setActiveTab('appraise');
    showToast('Signed out successfully.');
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between font-sans antialiased">
      
      {/* Toast alert indicator */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-sans px-5 py-3.5 shadow-lg flex items-center justify-between gap-4 select-none rounded-xl"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-gray-400 hover:text-white font-bold text-[10px] uppercase tracking-wider pl-2 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP FLOATING NAVIGATION BAR WITH NO "T" LOGO */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-4 sm:pt-6 sticky top-0 z-50 select-none">
        <nav className="bg-white/75 backdrop-blur-xl border border-gray-200/80 text-gray-800 shadow-sm rounded-2xl px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Elegant Simplified Logo without "T" box */}
          <div 
            className="flex items-center gap-1.5 cursor-pointer leading-tight" 
            onClick={() => setActiveTab('appraise')}
          >
            <div className="text-left font-sans">
              <span className="text-base font-bold tracking-tight block text-gray-900">Torra Real Estate</span>
              <span className="text-[10px] text-[#1a73e8] tracking-wider uppercase font-bold">Client Reviews</span>
            </div>
          </div>

          {/* Navigation Control Switcher (Only visible to authenticated administrators) */}
          {currentUser?.role === 'admin' && (
            <div className="inline-flex p-1 bg-gray-100 border border-gray-200 rounded-full w-full max-w-xs sm:max-w-sm shadow-inner transition-all duration-150">
              <button
                onClick={() => setActiveTab('appraise')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-sans text-[11px] sm:text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'appraise'
                    ? 'bg-white text-[#1a73e8] shadow-sm'
                    : 'text-gray-550 hover:text-gray-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Review Form</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-sans text-[11px] sm:text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-white text-[#1a73e8] shadow-sm'
                    : 'text-gray-550 hover:text-gray-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Broker Dashboard</span>
              </button>
            </div>
          )}

          {/* Broker Identity / Authenticated actions trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-0.5 pr-3 rounded-full text-left">
                <div className="w-6 h-6 rounded-full bg-[#1a73e8] text-white font-extrabold text-xs flex items-center justify-center select-none uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left font-sans">
                  <div className="text-[10px] text-gray-800 font-extrabold leading-none truncate max-w-[110px]">{currentUser.name}</div>
                  <button
                    onClick={handleLogout}
                    className="text-[8px] text-red-500 hover:text-red-750 font-extrabold flex items-center gap-0.5 cursor-pointer uppercase tracking-widest leading-none mt-1"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-1.5 border border-gray-250 hover:border-blue-300 bg-white text-gray-700 px-4 py-1.5 rounded-full font-sans text-xs font-bold hover:text-[#1a73e8] cursor-pointer shadow-2xs transition-all active:scale-98"
              >
                <LogIn className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>Broker Sign In</span>
              </button>
            )}
          </div>

        </nav>
      </div>

      {/* DYNAMIC HERO SECTION (RENDERS ONLY ON PUBLIC APPRAISE REVIEWS VIEW) */}
      {activeTab === 'appraise' && (
        <header className="relative border-b border-gray-200 bg-white px-6 py-8 sm:py-12 font-sans overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-widest font-extrabold text-[#1a73e8] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                  Service Reviews
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Verified Portal</span>
              </div>
              
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Review Yohannes Meareg
              </h1>
              
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
                Your direct reviews help us improve our services. Please take a moment to select a score and share your experience with Yohannes.
              </p>
            </div>

            {/* Simple Contact Badge */}
            <div className="flex items-center gap-3 border border-gray-250 bg-gray-50/60 p-4 rounded-xl text-left max-w-xs shrink-0 self-start md:self-center select-none shadow-2xs">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-[#1a73e8] flex items-center justify-center font-bold text-lg">
                Y
              </div>
              <div className="font-sans">
                <div className="text-[9px] text-[#1a73e8] font-bold uppercase tracking-widest leading-none">Senior Real Estate Agent</div>
                <div className="text-xs text-gray-900 font-extrabold leading-tight mt-1">Yohannes Meareg</div>
                <div className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">hello.meareg@gmail.com</div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Single-Column Dynamic Content view Frame */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <AnimatePresence mode="wait">
          
          {/* VIEW: Public single page ReviewForm */}
          {activeTab === 'appraise' && (
            <motion.div
              key="view-appraise"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="text-center space-y-1 pb-1">
                <span className="text-[10px] tracking-widest text-[#1a73e8] uppercase font-bold block">
                  Add Your Note
                </span>
                <p className="text-xs sm:text-sm font-sans text-gray-500 font-normal leading-relaxed max-w-md mx-auto">
                  Your feedback goes straight to Yohannes and helps our real estate services improve.
                </p>
              </div>

              {/* Single-Page ReviewForm */}
              <ReviewForm onSubmitReview={handleCreateReview} />
            </motion.div>
          )}

          {/* VIEW: Left sidebar Dashboard console for Administrators */}
          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <motion.div
              key="view-admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <AdminDashboard 
                reviews={reviews} 
                onApprove={handleApprove} 
                onFlag={handleFlag} 
                onDelete={handleDelete} 
                onAddResponse={handleAddResponse} 
              />
            </motion.div>
          )}

          {/* VIEW: Beautiful sign-in template panel */}
          {activeTab === 'auth' && (
            <motion.div
              key="view-auth"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
            >
              <AuthPages 
                onAuthSuccess={handleAuthSuccess} 
                onCancel={() => setActiveTab('appraise')} 
                aria-label="Admin Sign In Panel"
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Boutique Static footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 font-sans">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 text-center sm:text-left font-semibold">
          
          <div className="flex items-center gap-1.5 text-gray-650 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Torra Real Estate</span>
          </div>

          <div className="text-[11px] font-sans font-normal text-gray-400">
            © {new Date().getFullYear()} Torra Real Estate. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}

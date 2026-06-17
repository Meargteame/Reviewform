/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  Check, 
  Flag, 
  Trash2, 
  MessageSquare, 
  Send, 
  Star, 
  ArrowUpRight, 
  ShieldAlert, 
  Sparkles,
  ThumbsUp,
  Mail,
  Calendar,
  Clock,
  LayoutDashboard,
  ShieldAlert as AlertIcon,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { Review } from '../types';
import { CATEGORIES } from '../data';

interface AdminDashboardProps {
  reviews: Review[];
  onApprove: (id: string) => void;
  onFlag: (id: string) => void;
  onDelete: (id: string) => void;
  onAddResponse: (id: string, response: string) => void;
}

export default function AdminDashboard({ 
  reviews, 
  onApprove, 
  onFlag, 
  onDelete, 
  onAddResponse 
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All'); // Simple sidebar controls this too!
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Count states for Left Sidebar navigation badge counts
  const totalCount = reviews.length;
  const approvedCount = reviews.filter(r => r.status === 'Approved').length;
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;
  const flaggedCount = reviews.filter(r => r.status === 'Flagged').length;

  const approvedReviews = reviews.filter(r => r.status === 'Approved');

  // Calculates overall rating index
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '0.0';

  const recommendCount = approvedReviews.filter(r => r.recommend).length;
  const recommendPercent = approvedReviews.length > 0
    ? Math.round((recommendCount / approvedReviews.length) * 100)
    : 0;

  // Star analytics values
  const starsDistribution = [5, 4, 3, 2, 1].map(star => {
    const starValCount = approvedReviews.filter(r => r.rating === star).length;
    const percentage = approvedReviews.length > 0 ? Math.round((starValCount / approvedReviews.length) * 100) : 0;
    return { rating: star, count: starValCount, percent: percentage };
  });

  // Filter list matching queries & sidebar selection
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating = selectedRating === 'All' || r.rating.toString() === selectedRating;
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

    return matchesSearch && matchesRating && matchesCategory && matchesStatus;
  });

  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredReviews.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'Rating', 'Title', 'Comment', 'Category', 'Recommended', 'Date', 'Status', 'Response'];
    const rows = filteredReviews.map(r => [
      r.id,
      r.name.replace(/"/g, '""'),
      (r.email || '').replace(/"/g, '""'),
      r.rating,
      r.title.replace(/"/g, '""'),
      r.comment.replace(/"/g, '""'),
      r.category,
      r.recommend ? 'Yes' : 'No',
      r.createdAt,
      r.status,
      (r.adminResponse || '').replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => row.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `client_reviews_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendReply = (reviewId: string) => {
    if (replyText.trim()) {
      onAddResponse(reviewId, replyText.trim());
      setReplyText('');
      setReplyInputId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans text-gray-800">
      
      {/* Top Simple Header Segment */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage submitted client feedback, write official answers, and audit scores.
          </p>
        </div>
        
        {filteredReviews.length > 0 && (
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 text-xs font-bold rounded-lg transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export to CSV</span>
          </button>
        )}
      </div>

      {/* Side-by-side Left Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-2">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block px-2">
              Filter by Status
            </span>
            
            <nav className="space-y-1.5">
              <button
                onClick={() => setSelectedStatus('All')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedStatus === 'All'
                    ? 'bg-blue-50 text-[#1a73e8]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 shrink-0" />
                  <span>All Reviews</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStatus === 'All' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedStatus('Pending')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedStatus === 'Pending'
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Pending ({pendingCount})</span>
                </div>
                {pendingCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                )}
              </button>

              <button
                onClick={() => setSelectedStatus('Approved')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedStatus === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Approved</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStatus === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {approvedCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedStatus('Flagged')}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedStatus === 'Flagged'
                    ? 'bg-rose-50 text-rose-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertIcon className="w-4 h-4 shrink-0" />
                  <span>Flagged Spam</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedStatus === 'Flagged' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {flaggedCount}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Real-Time Analytics Cards underneath sidebar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-2xs space-y-4">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
              Active Stats
            </span>

            <div className="space-y-3.5">
              {/* Avg Rating */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Average Rating</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{averageRating}</span>
                  <span className="text-xs text-gray-400">/ 5.0</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3 h-3 ${s <= Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Recommendation Percent */}
              <div className="space-y-1 border-t border-gray-250/50 pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Recommendation Ratio</span>
                <span className="text-2xl font-bold text-gray-900 block">{recommendPercent}%</span>
                <p className="text-[10px] text-gray-400 leading-normal font-normal">
                  {recommendCount} out of {approvedCount} clients would recommend us.
                </p>
              </div>

              {/* Star Bar breakdown */}
              <div className="space-y-1.5 border-t border-gray-250/50 pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Star Ratios</span>
                <div className="space-y-1">
                  {starsDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold">
                      <span className="w-3 shrink-0">{item.rating}★</span>
                      <div className="flex-1 bg-gray-200 h-1.5 overflow-hidden rounded">
                        <div 
                          className="bg-amber-400 h-full rounded transition-all duration-500" 
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-gray-400">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Active contents viewport & Search & filter, Card list */}
        <div className="lg:col-span-3 space-y-6">

          {/* Quick Filters search shelves */}
          <div className="bg-white border border-gray-200 rounded-xl p-4.5 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Text Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reviews or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:bg-white outline-none focus:border-[#1a73e8] transition"
                />
              </div>

              {/* Star Rating select dropdown */}
              <div>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="All">All Scores</option>
                  <option value="5">5 Stars only</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              {/* Transactions Type categories select dropdown */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Clear Filters indicators */}
            {(searchQuery || selectedRating !== 'All' || selectedCategory !== 'All') && (
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-gray-400">
                <span>Active filters are running.</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRating('All');
                    setSelectedCategory('All');
                  }}
                  className="text-[#1a73e8] hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* List display */}
          <div className="space-y-4">
            
            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wide text-gray-400 px-1">
              <span>Showing {filteredReviews.length} matching reviews</span>
              <span>Sorted by newest first</span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredReviews.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500">
                  <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-gray-700">No matching reviews found</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto leading-normal">
                    Try changing your filters or searching for something else.
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => {
                  const labelColor = rev.status === 'Approved' 
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                    : rev.status === 'Pending'
                    ? 'text-amber-700 bg-amber-50 border-amber-100'
                    : 'text-rose-700 bg-rose-50 border-rose-100';

                  const dateStr = new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <motion.div
                      key={rev.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center select-none uppercase">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-gray-900">
                              <span>{rev.name}</span>
                              {rev.email && (
                                <span className="text-[10px] text-gray-400 font-normal">({rev.email})</span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-gray-750">{rev.category}</span>
                              <span>•</span>
                              <span>{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Label Pills */}
                        <div className="flex items-center gap-2 font-sans font-bold text-[9px] uppercase tracking-wider">
                          <span className={`px-2 py-0.5 border rounded-full ${labelColor}`}>
                            {rev.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            rev.recommend ? 'bg-emerald-50 text-[#137333]' : 'bg-rose-50 text-[#c5221f]'
                          }`}>
                            {rev.recommend ? '✓ Recommends' : '✗ Skips'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Stars */}
                      <div className="space-y-1 pt-1.5">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <h4 className="text-xs font-extrabold text-gray-900">
                          "{rev.title}"
                        </h4>
                        <p className="text-xs text-gray-650 leading-relaxed font-normal">
                          {rev.comment}
                        </p>
                      </div>

                      {/* Photo Attachment preview */}
                      {rev.image && (
                        <div className="pt-1.5">
                          <div className="inline-block border border-gray-200 p-1.5 bg-gray-50/50 rounded-lg">
                            <img 
                              src={rev.image}
                              alt="Review attachment"
                              className="max-h-24 max-w-sm rounded object-cover shadow-2xs"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Response block */}
                      {rev.adminResponse && (
                        <div className="bg-[#e8f0fe]/20 border border-blue-100 rounded-lg p-3 text-xs">
                          <span className="text-[10px] text-[#1a73e8] font-bold uppercase tracking-wider block mb-1">
                            Your Answer
                          </span>
                          <p className="text-gray-700 italic">
                            "{rev.adminResponse}"
                          </p>
                        </div>
                      )}

                      {/* Action trigger segment */}
                      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                        
                        <div className="flex items-center gap-2">
                          {rev.status !== 'Approved' && (
                            <button
                              onClick={() => onApprove(rev.id)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-lg text-[11px] transition cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          
                          {rev.status !== 'Flagged' && (
                            <button
                              onClick={() => onFlag(rev.id)}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-100 rounded-lg text-[11px] transition cursor-pointer"
                            >
                              Flag
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setReplyInputId(replyInputId === rev.id ? null : rev.id);
                              setReplyText(rev.adminResponse || '');
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-100 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{rev.adminResponse ? 'Edit Answer' : 'Answer'}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to permanently delete this review?')) {
                              onDelete(rev.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-700 border border-gray-100 hover:border-rose-100 rounded-lg text-[10px] transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>

                      </div>

                      {/* Answer Input Area */}
                      {replyInputId === rev.id && (
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
                            Write your Answer
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply to this review..."
                              className="flex-1 bg-white border border-gray-250 focus:border-[#1a73e8] rounded-lg px-3 py-2 text-xs font-medium outline-none"
                            />
                            <button
                              onClick={() => handleSendReply(rev.id)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Post</span>
                            </button>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Cpu, 
  Network, 
  Workflow, 
  Sliders
} from 'lucide-react';
import { Review } from '../types';

interface LandingHeroProps {
  reviews: Review[];
  onStartReview: () => void;
  onViewDashboard: () => void;
}

export default function LandingHero({ reviews, onStartReview, onViewDashboard }: LandingHeroProps) {
  const approvedReviews = reviews.filter(r => r.status === 'Approved');
  const totalReviews = approvedReviews.length;
  
  const avgRating = totalReviews > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '4.8';

  const recommendPercent = totalReviews > 0
    ? Math.round((approvedReviews.filter(r => r.recommend).length / totalReviews) * 100)
    : 98;

  const totalRecommendationCount = approvedReviews.filter(r => r.recommend).length;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white py-12 md:py-20 font-sans">
      {/* Decorative premium background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a04_1px,transparent_1px),linear-gradient(to_bottom,#0f172a05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Trust badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/65 text-[10px] font-extrabold text-slate-700 tracking-wider uppercase mb-8 cursor-pointer border border-slate-200 transition duration-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>SaaS Analytics & Feedback</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.08] mb-6"
        >
          Share your <span className="text-indigo-650 bg-clip-text">Experience</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto text-base text-slate-550 font-normal leading-relaxed mb-10"
        >
          Every developer-voted report and support request helps refine core platform priorities, api coverage, and SLA targets. Build with confidence.
        </motion.p>

        {/* Interactive Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16"
        >
          <button
            id="btn-start-review-hero"
            onClick={onStartReview}
            className="w-full sm:w-auto px-7 py-3 bg-black hover:bg-zinc-805 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform active:scale-98 flex items-center justify-center gap-1.5 group cursor-pointer"
          >
            Submit Feedback
            <ArrowRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition duration-155" />
          </button>
          
          <button
            id="btn-view-dashboard-hero"
            onClick={onViewDashboard}
            className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-50 text-slate-750 font-bold text-xs rounded-xl border border-slate-210 hover:border-slate-310 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Moderator Dashboard
          </button>
        </motion.div>

        {/* STATS DECORATIVE BLOCKS MATCHING USER SCREENSHOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          
          {/* Bento Card 1: Campaign details (Clipboard Emoji Style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="bg-white border border-slate-200/60 rounded-3xl shadow-xs overflow-hidden"
          >
            {/* Card Header with Clipboard Emoji */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Campaign details</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Verify live baseline responses and verification scorecard</p>
                </div>
              </div>
              <button 
                onClick={onStartReview}
                className="text-[10px] font-black text-indigo-650 hover:text-indigo-800 tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-lg transition"
              >
                EDIT
              </button>
            </div>

            {/* Simulated rows exactly following the screenshot aesthetics */}
            <div className="divide-y divide-slate-100/70 text-xs font-normal text-slate-650">
              
              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div className="font-bold text-slate-500">Live Feedback submissions</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900">{totalReviews} verified</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div className="font-bold text-slate-500">Service Category</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-[#15803d] px-2.5 py-0.5 rounded-full bg-[#f0fdf4] border border-[#dcfce7]">API & Service</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div className="font-bold text-slate-500">Industry standards</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-800">SOC2 Type II</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div className="font-bold text-slate-500">Avg platform grade</div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 mr-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900">{avgRating}/5.0</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

            </div>
          </motion.div>

          {/* Bento Card 2: Communication settings (Bell Emoji Style) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="bg-white border border-slate-200/60 rounded-3xl shadow-xs overflow-hidden"
          >
            {/* Card Header with Bell Emoji */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔔</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Communication settings</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Configure routing flags and verified recommendations</p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold bg-[#d9f99d] text-slate-950 px-2 py-0.5 rounded uppercase tracking-wider">
                ACTIVE
              </span>
            </div>

            {/* Row configurations */}
            <div className="divide-y divide-slate-100/70 text-xs font-normal text-slate-650">

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div>
                  <div className="font-bold text-slate-550">Auto-inject moderation check</div>
                  <div className="text-[10px] text-slate-400 font-medium select-none">Approve feedback into landing queue automatically</div>
                </div>
                {/* Custom toggle matching screen mockup perfectly */}
                <div className="w-10 h-5.5 rounded-full bg-indigo-600 p-0.5 relative transition-colors cursor-pointer select-none">
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm absolute right-0.5 top-0.5" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div>
                  <div className="font-bold text-slate-550">Peer endorsement weight</div>
                  <div className="text-[10px] text-slate-400 font-medium select-none">Percent recommendation verification</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold bg-[#d9f99d] text-slate-900 border border-[#bced5e] px-2.5 py-0.5 rounded-lg text-[11px]">
                    {recommendPercent}% Yes ({totalRecommendationCount} votes)
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div>
                  <div className="font-bold text-slate-550">Operator alert triggers</div>
                  <div className="text-[10px] text-slate-400 font-medium select-none">Email notice on low ratings (≤ 2 stars)</div>
                </div>
                {/* Custom inactive toggle */}
                <div className="w-10 h-5.5 rounded-full bg-slate-200 p-0.5 relative transition-colors cursor-pointer select-none">
                  <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm absolute left-0.5 top-0.5" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition">
                <div>
                  <div className="font-bold text-slate-550">Corporate domain restriction</div>
                  <div className="text-[10px] text-slate-400 font-medium select-none">Only allow authorized business addresses</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Disabled</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Corporate trust logos */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 pt-10 border-t border-slate-100"
        >
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-6 text-center select-none">
            Trusted by performance engineering teams globally
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 opacity-45 select-none text-xs font-bold text-slate-500">
            <span className="tracking-widest uppercase">ACME SCALE</span>
            <span className="tracking-widest uppercase">VERTX DATA</span>
            <span className="tracking-widest uppercase">▲ LINEAR LABS</span>
            <span className="tracking-widest uppercase font-black text-indigo-700">NEXUS SYSTEM</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

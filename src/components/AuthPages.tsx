/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  ShieldCheck
} from 'lucide-react';
import { dbService } from '../db';
import { User } from '../types';

interface AuthPagesProps {
  onAuthSuccess: (user: User) => void;
  onCancel: () => void;
}

export default function AuthPages({ onAuthSuccess, onCancel }: AuthPagesProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    setSuccessText(null);

    if (!loginEmail || !loginPassword) {
      setErrorText('Please fill in both fields.');
      return;
    }

    const res = dbService.authenticateUser(loginEmail, loginPassword);
    if (res.success && res.user) {
      if (res.user.role !== 'admin') {
        setErrorText('This access is restricted to administrator accounts.');
        dbService.clearSession();
        return;
      }
      
      setSuccessText(`Access approved. Welcome back, ${res.user.name}. Loading dashboard...`);
      setTimeout(() => {
        onAuthSuccess(res.user!);
      }, 900);
    } else {
      setErrorText('Invalid email address or password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-200 p-6 sm:p-10 rounded-2xl shadow-sm font-sans relative">
      
      {/* Centered Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#1a73e8] mb-3 border border-blue-100">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard Login
        </h3>
        <p className="text-xs text-gray-500 mt-1 lines-relaxed">
          Sign in below to access and manage your active database reviews.
        </p>
      </div>

      {/* Alerts */}
      {errorText && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold rounded-xl mb-5 flex items-start gap-1.5"
        >
          <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
          <span>{errorText}</span>
        </motion.div>
      )}

      {successText && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl mb-5 flex items-start gap-1.5"
        >
          <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successText}</span>
        </motion.div>
      )}

      <form onSubmit={handleSignIn} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs font-bold text-gray-500 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              id="login-email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="e.g. admin@example.com"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 rounded-lg text-xs font-medium outline-none transition"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="login-password" className="text-xs font-bold text-gray-500 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="password"
              id="login-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 rounded-lg text-xs font-medium outline-none transition"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-250 hover:bg-gray-550/10 text-gray-600 font-bold text-xs rounded-full cursor-pointer transition text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btn-submit-login"
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </form>
    </div>
  );
}

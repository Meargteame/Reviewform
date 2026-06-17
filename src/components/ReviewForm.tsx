/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Upload, 
  User, 
  Mail, 
  Check,
  AlertCircle,
  X,
  FileText,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Review } from '../types';
import { CATEGORIES } from '../data';

interface ReviewFormProps {
  onSubmitReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  onCancel?: () => void;
}

interface DraftState {
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  category: string;
  recommend: boolean | null;
  image: string;
}

const INITIAL_DRAFT: DraftState = {
  name: '',
  email: '',
  rating: 0,
  title: '',
  comment: '',
  category: CATEGORIES[0].value,
  recommend: null,
  image: '',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Disappointed with the service',
  2: 'Fair but some issues occurred',
  3: 'Good and standard service',
  4: 'Very helpful and attentive help',
  5: 'Outstanding expertise and support',
};

export default function ReviewForm({ onSubmitReview, onCancel }: ReviewFormProps) {
  const [draft, setDraft] = useState<DraftState>(() => {
    try {
      const saved = localStorage.getItem('torra_review_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Wipe step if pre-existing
        delete parsed.step;
        return { ...INITIAL_DRAFT, ...parsed };
      }
    } catch (e) {
      console.error('Error recovering draft', e);
    }
    return { ...INITIAL_DRAFT, category: CATEGORIES[0].value };
  });

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autosave draft handler
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem('torra_review_draft', JSON.stringify(draft));
    }
  }, [draft, isSubmitted]);

  const handleFieldChange = (key: keyof DraftState, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleResetForm = () => {
    setDraft({ ...INITIAL_DRAFT, category: CATEGORIES[0].value });
    localStorage.removeItem('torra_review_draft');
    setIsSubmitted(false);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (draft.rating === 0) {
      errors.rating = 'Please click to select a rating score (1-5 stars).';
    }
    if (!draft.title.trim()) {
      errors.title = 'Please write a simple title heading for your review.';
    }
    if (!draft.comment.trim()) {
      errors.comment = "Please write a short note about your experience.";
    } else if (draft.comment.trim().length < 8) {
      errors.comment = 'Your comment should contain at least 8 characters.';
    }
    if (draft.recommend === null) {
      errors.recommend = 'Please select whether you would recommend our service.';
    }
    if (!draft.name.trim()) {
      errors.name = 'Please enter your name or nickname.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationErrors(prev => ({ ...prev, image: 'Please choose an image file (PNG, JPG, or WebP).' }));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setValidationErrors(prev => ({ ...prev, image: 'Image size must be smaller than 3MB.' }));
      return;
    }

    setValidationErrors(prev => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleFieldChange('image', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmitReview({
        name: draft.name,
        email: draft.email || undefined,
        rating: draft.rating,
        title: draft.title,
        comment: draft.comment,
        category: draft.category,
        recommend: draft.recommend === true,
        image: draft.image || undefined,
      });
      setIsSubmitted(true);
      localStorage.removeItem('torra_review_draft');
    } else {
      // Find the first error element and scroll to it gently
      const firstErrorKey = Object.keys(validationErrors)[0];
      if (firstErrorKey) {
        const el = document.getElementById(`err-${firstErrorKey}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 p-8 text-center space-y-6 rounded-2xl shadow-sm text-gray-800"
      >
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <Check className="w-8 h-8 text-[#34a853]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Thank you for your review!</h3>
          <p className="text-sm text-gray-550 max-w-md mx-auto">
            Your review was successfully submitted and send to Yohannes for validation.
          </p>
        </div>
        <div>
          <button
            onClick={handleResetForm}
            className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-full cursor-pointer transition shadow-xs"
          >
            Submit another review
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 sm:p-10 relative shadow-sm rounded-2xl max-w-3xl mx-auto font-sans text-gray-800">
      <div className="space-y-2 mb-8 pb-5 border-b border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900">
          Share Your Experience
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
          We value your feedback. Take a minute to fill in your rating, comments, and details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: transaction type */}
        <div className="space-y-3">
          <label className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
            1. What type of service did we help you with?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CATEGORIES.map((cat) => {
              const isSelected = draft.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleFieldChange('category', cat.value)}
                  className={`w-full p-4 text-left border rounded-xl transition duration-150 cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isSelected 
                      ? 'bg-[#e8f0fe]/40 border-[#1a73e8]' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className={`text-xs font-bold block ${isSelected ? 'text-[#1a73e8]' : 'text-gray-900'}`}>
                      {cat.label}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#1a73e8] border-[#1a73e8]' : 'bg-transparent border-gray-300'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 font-normal mt-1.5 leading-normal">{cat.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Rating */}
        <div className="space-y-3 pt-2">
          <label className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
            2. Choose your overall score
          </label>
          
          <div className="border border-gray-150 bg-gray-50/30 rounded-xl p-5 text-center">
            <div className="flex justify-center items-center gap-3 mb-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoverRating ? star <= hoverRating : star <= draft.rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleFieldChange('rating', star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition transform hover:scale-110 cursor-pointer p-0.5"
                  >
                    <Star
                      className={`w-10 h-10 stroke-[1.2px] transition ${
                        isFilled
                          ? 'fill-[#fbbc05] text-[#fbbc05] stroke-[#e39a00]'
                          : 'fill-transparent text-gray-200 stroke-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="min-h-[24px] flex items-center justify-center">
              {draft.rating > 0 ? (
                <span className="text-xs text-[#1a73e8] font-bold bg-[#e8f0fe]/60 border border-blue-100 px-3 py-0.5 rounded-full">
                  {RATING_LABELS[draft.rating]}
                </span>
              ) : (
                <span className="text-[11px] text-gray-400 font-semibold tracking-wider uppercase">
                  Click on stars to score
                </span>
              )}
            </div>
          </div>

          {validationErrors.rating && (
            <div id="err-rating" className="flex items-center gap-1 text-xs font-bold text-[#d93025] pt-0.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationErrors.rating}</span>
            </div>
          )}
        </div>

        {/* SECTION 3: Recommend Preference */}
        <div className="space-y-3 pt-2">
          <label className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
            3. Would you recommend Torra Real Estate?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleFieldChange('recommend', true)}
              className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                draft.recommend === true
                  ? 'bg-emerald-50/50 border-[#34a853] text-[#137333]'
                  : 'bg-white border-gray-250 text-gray-650 hover:bg-gray-50'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${draft.recommend === true ? 'fill-[#34a853]/20' : ''}`} />
              <span>Yes, highly recommend</span>
            </button>

            <button
              type="button"
              onClick={() => handleFieldChange('recommend', false)}
              className={`flex-1 p-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                draft.recommend === false
                  ? 'bg-rose-50/50 border-red-500 text-[#c5221f]'
                  : 'bg-white border-gray-250 text-gray-650 hover:bg-gray-50'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${draft.recommend === false ? 'fill-red-500/20' : ''}`} />
              <span>No, some complaints</span>
            </button>
          </div>

          {validationErrors.recommend && (
            <div id="err-recommend" className="flex items-center gap-1 text-xs font-bold text-[#d93025] pt-0.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationErrors.recommend}</span>
            </div>
          )}
        </div>

        {/* SECTION 4: Feedback Words */}
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1.5">
            <label htmlFor="form-title" className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
              4. Review Title
            </label>
            <input
              type="text"
              id="form-title"
              value={draft.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Helpful, supportive and professional assistance!"
              className="w-full bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 p-3 text-gray-800 text-xs font-medium outline-none transition rounded-lg"
            />
            {validationErrors.title && (
              <div id="err-title" className="flex items-center gap-1 text-[11px] font-bold text-[#d93025] pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationErrors.title}</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-comment" className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
              5. Write your detailed review
            </label>
            <textarea
              id="form-comment"
              rows={4}
              value={draft.comment}
              onChange={(e) => handleFieldChange('comment', e.target.value)}
              placeholder="Tell us about the process, what went well, and how our service fell or rose above expectations..."
              className="w-full bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 p-3 text-gray-800 text-xs font-medium outline-none transition rounded-lg resize-y"
            />
            {validationErrors.comment && (
              <div id="err-comment" className="flex items-center gap-1 text-[11px] font-bold text-[#d93025] pt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validationErrors.comment}</span>
              </div>
            )}
          </div>

        </div>

        {/* SECTION 5: Client Image Photo upload */}
        <div className="space-y-2 pt-2">
          <label className="text-xs uppercase font-extrabold tracking-wider text-gray-500 block">
            6. Add a photo (Optional)
          </label>
          <p className="text-[11px] text-gray-400 font-normal">
            Upload an image of the home or related visual records. Max file size is 3MB.
          </p>

          {validationErrors.image && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#d93025] pb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{validationErrors.image}</span>
            </div>
          )}

          {draft.image ? (
            <div className="border border-blue-200 p-4 bg-[#e8f0fe]/20 flex items-center justify-between rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={draft.image}
                  alt="Draft review preview"
                  className="w-12 h-12 object-cover border border-white bg-white rounded-lg shadow-2xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Image attached</span>
                  <span className="text-[10px] text-gray-400 block">This will be shared in your review</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange('image', '')}
                className="w-8 h-8 rounded-full border border-gray-200 hover:border-red-300 hover:bg-rose-50 text-gray-500 hover:text-red-600 transition flex items-center justify-center cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-[#1a73e8] bg-blue-50/20' 
                  : 'border-gray-300 hover:border-[#1a73e8] bg-white hover:bg-gray-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-700">
                Drag and drop your image here, or <span className="text-[#1a73e8] underline">browse</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">Supports JPEG, PNG, or WebP</p>
            </div>
          )}
        </div>

        {/* SECTION 6: Client User Contact/Name info */}
        <div className="space-y-4 pt-3 border-t border-gray-150">
          <span className="text-xs uppercase font-extrabold tracking-wider text-gray-550 block">
            7. Tell us about yourself
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="client-name" className="text-[11px] font-semibold text-gray-650 block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="client-name"
                  value={draft.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 rounded-lg text-xs font-medium outline-none transition"
                />
              </div>
              {validationErrors.name && (
                <div id="err-name" className="flex items-center gap-1 text-[10px] font-bold text-[#d93025] pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{validationErrors.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="client-email" className="text-[11px] font-semibold text-gray-650 block">
                Email Address <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="client-email"
                  value={draft.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-250 focus:border-[#1a73e8] focus:ring-4 focus:ring-blue-100 rounded-lg text-xs font-medium outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit action block */}
        <div className="pt-6 border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400 leading-normal max-w-sm text-center sm:text-left">
            By submitting, you authorize Yohannes to display this on the official Torra Real Estate reviews dashboard.
          </p>

          <div className="flex gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 sm:flex-initial px-5 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-550 bg-white mr-2 text-xs font-bold rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              id="submit-review-button"
              className="flex-1 sm:flex-initial px-8 py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-full transition cursor-pointer shadow-xs active:scale-98 text-center"
            >
              Submit Review
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

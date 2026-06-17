/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Review, CategoryOption } from './types';

export const CATEGORIES: CategoryOption[] = [
  { value: 'Property Buying', label: 'Buying a Home', description: 'Searching, viewing, and purchasing a home.' },
  { value: 'Property Selling', label: 'Selling a Home', description: 'Listing, marketing, and selling your home.' },
  { value: 'Agent Integrity', label: 'Agent Support', description: 'Agent communication, helpful guidance, and advisory care.' },
  { value: 'Deal Value & Pricing', label: 'Pricing & Fees', description: 'Service pricing, fair values, and transparent fees.' },
  { value: 'Overall Torra Experience', label: 'Overall Experience', description: 'Your total journey with Torra Real Estate.' },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    rating: 5,
    title: 'Excellent house sale with Yohannes!',
    comment: 'Yohannes helped us sell our house quickly and for a great price! Highly recommended.',
    category: 'Property Selling',
    recommend: true,
    createdAt: '2026-06-16T14:32:00Z',
    status: 'Approved',
  },
  {
    id: 'rev-2',
    name: 'Helena Sterling',
    email: 'h_sterling@example.com',
    rating: 5,
    title: 'Smoothest buying experience ever',
    comment: 'We purchased our first home through Torra Real Estate. Yohannes made everything clear and simple.',
    category: 'Property Buying',
    recommend: true,
    createdAt: '2026-06-15T09:12:00Z',
    status: 'Approved',
  },
  {
    id: 'rev-3',
    name: 'Devon K. Patel',
    email: 'devon@example.com',
    rating: 4,
    title: 'Very helpful agent consultation',
    comment: 'Yohannes showed us several great houses and gave clear financial details. Very pleased with the custom help.',
    category: 'Agent Integrity',
    recommend: true,
    createdAt: '2026-06-14T17:45:00Z',
    status: 'Approved',
  }
];

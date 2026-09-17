'use client';

import Link from 'next/link';
import {
  Shirt, BookOpen, Coffee, Image, CreditCard, Tag, Gift,
  Printer, Package, Star, Layers, type LucideIcon
} from 'lucide-react';
import { Category } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Shirt,
  BookOpen,
  Coffee,
  Image,
  CreditCard,
  Tag,
  Gift,
  Printer,
  Package,
  Star,
  Layers,
};

const COLOR_PAIRS: Array<[string, string]> = [
  ['#00AEEF', '#e0f7ff'],   // Cyan
  ['#EC008C', '#ffe0f5'],   // Magenta
  ['#d97706', '#fef3c7'],   // Amber
  ['#16a34a', '#dcfce7'],   // Green
  ['#7c3aed', '#ede9fe'],   // Purple
  ['#0090c5', '#e0f7ff'],   // Cyan dark
  ['#c4006b', '#ffe0f5'],   // Magenta dark
];

interface CategoryChipProps {
  category: Category;
  index?: number;
  isActive?: boolean;
  size?: 'sm' | 'md';
}

export function CategoryChip({ category, index = 0, isActive = false, size = 'md' }: CategoryChipProps) {
  const Icon = ICON_MAP[category.icon] || Layers;
  const [iconColor, bgColor] = COLOR_PAIRS[index % COLOR_PAIRS.length];

  const iconSize = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  const iconPx = size === 'sm' ? 20 : 26;
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs';
  const maxWidth = size === 'sm' ? 'max-w-[56px]' : 'max-w-[72px]';

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all duration-200 ${maxWidth} group`}
      aria-label={`${category.name} - ${category._count?.products || 0} products`}
    >
      <div
        className={`${iconSize} rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg`}
        style={{
          background: isActive ? iconColor : bgColor,
          boxShadow: isActive ? `0 4px 16px ${iconColor}40` : undefined,
          border: isActive ? `2px solid ${iconColor}` : '2px solid transparent',
        }}
      >
        <Icon
          size={iconPx}
          style={{ color: isActive ? 'white' : iconColor }}
          strokeWidth={1.8}
        />
      </div>
      <span
        className={`${textSize} font-semibold text-center leading-tight truncate w-full`}
        style={{ color: isActive ? iconColor : '#444444' }}
      >
        {category.name}
      </span>
    </Link>
  );
}

interface CategoryStripProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryStrip({ categories, activeSlug }: CategoryStripProps) {
  return (
    <div
      className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
      role="navigation"
      aria-label="Product categories"
    >
      {categories.map((cat, i) => (
        <CategoryChip
          key={cat.id}
          category={cat}
          index={i}
          isActive={cat.slug === activeSlug}
        />
      ))}
    </div>
  );
}

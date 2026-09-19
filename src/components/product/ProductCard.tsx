'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Star, Zap, Plus, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const getItemByProductId = useCartStore((s) => s.getItemByProductId);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const inCart = !!getItemByProductId(product.id);
  const primaryImage = (product.images as string[])[0] || '/uploads/placeholder.jpg';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (added) return;

    setAdding(true);
    // Optimistic update
    const firstVariant = product.variants?.[0] as ProductVariant | undefined;
    addItem(product, firstVariant);

    await new Promise((r) => setTimeout(r, 300));
    setAdding(false);
    setAdded(true);



    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card overflow-hidden flex flex-col group cursor-pointer"
      aria-label={`${product.name}, starting at ${formatPrice(product.basePrice)}`}
    >
      {/* Product image */}
      <div className="relative overflow-hidden bg-[#f8f9fa] aspect-square">
        <Image
          src={primaryImage}
          alt={`${product.name} - custom printed at Hashtag Salem`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="badge badge-magenta text-[12px] px-2 py-0.5">
              <Zap size={9} />Bestseller
            </span>
          )}
          {product.isFeatured && !product.isBestseller && (
            <span className="badge badge-cyan text-[12px] px-2 py-0.5">Featured</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[12px] text-[#888] font-medium uppercase tracking-wide mb-0.5 truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-[#111] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={11} className="fill-[#fcd502] text-[#fcd502]" />
            <span className="text-xs font-semibold text-[#444]">
              {Number(product.avgRating).toFixed(1)}
            </span>
            <span className="text-[12px] text-[#888]">({product.reviewCount})</span>
          </div>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-2.5 gap-1 sm:gap-2">
          <div className="leading-none flex flex-col sm:flex-row sm:items-baseline">
            <span className="text-[15px] sm:text-base font-black text-[#111]">
              {formatPrice(product.basePrice)}
            </span>
            <span className="text-[11px] sm:text-[12px] text-[#888] sm:ml-1 mt-0.5 sm:mt-0">onwards</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[12px] sm:text-xs font-bold transition-all duration-200 min-h-[28px] sm:min-h-[32px]"
            style={{
              background: added
                ? '#16a34a'
                : adding
                ? 'rgba(0,174,239,0.1)'
                : 'linear-gradient(135deg, #01a2fb, #0090c5)',
              color: added ? 'white' : adding ? '#01a2fb' : 'white',
              transform: adding ? 'scale(0.95)' : 'scale(1)',
            }}
            aria-label={added ? 'Added to cart' : 'Add to cart'}
          >
            {added ? (
              <><Check size={12} /> Added</>
            ) : adding ? (
              <><Plus size={12} className="animate-spin" /> Adding...</>
            ) : (
              <><ShoppingCart size={12} /> Add</>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

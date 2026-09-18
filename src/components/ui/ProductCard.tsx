"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Zap, Heart, Check, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export function ProductCard({ product, onSelect }: { product: any, onSelect?: (product: any) => void }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelect) {
      onSelect(product);
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(product);
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  return (
    <div onClick={handleClick} className="card overflow-hidden flex flex-col group relative cursor-pointer" aria-label={product.name}>
      <div className="relative overflow-hidden bg-[#f8f9fa] aspect-square">
        <Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw,33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" unoptimized />
        {product.bestseller && (
          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-pink-100">
            <Zap size={10} className="text-pink-500 fill-pink-500" />
            <span className="text-[9px] font-bold text-pink-600 uppercase tracking-wide">Bestseller</span>
          </div>
        )}
        <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
          <Heart size={14} className={isMounted && isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="p-2 sm:p-3 flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center gap-0.5 bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[10px] font-bold text-[#333]">
            <Star size={9} className="fill-[#0f8a3c] text-[#0f8a3c]" />
            {product.rating}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>
        
        <h3 className="font-bold text-[#111] text-[13px] leading-tight mb-1 line-clamp-2 group-hover:text-[#0f8a3c] transition-colors">{product.name}</h3>
        
        <p className="text-[11px] text-gray-500 mb-2 truncate uppercase tracking-wide">{product.category}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-[15px] sm:text-[17px] text-[#111] leading-none">{formatPrice(product.price)}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">onwards</span>
          </div>
          <button onClick={handleAdd} className="w-8 h-8 rounded-full border border-[#0f8a3c] text-[#0f8a3c] flex items-center justify-center hover:bg-[#0f8a3c] hover:text-white transition-colors active:scale-95 group/btn">
            <Plus size={16} className="transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

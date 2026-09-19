"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Zap, Heart, Check, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductCard({ product, onSelect }: { product: any, onSelect?: (product: any) => void }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSmashing, setIsSmashing] = useState(false);

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
    const willBeWishlisted = !isWishlisted;
    if (willBeWishlisted) {
      setIsSmashing(true);
      setTimeout(() => setIsSmashing(false), 1000);
    }
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
          <AnimatePresence>
            {isSmashing && (
               <>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-pink-400 pointer-events-none"
                  />
                  {[...Array(6)].map((_, i) => (
                     <motion.div
                       key={i}
                       className="absolute w-[5px] h-[5px] bg-pink-500 rounded-full pointer-events-none"
                       style={{ top: '50%', left: '50%', marginTop: '-2.5px', marginLeft: '-2.5px' }}
                       initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                       animate={{ 
                         opacity: 0, 
                         scale: 1,
                         x: Math.cos(i * (Math.PI / 3)) * 24, 
                         y: Math.sin(i * (Math.PI / 3)) * 24 
                       }}
                       transition={{ duration: 0.4, ease: "easeOut" }}
                     />
                  ))}
               </>
            )}
          </AnimatePresence>
          <motion.div
            animate={isSmashing ? { scale: [1, 0.7, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, times: [0, 0.2, 0.6, 1], ease: "easeInOut" }}
          >
            <Heart size={14} className={isMounted && isWishlisted ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
          </motion.div>
        </button>
      </div>

      <div className="p-2 sm:p-3 flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center gap-0.5 bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[10px] font-bold text-[#333]">
            <Star size={9} className="fill-[#fcd502] text-[#fcd502]" />
            {product.rating}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews})</span>
        </div>
        
        <h3 className="font-bold text-[#111] text-[13px] leading-tight mb-1 line-clamp-2 group-hover:text-[#01a2fb] transition-colors">{product.name}</h3>
        
        <p className="text-[11px] text-gray-500 mb-2 truncate uppercase tracking-wide">{product.category}</p>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-black text-[15px] sm:text-[17px] text-[#111] leading-none">{formatPrice(product.price)}</span>
            <span className="text-[9px] text-gray-400 mt-0.5">onwards</span>
          </div>
          <button onClick={handleAdd} className="w-8 h-8 rounded-full border border-[#01a2fb] text-[#01a2fb] flex items-center justify-center hover:bg-[#01a2fb] hover:text-white transition-colors active:scale-95 group/btn">
            <Plus size={16} className="transition-transform group-hover/btn:rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  ChevronDown, Search, Share2, ChevronRight,
  Star, Clock, RotateCcw, Plus, Minus, ShoppingBag, Check
} from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DemoProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  description?: string;
  category?: string;
}

interface ProductBottomSheetProps {
  product: DemoProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZES   = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLORS  = [
  { label: 'White',   hex: '#FFFFFF', border: '#ccc' },
  { label: 'Black',   hex: '#111111', border: '#111' },
  { label: 'Navy',    hex: '#1e3a5f', border: '#1e3a5f' },
  { label: 'Red',     hex: '#D32F2F', border: '#D32F2F' },
  { label: 'Teal',    hex: '#00796B', border: '#00796B' },
  { label: 'Yellow',  hex: '#FDD835', border: '#e5c100' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ProductBottomSheet({ product, isOpen, onClose }: ProductBottomSheetProps) {
  // Sheet expansion state
  const [isFullScreen, setIsFullScreen]   = useState(false);
  // Selection state
  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty,           setQty]           = useState(1);
  const [addedToCart,   setAddedToCart]   = useState(false);

  // Cart store
  const addItem  = useCartStore(s => s.addItem);
  const items    = useCartStore(s => s.items);

  const scrollRef   = useRef<HTMLDivElement>(null);
  const sheetRef    = useRef<HTMLDivElement>(null);

  // Reset when product changes / sheet opens
  useEffect(() => {
    if (isOpen && product) {
      setIsFullScreen(false);
      setSelectedSize('');
      setSelectedColor('');
      setQty(1);
      setAddedToCart(false);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [isOpen, product?.id]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Expand to full-screen when user scrolls down inside the sheet
  const handleContentScroll = useCallback(() => {
    if (!isFullScreen && scrollRef.current && scrollRef.current.scrollTop > 10) {
      setIsFullScreen(true);
    }
  }, [isFullScreen]);

  if (!product) return null;

  // Price calculations
  const mrp       = Math.round(product.price * 1.32);
  const discount  = Math.round(((mrp - product.price) / mrp) * 100);
  const colorObj  = COLORS.find(c => c.label === selectedColor) || COLORS[0];

  // Cart info
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = items.reduce((s, i) => s + (Number(i.product?.basePrice || 0) * i.quantity), 0);
  const lastImg   = items[items.length - 1]?.product?.images?.[0] ?? null;

  // ── Add to cart ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    // Build a synthetic Product object that matches the real Product interface
    const syntheticProduct = {
      id:           product.id,
      categoryId:   1,
      name:         product.name,
      slug:         product.slug,
      description:  product.description || '',
      basePrice:    product.price,
      images:       [product.image],
      tags:         [selectedColor, selectedSize],
      isActive:     true,
      isFeatured:   false,
      isBestseller: false,
      avgRating:    product.rating  || 4.5,
      reviewCount:  product.reviews || 0,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    } as any; // cast to any since demo product has no DB id

    // Build a synthetic variant carrying size + color — this is what flows to admin orders
    const syntheticVariant = {
      id:            product.id * 100 + SIZES.indexOf(selectedSize), // stable synthetic ID
      productId:     product.id,
      size:          selectedSize,
      color:         selectedColor,
      material:      'Custom Print',
      priceModifier: 0,
      stock:         99,
      sku:           `${product.slug}-${selectedSize}-${selectedColor.toLowerCase()}`,
      isActive:      true,
    } as any;

    addItem(syntheticProduct, syntheticVariant, undefined, qty);
    setAddedToCart(true);
    toast.success(`Added to cart — Size: ${selectedSize}, Color: ${selectedColor}`, { icon: '🛒', duration: 2500 });
  };

  // ── Drag handler ──────────────────────────────────────────────────────────────
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 120 && !isFullScreen) {
      onClose();                  // drag down → close
    } else if (info.velocity.y < -300 || info.offset.y < -60) {
      setIsFullScreen(true);      // fast flick up → expand
    } else if (isFullScreen && info.offset.y > 80) {
      setIsFullScreen(false);     // drag down from full → collapse to 3/4
    }
  };

  // ── Sheet height ──────────────────────────────────────────────────────────────
  // isFullScreen=false → sheet top at 25% → sheet height = 75vh (3/4)
  // isFullScreen=true  → sheet top at 0%  → full screen
  const sheetY = isFullScreen ? '0%' : '25%';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="bs-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          {/* ── Sheet ── */}
          <motion.div
            key="bs-sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: sheetY }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.8 }}
            drag="y"
            dragListener={!isFullScreen}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            className="fixed left-0 right-0 bottom-0 z-[70] bg-white flex flex-col max-w-[600px] mx-auto"
            style={{
              height: '100dvh',
              borderTopLeftRadius:  isFullScreen ? 0 : 22,
              borderTopRightRadius: isFullScreen ? 0 : 22,
              overflow: 'hidden',
              willChange: 'transform',
            }}
          >

            {/* ── Top icon bar (always visible) ── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pointer-events-none">
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg pointer-events-auto active:scale-90 transition-transform"
              >
                <ChevronDown size={22} className="text-[#333]" />
              </button>
              <div className="flex items-center gap-2 pointer-events-auto">
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                  <Search size={18} className="text-[#333]" />
                </button>
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg">
                  <Share2 size={18} className="text-[#333]" />
                </button>
              </div>
            </div>

            {/* Drag pill (only visible in 3/4 mode) */}
            {!isFullScreen && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-10 h-1.5 bg-gray-300 rounded-full" />
            )}

            {/* ── Scrollable body ── */}
            <div
              ref={scrollRef}
              onScroll={handleContentScroll}
              onTouchMove={handleContentScroll}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 100 }}
            >

              {/* Hero Image */}
              <div
                className="relative w-full bg-[#f2f2f2] cursor-pointer"
                style={{ height: 'clamp(200px, 55vw, 360px)' }}
                onClick={() => setIsFullScreen(true)}
              >
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  unoptimized
                  priority
                />
                {/* Image indicator dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <div key={i} className={`rounded-full transition-all ${i===0 ? 'w-5 h-1.5 bg-[#0f8a3c]' : 'w-1.5 h-1.5 bg-gray-300'}`} />
                  ))}
                </div>
              </div>

              {/* ── Spec Pills ── */}
              <div className="bg-white border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
                <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 min-w-[100px]">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Delivery</p>
                  <p className="text-[13px] font-black text-[#111]">Same Day</p>
                </div>
                <div className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 min-w-[110px]">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Category</p>
                  <p className="text-[13px] font-black text-[#111] line-clamp-1">{product.category || 'Custom'}</p>
                </div>
              </div>

              {/* ── Main product info ── */}
              <div className="bg-white px-4 pt-4 pb-5">
                {/* Rating + Delivery row */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-[#666]">
                    <Clock size={13} />
                    <span className="text-[12px] font-semibold">22 mins</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={12}
                        className={s <= Math.round(product.rating || 4.5)
                          ? 'fill-[#FFB800] text-[#FFB800]'
                          : 'fill-gray-200 text-gray-200'}
                      />
                    ))}
                    <span className="text-[12px] font-bold text-[#333] ml-1">{product.reviews || 0}</span>
                  </div>
                </div>

                {/* Product name */}
                <h1 className="text-[20px] font-black text-[#111] leading-snug mb-1">{product.name}</h1>
                {product.description && (
                  <p className="text-[13px] text-[#777] leading-relaxed mb-4">{product.description}</p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[28px] font-black text-[#111] leading-none">₹{product.price}</span>
                  <span className="text-[14px] text-[#888] line-through font-medium">MRP ₹{mrp}</span>
                  <span className="text-[12px] font-black text-[#0f8a3c] bg-[#eafbf0] px-1.5 py-0.5 rounded">{discount}% off</span>
                </div>
                <p className="text-[11px] text-[#888] font-medium mb-5">₹{product.price}/piece  •  Inclusive of all taxes</p>

                {/* ── Variant Selectors ── */}
                <div id="variant-selectors">
                  {/* ── Size Selector ── */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-black text-[#111]">Select Size</h3>
                      <span className="text-[12px] text-[#0284c7] font-semibold">Size Guide</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 rounded-xl text-[13px] font-bold border-2 transition-all duration-150 active:scale-95 ${
                            selectedSize === size
                              ? 'bg-[#0f8a3c] text-white border-[#0f8a3c] shadow-md'
                              : 'bg-white text-[#444] border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Color Selector ── */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-black text-[#111]">Select Colour</h3>
                      <span className="text-[12px] text-[#666] font-semibold">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {COLORS.map(c => (
                        <button
                          key={c.label}
                          onClick={() => setSelectedColor(c.label)}
                          title={c.label}
                          className={`relative w-9 h-9 rounded-full transition-all duration-150 active:scale-90 ${
                            selectedColor === c.label ? 'ring-2 ring-offset-2 ring-[#0f8a3c]' : ''
                          }`}
                          style={{ backgroundColor: c.hex, border: `2px solid ${c.border}` }}
                        >
                          {selectedColor === c.label && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check size={14} className={c.label === 'White' || c.label === 'Yellow' ? 'text-gray-700 stroke-[3]' : 'text-white stroke-[3]'} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Quantity Selector ── */}
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-[14px] font-black text-[#111]">Quantity</h3>
                  <div className="flex items-center gap-0 border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-[15px] font-black text-[#111]">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(50, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {qty >= 10 && (
                    <span className="text-[11px] font-bold text-[#0f8a3c] bg-[#eafbf0] px-2 py-1 rounded-full">Bulk discount applied!</span>
                  )}
                </div>
              </div>

              {/* ── Brand Row ── */}
              <div className="bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#eafbf0] border border-[#c3f0d0] flex items-center justify-center">
                    <ShoppingBag size={22} className="text-[#0f8a3c]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#111]">Hashtag Prints, Salem</p>
                    <p className="text-[12px] text-[#0f8a3c] font-semibold">Explore all products</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#aaa]" />
              </div>

              {/* ── 72hr Replacement ── */}
              <div className="bg-white border-t border-gray-100 px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#eff8ff] border border-[#bae1ff] flex items-center justify-center">
                    <RotateCcw size={20} className="text-[#0284c7]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#111]">72 hours only replacement</p>
                    <p className="text-[12px] text-[#888] font-medium">Subject to our return policy</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#aaa]" />
              </div>

              {/* ── About product ── */}
              <div className="bg-white border-t border-gray-100 px-4 pt-4 pb-8">
                <h3 className="text-[15px] font-black text-[#111] mb-3">About this product</h3>
                <div className="space-y-2.5">
                  {[
                    'Premium DTF / screen print on top-grade fabric',
                    'Custom artwork, logos, and photo prints',
                    'Same-day dispatch on orders placed before 12 PM',
                    'Colour-accurate, UV-resistant, wash-safe prints',
                    'Bulk orders: 10+ pieces get up to 40% off',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#eafbf0] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-1.5 h-1.5 bg-[#0f8a3c] rounded-full" />
                      </div>
                      <p className="text-[13px] text-[#555] font-medium leading-snug">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
            {/* end scrollable */}

            {/* ── Fixed Bottom Bar ── */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
              {addedToCart ? (
                /* After adding — show cart summary on left, +/- on right */
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#f0f0f0] overflow-hidden relative flex-shrink-0">
                      <Image src={product.image || '/placeholder.png'} alt={product.name} fill className="object-contain p-1" unoptimized />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-black text-[#111] leading-none">
                        ₹{product.price * qty}
                        <span className="text-[11px] font-medium text-[#888] ml-1 line-through">₹{mrp * qty}</span>
                      </p>
                      <p className="text-[11px] text-[#555] font-medium mt-0.5 truncate">
                        {qty}× · {selectedSize} · {selectedColor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center border-2 border-[#0f8a3c] rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#0f8a3c] hover:bg-[#eafbf0]">
                      <Minus size={16} />
                    </button>
                    <span className="w-9 text-center text-[15px] font-black text-[#0f8a3c]">{qty}</span>
                    <button onClick={() => { setQty(q => q + 1); handleAddToCart(); }} className="w-10 h-10 flex items-center justify-center text-[#0f8a3c] hover:bg-[#eafbf0]">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Before adding — show price on left, Add to cart on right */
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#888] font-medium">
                      {selectedSize} · {selectedColor}
                    </p>
                    <p className="text-[16px] font-black text-[#111] leading-none">
                      ₹{product.price}
                      <span className="text-[12px] font-medium text-[#888] ml-1.5 line-through">₹{mrp}</span>
                    </p>
                    <p className="text-[10px] text-[#555] mt-0.5">Inclusive of all taxes</p>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-[#0f8a3c] hover:bg-[#0a7032] text-white px-7 py-3.5 rounded-xl font-black text-[15px] shadow-[0_4px_14px_rgba(15,138,60,0.35)] active:scale-95 transition-all whitespace-nowrap"
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

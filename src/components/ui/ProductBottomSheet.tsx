"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Search, Share2, ChevronRight,
  Star, Clock, RotateCcw, Plus, Minus, ShoppingBag, Check, Heart
} from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { ALL_PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { getProductOptions } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';

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
  categorySlug?: string;
}

interface ProductBottomSheetProps {
  product: DemoProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: any) => void;
}

// ─── Product Detail Card (Inner Component) ────────────────────────────────────
function ProductDetailCard({ 
  product, 
  onClose, 
  onCollapse,
  isExpanded, 
  onExpand,
  layoutId,
  onSelectProduct
}: { 
  product: DemoProduct; 
  onClose: () => void;
  onCollapse: () => void;
  isExpanded: boolean; 
  onExpand: () => void;
  layoutId?: string;
  onSelectProduct?: (product: any) => void;
}) {

  const [selectedSize,  setSelectedSize]  = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty,           setQty]           = useState(1);
  const [addedToCart,   setAddedToCart]   = useState(false);

  const addItem         = useCartStore(s => s.addItem);
  const items           = useCartStore(s => s.items);
  const updateQuantity  = useCartStore(s => s.updateQuantity);
  const scrollRef       = useRef<HTMLDivElement>(null);

  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    const isAtTop = !scrollRef.current || scrollRef.current.scrollTop <= 2;
    if (diff > 30 && !isExpanded) {
      onExpand();
    } else if (diff < -40 && isExpanded && isAtTop) {
      onCollapse();
    }
    setTouchStartY(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const isAtTop = !scrollRef.current || scrollRef.current.scrollTop <= 2;
    if (e.deltaY > 40 && !isExpanded) {
      onExpand();
    } else if (e.deltaY < -40 && isExpanded && isAtTop) {
      onCollapse();
    }
  };

  const { hasSizes, hasColors, sizes: SIZES, colors: COLORS } = getProductOptions(product.categorySlug || '');

  const mrp       = Math.round(product.price * 1.32);
  const discount  = Math.round(((mrp - product.price) / mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ((hasSizes && !selectedSize) || (hasColors && !selectedColor)) {
      if (!isExpanded) {
        onExpand();
      }
      setTimeout(() => {
        const variantSection = document.getElementById(`variant-selectors-${product.id}`);
        if (variantSection && scrollRef.current) {
          scrollRef.current.scrollTo({
            top: variantSection.offsetTop - 60,
            behavior: 'smooth'
          });
        }
        toast.error('Please select required options', { id: 'variant-toast' });
      }, 150);
      return;
    }

    const syntheticProduct = {
      id:           product.id,
      name:         product.name,
      basePrice:    product.price,
      categoryId:   1, // mock
      slug:         product.slug,
      images:       [product.image],
      description:  product.description || '',
      tags:         [selectedColor, selectedSize].filter(Boolean),
      isActive:     true,
      isFeatured:   false,
      isBestseller: false,
      avgRating:    product.rating  || 4.5,
      reviewCount:  product.reviews || 0,
      createdAt:    new Date().toISOString(),
      updatedAt:    new Date().toISOString(),
    } as any;

    const syntheticVariant = {
      id:            product.id * 100 + (hasSizes ? Math.max(0, SIZES.indexOf(selectedSize)) : 0),
      productId:     product.id,
      size:          hasSizes ? selectedSize : undefined,
      color:         hasColors ? selectedColor : undefined,
      material:      'Custom Print',
      priceModifier: 0,
      stock:         99,
      sku:           `${product.slug}-${hasSizes ? selectedSize : 'std'}-${hasColors ? selectedColor.toLowerCase() : 'std'}`,
      isActive:      true,
    } as any;

    addItem(syntheticProduct, syntheticVariant, undefined, qty);
    setAddedToCart(true);
    
    // Trigger confetti animation
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#00AEEF', '#EC008C', '#FFD700', '#0f8a3c'],
        zIndex: 9999
      });
    });
  };

  return (
    <motion.div
      layoutId={layoutId}
      animate={{
        borderRadius: isExpanded ? '0px' : '24px',
      }}
      transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.55 }}
      className="relative w-full h-full flex flex-col bg-white overflow-hidden shadow-2xl ring-1 ring-black/5 cursor-pointer origin-bottom"
      onClick={() => { if (!isExpanded) onExpand(); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ willChange: 'transform, border-radius' }}
    >
      
      {/* ── Top icon bar (always visible) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center shadow-sm pointer-events-auto active:scale-90 transition-transform"
        >
          <ChevronDown size={22} className="text-[#333]" />
        </button>
        <div className="flex items-center gap-2 pointer-events-auto">
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center shadow-sm active:scale-90">
            <Heart size={18} className="text-[#333]" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center shadow-sm active:scale-90">
            <Search size={18} className="text-[#333]" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-md border border-gray-200 rounded-full flex items-center justify-center shadow-sm active:scale-90">
            <Share2 size={18} className="text-[#333]" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-x-hidden flex flex-col ${isExpanded ? 'overflow-y-auto pb-[130px]' : 'overflow-y-hidden select-none pb-[150px]'}`}
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        {/* Hero Image */}
        <div className={`relative w-full bg-[#f8f9fa] flex flex-col transition-[flex,height] duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isExpanded ? 'flex-none h-[42vh] min-h-[300px]' : 'flex-1 min-h-[120px]'}`}>
          <div className="relative flex-1 w-full mt-12 mb-8">
            <Image
              src={product.image || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain px-8 drop-shadow-xl"
              unoptimized
              priority
            />
          </div>
          {/* Image indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className={`rounded-full transition-all ${i===0 ? 'w-5 h-1.5 bg-[#0f8a3c]' : 'w-1.5 h-1.5 bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* ── Main product info (Ultra Compact for Mobile) ── */}
        <div className="bg-white px-4 pt-3 pb-2 flex-none flex flex-col justify-end">
          {/* Category, Time & Rating Row */}
          <div className="flex items-center gap-2 mb-2 w-full">
            <div className="flex items-center gap-1 bg-[#eafbf0] text-[#0f8a3c] px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">
              <Clock size={12} className="stroke-[2.5] flex-shrink-0" />
              <span className="text-[12px] font-bold">22 mins</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md min-w-0 overflow-hidden">
              <span className="text-[12px] font-bold truncate">{product.category || 'Custom'}</span>
            </div>
            <div className="flex items-center gap-1 ml-auto bg-gray-50 px-2 py-1 rounded-md border border-gray-100 whitespace-nowrap flex-shrink-0">
              <Star size={11} className="fill-[#FFB800] text-[#FFB800] flex-shrink-0" />
              <span className="text-[12px] font-bold text-[#333]">{product.reviews || 0} reviews</span>
            </div>
          </div>

          {/* Product name */}
          <h1 className="text-[19px] font-black text-[#111] leading-tight mb-1">{product.name}</h1>
          
          {/* Description (Hidden in Summary Mode) */}
          {product.description && isExpanded && (
            <p className="text-[14px] text-[#777] leading-relaxed mb-3 mt-2 line-clamp-2">{product.description}</p>
          )}

          {/* Price & Taxes */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[25px] font-black text-[#111] leading-none">₹{product.price}</span>
            <span className="text-[14px] text-[#888] line-through font-medium">₹{mrp}</span>
            <span className="text-[12px] font-black text-[#0f8a3c] bg-[#eafbf0] px-1.5 py-0.5 rounded ml-1">{discount}% off</span>
          </div>
          <p className="text-[11px] text-[#888] font-medium mb-3 mt-1">₹{product.price}/piece  •  Inclusive of all taxes</p>

          {/* ── Brand & Replacement Mini-Pills ── */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={14} className="text-[#0f8a3c]" />
                <p className="text-[13px] font-black text-[#111]">Hashtag Prints, Salem</p>
              </div>
              <p className="text-[12px] text-[#0f8a3c] font-bold flex items-center gap-0.5">Explore <ChevronRight size={12}/></p>
            </div>
          </div>

          {/* ── Variant & Quantity (Hidden in Summary Mode) ── */}
          <div className={isExpanded ? 'block' : 'hidden'}>
            <div id={`variant-selectors-${product.id}`} className="mt-4">
              {/* Size Selector */}
              {hasSizes && (
                <div className="mb-5 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-black text-[#111]">{getProductOptions(product.categorySlug || '').sizeTitle}</h3>
                    <span className="text-[14px] text-[#0284c7] font-semibold cursor-pointer">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                      <button
                        key={size}
                        onClick={(e) => { e.stopPropagation(); setSelectedSize(size); }}
                        className={`px-4 py-2.5 rounded-xl text-[15px] font-bold border-2 transition-all duration-150 active:scale-95 ${
                          selectedSize === size
                            ? 'bg-[#0f8a3c] text-white border-[#0f8a3c] shadow-sm'
                            : 'bg-white text-[#444] border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {hasColors && (
                <div className="mb-5 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-black text-[#111]">{getProductOptions(product.categorySlug || '').colorTitle}</h3>
                    <span className="text-[14px] text-[#666] font-semibold">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.label}
                        onClick={(e) => { e.stopPropagation(); setSelectedColor(c.label); }}
                        title={c.label}
                        className={`relative w-10 h-10 rounded-full transition-all duration-150 active:scale-90 ${
                          selectedColor === c.label ? 'ring-2 ring-offset-2 ring-[#0f8a3c]' : ''
                        }`}
                        style={{ backgroundColor: c.hex, border: `2px solid ${c.border}` }}
                      >
                        {selectedColor === c.label && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Check size={16} className={c.label === 'White' || c.label === 'Yellow' ? 'text-gray-700 stroke-[3]' : 'text-white stroke-[3]'} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-5 mb-2">
              <div>
                <h3 className="text-[16px] font-black text-[#111]">Quantity</h3>
                {qty >= 10 && (
                  <p className="text-[13px] font-bold text-[#0f8a3c] mt-0.5">Bulk discount applied!</p>
                )}
              </div>
              <div className="flex items-center gap-0 border-2 border-gray-200 rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => {
                    const newQty = Math.max(1, qty - 1);
                    setQty(newQty);
                    if (addedToCart) {
                      const cartItem = items.find(i => i.productId === product.id && i.variantId === (product.id * 100 + SIZES.indexOf(selectedSize)));
                      if (cartItem) updateQuantity(cartItem.id, newQty);
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-[17px] font-black text-[#111] bg-white leading-[40px]">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(50, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Relevant Products ── */}
        <div className={`bg-white border-t border-gray-100 px-4 pt-5 pb-8 ${isExpanded ? 'block' : 'hidden'}`} onClick={e => e.stopPropagation()}>
          <h3 className="text-[17px] font-black text-[#111] mb-4">Relevant Products</h3>
          <div className="grid grid-cols-2 gap-3 pb-8">
            {(ALL_PRODUCTS || []).filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      </div>
      {/* ── end scrollable ── */}

      {/* ── Fixed Bottom Bar (Inside Card) ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]" onClick={e => e.stopPropagation()}>
        {addedToCart ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#f0f0f0] overflow-hidden relative flex-shrink-0">
                <Image src={product.image || '/placeholder.png'} alt={product.name} fill className="object-contain p-1" unoptimized />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-black text-[#111] leading-none">
                  ₹{product.price * qty}
                  <span className="text-[13px] font-medium text-[#888] ml-1 line-through">₹{mrp * qty}</span>
                </p>
                <p className="text-[13px] text-[#555] font-medium mt-0.5 truncate">
                  {qty}× {hasSizes ? `· ${selectedSize}` : ''} {hasColors ? `· ${selectedColor}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center border-2 border-[#0f8a3c] rounded-xl overflow-hidden bg-white shadow-sm">
              <button onClick={() => {
                const newQty = Math.max(1, qty - 1);
                setQty(newQty);
                const cartItem = items.find(i => i.productId === product.id && i.variantId === (product.id * 100 + SIZES.indexOf(selectedSize)));
                if (cartItem) updateQuantity(cartItem.id, newQty);
              }} className="w-10 h-10 flex items-center justify-center text-[#0f8a3c] hover:bg-[#eafbf0]">
                <Minus size={16} />
              </button>
              <span className="w-9 text-center text-[17px] font-black text-[#0f8a3c] leading-[40px]">{qty}</span>
              <button onClick={() => {
                const newQty = qty + 1;
                setQty(newQty);
                const cartItem = items.find(i => i.productId === product.id && i.variantId === (product.id * 100 + SIZES.indexOf(selectedSize)));
                if (cartItem) updateQuantity(cartItem.id, newQty);
              }} className="w-10 h-10 flex items-center justify-center text-[#0f8a3c] hover:bg-[#eafbf0]">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] text-[#888] font-medium">
                {qty} {qty > 1 ? 'pieces' : 'piece'}
              </p>
              <p className="text-[18px] font-black text-[#111] leading-none mt-0.5">₹{product.price * qty}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-[#0f8a3c] hover:bg-[#0c7031] text-white px-6 h-11 rounded-xl text-[16px] font-black flex items-center justify-center gap-2 transition-colors shadow-md active:scale-[0.98]"
            >
              Add to cart
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
export function ProductBottomSheet({ product, isOpen, onClose, onSelectProduct }: ProductBottomSheetProps) {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const startIndex = product ? Math.max(0, (ALL_PRODUCTS || []).findIndex(p => p.id === product.id)) : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center',
    skipSnaps: false,
    dragFree: false,
    duration: 40,
    dragThreshold: 5,
    startIndex
  });

  // Reset expanded state when opening
  useEffect(() => {
    if (isOpen) {
      setExpandedProductId(null);
    }
  }, [isOpen]);

  // Sync Embla to the product prop (if it was changed from outside or related products)
  useEffect(() => {
    if (!emblaApi || !product) return;
    const index = (ALL_PRODUCTS || []).findIndex(p => p.id === product.id);
    if (index >= 0 && index !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(index, true);
    }
  }, [emblaApi, product?.id]);

  // Sync selected product when swiping
  useEffect(() => {
    if (!emblaApi || !onSelectProduct) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      if ((ALL_PRODUCTS || [])[index]) {
        onSelectProduct((ALL_PRODUCTS || [])[index]);
      }
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelectProduct]);

  // Disable drag when expanded
  useEffect(() => {
    if (!emblaApi) return;
    const isExpanded = expandedProductId !== null;
    emblaApi.reInit({ watchDrag: !isExpanded });
  }, [expandedProductId, emblaApi]);

  // Lock body scroll and emit events for FloatingCartButton
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overscrollBehavior = 'none';

      window.dispatchEvent(new Event('productSheetOpened'));
      window.dispatchEvent(new Event('productSheetFullScreen'));
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overscrollBehavior = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }

      window.dispatchEvent(new Event('productSheetClosed'));
      window.dispatchEvent(new Event('productSheetPartial'));
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overscrollBehavior = '';
      window.dispatchEvent(new Event('productSheetClosed'));
    };
  }, [isOpen]);

  const handleClose = () => {
    if (expandedProductId !== null) {
      // If expanded, collapse first
      setExpandedProductId(null);
    } else {
      // If summary, close modal
      onClose();
    }
  };

  const isAnyExpanded = expandedProductId !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end pointer-events-auto">
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* ── Carousel Container (Always Summary Mode) ── */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.55 }}
            className="relative z-10 w-full"
            style={{ 
              height: 'calc(100dvh - 3rem - 16px)',
              marginTop: 48,
              marginBottom: 12
            }}
          >
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full touch-pan-y pl-4">
                {(ALL_PRODUCTS || []).map((p) => {
                  // We only render the layoutId if this card is NOT currently expanded.
                  // If it IS expanded, the layoutId is rendered in the full-screen overlay below.
                  const isThisExpanded = expandedProductId === p.id;
                  
                  return (
                    <div
                      key={p.id}
                      className="h-full relative flex-shrink-0 flex-[0_0_92%] pr-3"
                    >
                      {/* Hide the carousel card when it is expanded, the layoutId component will take over */}
                      <div className="w-full h-full" style={{ opacity: isThisExpanded ? 0 : 1 }}>
                        {!isThisExpanded && (
                          <ProductDetailCard 
                            product={p} 
                            onClose={handleClose}
                            onCollapse={() => setExpandedProductId(null)}
                            isExpanded={false}
                            onExpand={() => setExpandedProductId(p.id)}
                            layoutId={`product-card-${p.id}`}
                            onSelectProduct={onSelectProduct}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ── Full Screen Expanded Overlay ── */}
          <AnimatePresence>
            {expandedProductId && (
              <div className="fixed inset-0 z-[70] pointer-events-auto">
                <ProductDetailCard 
                  product={(ALL_PRODUCTS || []).find(p => p.id === expandedProductId)!} 
                  onClose={handleClose}
                  onCollapse={() => setExpandedProductId(null)}
                  isExpanded={true}
                  onExpand={() => {}}
                  layoutId={`product-card-${expandedProductId}`}
                  onSelectProduct={(p) => {
                    if (onSelectProduct) onSelectProduct(p);
                    setExpandedProductId(p.id);
                  }}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}

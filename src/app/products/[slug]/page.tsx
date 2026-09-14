'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, ShoppingCart, ChevronRight, Check,
  Minus, Plus, Info, Zap, ArrowLeft, Heart
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import { ALL_PRODUCTS } from '../page';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLORS = ['White', 'Black', 'Navy Blue', 'Red', 'Yellow', 'Royal Blue'];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  // Find product from demo data
  const product = ALL_PRODUCTS.find(p => p.slug === slug);
  const isWishlisted = useWishlistStore((s) => product ? s.hasItem(product.id) : false);

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <div className="text-6xl font-black mb-4" style={{
          background: 'linear-gradient(135deg,#00AEEF,#EC008C)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>404</div>
        <h1 className="text-xl font-black text-[#111] mb-3">Product not found</h1>
        <p className="text-[#888] text-sm mb-6">The product you&apos;re looking for may have been moved or removed.</p>
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const hasSizes = product.categorySlug === 'custom-tshirt-printing';
  const hasColors = product.categorySlug === 'custom-tshirt-printing';
  const images = [product.image];
  const unitPrice = product.price;
  const totalPrice = unitPrice * quantity;

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: isWishlisted ? '💔' : '❤️' });
  };

  const handleAddToCart = () => {
    try {
      if (hasSizes && !selectedSize) {
        toast.error('Please select a size');
        const btn = document.getElementById('mobile-add-btn');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'SELECT SIZE FIRST!';
          btn.style.backgroundColor = '#dc2626'; // Red
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
          }, 2000);
        }
        return;
      }
      if (hasColors && !selectedColor) {
        toast.error('Please select a colour');
        const btn = document.getElementById('mobile-add-btn');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'SELECT COLOUR FIRST!';
          btn.style.backgroundColor = '#dc2626'; // Red
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
          }, 2000);
        }
        return;
      }
      // @ts-ignore demo mode
      addItem(
        { id: product.id, name: product.name, basePrice: product.price, images: [product.image], slug: product.slug, categoryId: 1 } as any,
        (hasSizes ? { size: selectedSize, color: hasColors ? selectedColor : undefined } : undefined) as any,
        undefined,
        quantity
      );
      
      setAdded(true);
      toast.success('Added to cart!');
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      alert("Error adding to cart: " + err.message);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container-app py-3">
        <nav className="flex items-center gap-1 text-xs text-[#888]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#00AEEF] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#00AEEF] transition-colors">Products</Link>
          <ChevronRight size={12} />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-[#00AEEF] transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#111] font-medium truncate max-w-[140px]">{product.name}</span>
        </nav>
      </div>

      <div className="container-app pb-32 lg:pb-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">

          {/* ── Image Gallery ──────────────────────── */}
          <div className="mb-6 lg:mb-0">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f8f9fa]">
              <Image
                src={images[activeImageIndex]}
                alt={`${product.name} - Custom print by Hashtag Salem`}
                fill className="object-contain" priority unoptimized
                sizes="(max-width:1024px) 100vw, 50vw"
              />
              {product.bestseller && (
                <span className="absolute top-3 left-3 badge badge-magenta flex items-center gap-1">
                  <Zap size={10} /> Bestseller
                </span>
              )}
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all hover:scale-105"
              >
                <Heart size={20} className={isWishlisted ? 'fill-[#EC008C] text-[#EC008C]' : 'text-[#888]'} />
              </button>
            </div>
            {/* Thumbnails - more images would come from DB */}
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImageIndex(i)}
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0"
                  style={{ borderColor: i === activeImageIndex ? '#00AEEF' : 'transparent' }}>
                  <Image src={img} alt={`View ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ───────────────────────── */}
          <div className="space-y-5 relative z-40">
            <div>
              <Link href={`/products?category=${product.categorySlug}`}
                className="text-xs text-[#888] font-medium uppercase tracking-wide mb-1 hover:text-[#00AEEF] flex items-center gap-1">
                <ArrowLeft size={11} /> {product.category}
              </Link>
              <h1 className="text-2xl font-black text-[#111] leading-tight mt-1">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-[#e5e7eb]'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#444]">{product.rating}</span>
                <span className="text-xs text-[#888]">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#111]">{formatPrice(unitPrice)}</span>
              <span className="text-sm text-[#888]">onwards</span>
            </div>

            {/* Size Selector */}
            {hasSizes && (
              <div>
                <label className="block text-xs font-bold text-[#111] mb-2 uppercase tracking-wide">
                  Size {selectedSize && <span className="text-[#00AEEF] normal-case font-semibold">- {selectedSize}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button key={size} type="button" onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size); }}
                      className="min-w-[44px] h-[44px] px-3 rounded-xl border-2 text-sm font-bold transition-all"
                      style={{ touchAction: 'manipulation', borderColor: selectedSize === size ? '#00AEEF' : '#e5e7eb', background: selectedSize === size ? '#00AEEF' : 'white', color: selectedSize === size ? 'white' : '#444' }}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {hasColors && (
              <div>
                <label className="block text-xs font-bold text-[#111] mb-2 uppercase tracking-wide">
                  Colour {selectedColor && <span className="text-[#00AEEF] normal-case font-semibold">- {selectedColor}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedColor(color); }}
                      className="px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all min-h-[44px]"
                      style={{ touchAction: 'manipulation', borderColor: selectedColor === color ? '#00AEEF' : '#e5e7eb', background: selectedColor === color ? '#e0f7ff' : 'white', color: selectedColor === color ? '#00AEEF' : '#444' }}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-[#111] mb-2 uppercase tracking-wide">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="qty-stepper">
                  <button type="button" className="qty-btn" onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }} aria-label="Decrease" style={{ touchAction: 'manipulation' }}><Minus size={14} /></button>
                  <span className="qty-count">{quantity}</span>
                  <button type="button" className="qty-btn" onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); setQuantity(quantity + 1); }} aria-label="Increase" style={{ touchAction: 'manipulation' }}><Plus size={14} /></button>
                </div>
                <p className="text-sm text-[#888]">Total: <span className="font-black text-[#111]">{formatPrice(totalPrice)}</span></p>
              </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden lg:flex gap-3 pt-2">
              <button onClick={handleAddToCart} className="btn btn-primary px-6 w-fit font-bold shadow-md shadow-[#00AEEF]/20"
                style={{ background: added ? '#16a34a' : 'linear-gradient(135deg,#00AEEF,#0090c5)', color: 'white' }}>
                {added ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
              <Link href="/cart" className="btn btn-outline px-6 w-fit font-bold">View Cart</Link>
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['Same-day dispatch before 12 PM', 'Free delivery above ₹999', '100% quality guarantee'].map(info => (
                <span key={info} className="flex items-center gap-1 text-[10px] text-[#444] bg-[#f8f9fa] border border-[#e5e7eb] px-2.5 py-1 rounded-full">
                  <Info size={10} className="text-[#00AEEF]" />{info}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex gap-1 border-b border-[#e5e7eb] mb-5">
            {(['description','specs','reviews'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-all -mb-px"
                style={{ borderColor: activeTab === tab ? '#00AEEF' : 'transparent', color: activeTab === tab ? '#00AEEF' : '#888' }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <p className="text-[#444] text-sm leading-relaxed max-w-prose">{product.description}</p>
          )}
          {activeTab === 'specs' && (
            <div className="space-y-2 text-sm">
              {[
                ['Category', product.category],
                ['Print Method', 'DTF / Screen Print / Sublimation'],
                ['Delivery', '1–3 business days in Tamil Nadu'],
                ['Minimum Quantity', '1 piece (no minimum)'],
                ['Bulk Discount', 'Available for 10+ pieces'],
                ['File Format', 'JPG, PNG, PDF, AI, CDR accepted'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 py-2 border-b border-[#f0f0f0]">
                  <span className="text-[#888] font-medium w-36 flex-shrink-0">{k}</span>
                  <span className="text-[#111] font-semibold">{v}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-2xl">
                <div className="text-center">
                  <p className="text-4xl font-black text-[#111]">{product.rating}</p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-[#FFD700] text-[#FFD700]" />)}
                  </div>
                  <p className="text-xs text-[#888] mt-1">{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(s => (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-right text-[#888]">{s}</span>
                      <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFD700] rounded-full" style={{ width: s === 5 ? '70%' : s === 4 ? '20%' : s === 3 ? '7%' : '3%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#888]">Customer reviews are verified after purchase.</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-lg font-black text-[#111] mb-4">More in {product.category}</h2>
          <div className="product-grid">
            {ALL_PRODUCTS.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4).map(p => (
              <Link key={p.id} href={`/products/${p.slug}`} className="card overflow-hidden group">
                <div className="relative aspect-square bg-[#f8f9fa] overflow-hidden">
                  <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#111] line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-sm font-black text-[#111]">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed left-0 right-0 p-4 bg-white border-t border-[#e5e7eb]"
        style={{ zIndex: 9999, bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0 text-left">
            <p className="text-[10px] text-[#888]">Total</p>
            <p className="font-black text-[#111] text-lg leading-none">{formatPrice(totalPrice)}</p>
          </div>
          <button
            id="mobile-add-btn"
            onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(); }}
            className="btn px-5 w-max font-bold text-sm shadow-md shadow-[#00AEEF]/20"
            style={{
              pointerEvents: 'auto',
              touchAction: 'manipulation',
              background: added ? '#16a34a' : 'linear-gradient(135deg,#00AEEF,#0090c5)',
              color: 'white'
            }}>
            {added ? <><Check size={16} />Added!</> : <><ShoppingCart size={16} />Add to Cart</>}
          </button>
        </div>
      </div>
    </>
  );
}

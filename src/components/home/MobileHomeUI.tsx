'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Upload, ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  Star, Clock, BadgeCheck, Shirt, BookOpen, Coffee,
  ImageIcon, CreditCard, Package, Gift, Zap, ShoppingCart,
  Check, Plus, Phone, Tag, Heart, Search, Mic, MapPin, User, ChevronDown, Wallet, ShoppingBag, Bike, X
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ProductBottomSheet } from '@/components/ui/ProductBottomSheet';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';
import { motion, AnimatePresence } from 'framer-motion';

// ─── DEMO DATA (works without DB) ─────────────────────────────

const CATEGORY_GROUPS = [
  {
    title: 'Custom Apparel',
    items: [
      { id: 1, name: 'T-Shirts', slug: 'custom-tshirt-printing', bg: '#f8f9fa', image: '/uploads/products/tshirt.jpg' },
      { id: 2, name: 'Polo Shirts', slug: 'custom-tshirt-printing', bg: '#f8f9fa', image: '/uploads/products/Polo Neck Custom T-Shirt.png' },
      { id: 6, name: 'Stickers', slug: 'custom-sticker-printing', bg: '#f8f9fa', image: '/uploads/products/Custom Die-Cut Vinyl Stickers.png' },
      { id: 8, name: 'Custom Gifts', slug: 'custom-gifts-printing', bg: '#f8f9fa', image: '/uploads/products/Corporate Gifting Set.png' },
    ]
  },
  {
    title: 'Stationery & Office',
    items: [
      { id: 3, name: 'Notebooks', slug: 'custom-notebook-printing', bg: '#f8f9fa', image: '/uploads/products/A5 Spiral Custom Notebook.png' },
      { id: 4, name: 'Business Cards', slug: 'business-card-printing', bg: '#f8f9fa', image: '/uploads/products/Standard Business Cards (100 pcs).png' },
      { id: 9, name: 'Bulk Orders', slug: 'bulk-printing', bg: '#f8f9fa', image: '/uploads/products/Bulk T-Shirt Printing (50 pcs).png' },
      { id: 10, name: 'Canvas Prints', slug: 'photo-printing-online', bg: '#f8f9fa', image: '/uploads/products/Premium Canvas Photo Print.png' },
    ]
  },
  {
    title: 'Photo Products',
    items: [
      { id: 5, name: 'Photo Mugs', slug: 'custom-mug-printing', bg: '#f8f9fa', image: '/uploads/products/Custom Photo Magic Mug.png' },
      { id: 11, name: 'Canvas Prints', slug: 'photo-printing-online', bg: '#f8f9fa', image: '/uploads/products/Premium Canvas Photo Print.png' },
      { id: 12, name: 'Acrylic Prints', slug: 'photo-printing-online', bg: '#f8f9fa', image: '/uploads/products/Premium Acrylic Photo Print.png' },
      { id: 13, name: 'Photo Frames', slug: 'photo-printing-online', bg: '#f8f9fa', image: '/uploads/products/Custom Photo Magic Mug.png' },
    ]
  },
];

const CATEGORIES = [
  { id: 1, name: 'T-Shirts', slug: 'custom-tshirt-printing', icon: Shirt, color: '#fa028e', bg: '#ffe0f5', image: '/uploads/products/tshirt.jpg' },
  { id: 2, name: 'Notebooks', slug: 'custom-notebook-printing', icon: BookOpen, color: '#fcd502', bg: '#fffdf0', image: '/uploads/products/A5 Spiral Custom Notebook.png' },
  { id: 3, name: 'Photo Mugs', slug: 'custom-mug-printing', icon: Coffee, color: '#01a2fb', bg: '#e0f7ff', image: '/uploads/products/Custom Photo Magic Mug.png' },
  { id: 4, name: 'Canvas Prints', slug: 'photo-printing-online', icon: ImageIcon, color: '#7c3aed', bg: '#f5f3ff', image: '/uploads/products/Premium Canvas Photo Print.png' },
  { id: 5, name: 'Business Cards', slug: 'business-card-printing', icon: CreditCard, color: '#01a2fb', bg: '#f0fff4', image: '/uploads/products/Standard Business Cards (100 pcs).png' },
  { id: 6, name: 'Stickers', slug: 'custom-sticker-printing', icon: Tag, color: '#fa028e', bg: '#ffe0f5', image: '/uploads/products/Custom Die-Cut Vinyl Stickers.png' },
  { id: 7, name: 'Bulk Orders', slug: 'bulk-printing', icon: Package, color: '#0090c5', bg: '#e0f7ff', image: '/uploads/products/Bulk T-Shirt Printing (50 pcs).png' },
  { id: 8, name: 'Custom Gifts', slug: 'custom-gifts-printing', icon: Gift, color: '#d97706', bg: '#fffbeb', image: '/uploads/products/Corporate Gifting Set.png' },
];

import { ALL_PRODUCTS as PRODUCTS } from '@/lib/products';

import { useWishlistStore } from '@/store/wishlistStore';

// ─── Product Card (Blinkit style) ───────────────────────────────
function DemoProductCard({ product, priority = false, onSelectProduct, timer }: {
  product: typeof PRODUCTS[0];
  priority?: boolean;
  onSelectProduct?: (p: typeof PRODUCTS[0]) => void;
  timer?: React.ReactNode;
}) {
  const router         = useRouter();
  const toggleWishlist = useWishlistStore(s => s.toggleItem);
  const isWishlisted   = useWishlistStore(s => s.hasItem(product.id));
  const [isSmashing, setIsSmashing] = useState(false);

  // Clicking anywhere on the card → open sheet (if handler provided)
  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelectProduct) {
      e.preventDefault();
      onSelectProduct(product);
    }
    // else: let the <Link> navigate naturally
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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      router.push(`/products/${product.slug}`);
    }
  };

  const CardInner = (
    <>
      {/* Image area */}
      <div className="relative overflow-hidden bg-[#f4f6f8] aspect-square rounded-t-xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, 33vw"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
          unoptimized
        />
        {product.bestseller && (
          <span className="absolute top-2 left-2 bg-[#fa028e] text-white text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <Zap size={8} /> Best
          </span>
        )}
        {/* Sleek inline timer on image */}
        {timer && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm text-[#fa028e] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50 z-20 whitespace-nowrap">
            {timer}
          </div>
        )}
        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Wishlist"
        >
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
            <Heart size={13} className={isWishlisted ? 'fill-[#fa028e] text-[#fa028e]' : 'text-[#888]'} />
          </motion.div>
        </button>
      </div>

      {/* Text area */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <p className="text-[11px] text-[#888] font-bold uppercase tracking-wide mb-0.5 truncate">{product.category}</p>
        <h3 className="text-[14px] font-bold text-[#111] leading-snug line-clamp-2 flex-1 mb-1.5">{product.name}</h3>

        {/* Rating mini */}
        <div className="flex items-center gap-0.5 mb-2">
          <Star size={9} className="fill-[#FFB800] text-[#FFB800]" />
          <span className="text-[12px] font-bold text-[#444]">{product.rating}</span>
          <span className="text-[11px] text-[#888] ml-0.5">({product.reviews})</span>
        </div>

        {/* Price + Add button row */}
        <div className="flex items-center justify-between gap-1">
          <div>
            <span className="text-[15px] font-black text-[#111]">₹{product.price}</span>
            <p className="text-[11px] text-[#888] leading-none mt-0.5">onwards</p>
          </div>
          {/* Animated Add button */}
          <button
            onClick={handleQuickAdd}
            className="w-[34px] h-[34px] bg-white border border-[#01a2fb] rounded-full flex items-center justify-center text-[#01a2fb] hover:bg-[#01a2fb] hover:text-white active:scale-90 transition-all shadow-sm group/btn overflow-hidden relative"
            aria-label={`Add ${product.name}`}
          >
            {/* Tiny shine animation */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            <Plus size={18} strokeWidth={2.5} className="group-hover/btn:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </>
  );

  if (onSelectProduct) {
    return (
      <div
        onClick={handleCardClick}
        role="button"
        aria-label={product.name}
        className="card overflow-hidden flex flex-col group relative cursor-pointer rounded-xl bg-white"
      >
        {CardInner}
      </div>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={product.name}
      className="card overflow-hidden flex flex-col group relative rounded-xl bg-white"
    >
      {CardInner}
    </Link>
  );
}

// ─── Blinkit Style Hero ──────────────────────────────────────────
function BlinkitHero() {
  return (
    <div className="hidden md:flex flex-col gap-4">
      {/* Main Wide Banner */}
      <Link href="/products" className="relative w-full rounded-2xl overflow-hidden min-h-[220px] lg:min-h-[280px] group flex items-center"
        style={{ background: 'linear-gradient(135deg, #01a2fb, #0088d4)' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-90 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700">
           <Image src="/uploads/products/realistic_canvas.jpg" alt="Banner" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover object-center" unoptimized />
           <div className="absolute inset-0 bg-gradient-to-r from-[#01a2fb] to-transparent" />
        </div>
        <div className="relative z-10 p-8 lg:p-12 w-full lg:w-2/3">
          <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-3">
            Stock up on premium<br />custom prints
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-md">
            Get gallery-quality canvas, custom tees, and business essentials delivered fast.
          </p>
          <div className="inline-flex items-center px-5 py-2.5 bg-white text-[#0088d4] font-bold rounded-xl shadow-sm hover:scale-105 transition-transform">
            Shop Now
          </div>
        </div>
      </Link>

      {/* 3 Sub Banners */}
      <div className="grid grid-cols-3 gap-4">
        {/* Banner 1 */}
        <Link href="/products?category=custom-tshirt-printing" className="relative rounded-2xl overflow-hidden min-h-[160px] group"
          style={{ background: 'linear-gradient(135deg, #01a2fb, #006b99)' }}>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-80 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/tshirt.jpg" alt="T-Shirts" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover rounded-full mix-blend-luminosity" unoptimized />
          </div>
          <div className="relative z-10 p-5 w-3/4">
            <h3 className="text-xl font-black text-white mb-1 leading-tight">Custom<br />T-Shirts</h3>
            <p className="text-white/80 text-xs mb-3">Premium cotton polos & round necks</p>
            <div className="inline-flex px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg border border-white/30">
              Order Now
            </div>
          </div>
        </Link>

        {/* Banner 2 */}
        <Link href="/products?category=custom-gifts-printing" className="relative rounded-2xl overflow-hidden min-h-[160px] group"
          style={{ background: 'linear-gradient(135deg, #fcd502, #b29600)' }}>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-90 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/realistic_gifting.jpg" alt="Gifts" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover rounded-full mix-blend-luminosity" unoptimized />
          </div>
          <div className="relative z-10 p-5 w-3/4">
            <h3 className="text-xl font-black text-[#111] mb-1 leading-tight">Corporate<br />Gifting</h3>
            <p className="text-[#111]/80 text-xs mb-3">Notebooks, pens, and premium sets</p>
            <div className="inline-flex px-3 py-1.5 bg-[#111] text-white text-xs font-bold rounded-lg">
              Order Now
            </div>
          </div>
        </Link>

        {/* Banner 3 */}
        <Link href="/products?category=business-card-printing" className="relative rounded-2xl overflow-hidden min-h-[160px] group"
          style={{ background: 'linear-gradient(135deg, #fa028e, #99005a)' }}>
          <div className="absolute right-0 bottom-0 w-28 h-28 opacity-80 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/realistic_bizcards.jpg" alt="Cards" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover mix-blend-luminosity" unoptimized />
          </div>
          <div className="relative z-10 p-5 w-3/4">
            <h3 className="text-xl font-black text-white mb-1 leading-tight">Business<br />Cards</h3>
            <p className="text-white/80 text-xs mb-3">Thick 350 GSM premium matte</p>
            <div className="inline-flex px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-lg border border-white/30">
              Order Now
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── Value Props ───────────────────────────────────────────────
const VALUE_PROPS = [
  { icon: Clock, label: 'Same-day dispatch', sub: 'Order before 12 PM', color: '#01a2fb' },
  { icon: Star, label: 'Premium quality', sub: '5-star rated prints', color: '#fcd502' },
  { icon: BadgeCheck, label: 'Bulk discounts', sub: 'Up to 40% off', color: '#fa028e' },
  { icon: Phone, label: 'WhatsApp support', sub: 'Salem-based team', color: '#111111' },
];

// ─── FAQ ───────────────────────────────────────────────────────
const FAQS = [
  { q: 'How long does custom t-shirt printing take in Salem?', a: 'Hashtag offers same-day dispatch for orders placed before 12 PM in Salem. Delivery within Salem takes 1 business day, and pan-India delivery takes 2–3 business days.' },
  { q: 'What is the minimum order quantity?', a: 'No minimum order - we accept single-piece orders. Bulk orders of 10+ pieces qualify for discounts up to 40% off.' },
  { q: 'Can I upload my own design?', a: 'Yes. Upload your artwork in JPG, PNG, or PDF format. Add text, choose print placement, and preview before ordering.' },
  { q: 'Does Hashtag provide bulk corporate printing?', a: 'Yes. We specialise in branded polo t-shirts, notebooks, mugs, and event merchandise for companies, schools, and NGOs in Salem and across Tamil Nadu.' },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq-heading" aria-labelledby="faq-heading" className="py-4">
      <h2 className="text-xl font-black text-[#111] mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2" itemScope itemType="https://schema.org/FAQPage">
        {FAQS.map((faq, i) => (
          <div key={i} className="card overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left" aria-expanded={open === i}>
              <span className="font-semibold text-sm text-[#111] pr-4" itemProp="name">{faq.q}</span>
              <ChevronRight size={16} className="flex-shrink-0 text-[#888] transition-transform duration-200" style={{ transform: open === i ? 'rotate(90deg)' : 'rotate(0deg)' }} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-[#444] leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <span itemProp="text">{faq.a}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────────────
export function MobileHomeUI() {
  const bestsellers = PRODUCTS.filter(p => p.bestseller);
  const featured = PRODUCTS.filter(p => !p.bestseller);
  
  const [isChecking, setIsChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState(22 * 60 + 14); // 22 mins 14 secs
  
  // Bottom Sheet State
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  const router = useRouter();

  const handleSelectProduct = (product: typeof PRODUCTS[0]) => {
    setSelectedProduct(product);
    setIsBottomSheetOpen(true);
  };

  useEffect(() => {
    setIsChecking(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating Banner State
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isBannerHiddenByScroll, setIsBannerHiddenByScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsBannerHiddenByScroll(true);
      } else if (currentScrollY < lastScrollY) {
        setIsBannerHiddenByScroll(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!isBannerVisible) return;
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, [isBannerVisible]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isChecking) return null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': ['Organization', 'LocalBusiness'],
        name: 'Hashtag Custom Prints', url: 'https://hashtagprints.in',
        description: "Salem's leading custom printing service - t-shirts, notebooks, mugs, photo prints.",
        address: { '@type': 'PostalAddress', addressLocality: 'Salem', addressRegion: 'Tamil Nadu', postalCode: '636001', addressCountry: 'IN' },
        priceRange: '₹₹', openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
      }) }} />



      {/* SLEEK PREMIUM TOP SECTION */}
      <div className="bg-white px-4 pt-4 pb-8 rounded-b-[24px] relative overflow-hidden shadow-sm border-b border-gray-100">
        
        {/* Header Row - Logo & Tagline */}
        <div className="flex flex-col relative z-10 mb-5 mt-1 items-start">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex flex-row items-center gap-3">
              <div className="bg-white w-[58px] h-[58px] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center border-2 border-white overflow-hidden flex-shrink-0">
                <Image
                  src="/HP_Logo.png"
                  alt="Hashtag Custom Prints"
                  width={150}
                  height={48}
                  className="h-9 w-auto object-contain scale-[1.6] mt-0.5"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-[17px] leading-tight tracking-wide uppercase bg-gradient-to-r from-[#01a2fb] via-[#fa028e] to-[#fcd502] text-transparent bg-clip-text">
                  Your Ideas,
                </span>
                <span className="text-[#444] text-[12px] sm:text-[13px] font-bold tracking-widest flex items-center gap-1.5 uppercase mt-0.5">
                  Printed With Heart <Heart size={10} className="fill-[#fa028e] text-transparent" />
                </span>
              </div>
            </Link>
            
            <div className="flex items-center gap-2.5">
              <Link href="/cart" className="bg-gray-50 p-2.5 rounded-full border border-gray-200 relative shadow-sm touch-target hover:scale-105 transition-transform text-[#111]">
                 <Wallet size={20} />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#01a2fb] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-white whitespace-nowrap shadow-sm">₹0</div>
              </Link>
              <Link href="/profile" className="bg-gray-50 p-2.5 rounded-full border border-gray-200 shadow-sm touch-target hover:scale-105 transition-transform text-[#111]">
                 <User size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative z-10 mb-6">
          <div className="bg-gray-50 h-[52px] rounded-xl flex items-center px-4 border border-gray-200 shadow-sm">
            <Search size={22} className="text-[#888]" />
            <input 
              type="text" 
              placeholder="Search for t-shirts, mugs, gifts..."
              className="flex-1 bg-transparent border-none outline-none px-3 text-[#111] font-medium placeholder:text-[#888] placeholder:font-normal text-[17px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="w-[1px] h-6 bg-gray-200 mx-2" />
            <Mic size={22} className="text-[#888]" />
          </div>
        </form>

        {/* Quick Categories */}
        <div className="flex items-start justify-between relative z-10 px-2 sm:px-6">
           <Link href="/products" className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <ShoppingBag size={28} className="text-[#111]" />
              </div>
              <span className="text-[14px] font-bold text-[#111] border-b-[3px] border-[#111] pb-0.5">All</span>
           </Link>

           <Link href="/products?category=custom-gifts-printing" className="flex flex-col items-center gap-1.5 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fa028e] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white whitespace-nowrap z-10 shadow-sm uppercase tracking-wider">Hot</div>
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Zap size={28} className="text-[#fa028e] fill-[#fa028e]/20" />
              </div>
              <span className="text-[14px] font-bold text-[#fa028e]">Offers</span>
           </Link>

           <Link href="/products?category=custom-tshirt-printing" className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Shirt size={28} className="text-[#444]" />
              </div>
              <span className="text-[14px] font-semibold text-[#444]">T-Shirts</span>
           </Link>

           <Link href="/products?category=custom-gifts-printing" className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Gift size={28} className="text-[#444]" />
              </div>
              <span className="text-[14px] font-semibold text-[#444]">Gifts</span>
           </Link>
        </div>
      </div>

      {/* PREMIUM HIGHLIGHT GRID */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-gradient-to-br from-white via-[#f8f9fa] to-[#f0f4f8] rounded-[24px] border border-gray-200 p-4 shadow-sm overflow-hidden relative">
           
           <div className="text-center mb-5 relative z-10 mt-1 flex flex-col items-center">
             <div className="flex items-center justify-center gap-2 mb-1">
                <div className="h-[1px] w-8 bg-gray-300" />
                <span className="text-gray-500 text-[12px] tracking-[0.2em] uppercase font-bold">Featured</span>
                <div className="h-[1px] w-8 bg-gray-300" />
             </div>
             <h2 className="text-[24px] sm:text-[28px] font-black text-[#111] leading-none">
                Exclusive <span className="text-[#01a2fb]">Offers</span>
             </h2>
           </div>

           {/* 1 Tall + 4 Square Grid */}
           <div className="grid grid-cols-12 gap-3 relative z-10">
              
              {/* Tall Left Card */}
              <Link href="/products?category=custom-gifts-printing" className="col-span-5 bg-white rounded-[16px] p-3 flex flex-col relative overflow-hidden group shadow-sm border border-gray-100 min-h-[220px] sm:min-h-[260px]">
                <div className="relative z-10 mb-2">
                  <h3 className="text-[#111] font-black text-[18px] sm:text-[20px] leading-[1.05] mb-1.5">Festive<br/>Essentials</h3>
                  <span className="text-[#fa028e] text-[11px] font-bold bg-[#ffebf6] px-2 py-0.5 rounded text-center block w-max">Up to 40% OFF</span>
                </div>
                <div className="relative flex-1 w-full mt-2 overflow-hidden rounded-[8px]">
                  <Image src="/uploads/products/Corporate Gifting Set.png" alt="Gifts" fill priority sizes='(max-width: 768px) 100vw, 50vw' className="object-contain object-bottom group-hover:scale-105 transition-transform" />
                </div>
              </Link>

              {/* Right 2x2 Grid */}
              <div className="col-span-7 grid grid-cols-2 gap-3">
                {/* Card 1 */}
                <Link href="/products?category=custom-gifts-printing" className="bg-white rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-sm border border-gray-100 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#111] font-bold text-[13px] sm:text-[14px] leading-tight text-center relative z-10">Corporate<br/>Gifts</h3>
                  <div className="relative flex-1 w-full mt-1.5 overflow-hidden rounded-[8px]">
                    <Image src="/uploads/products/A5 Spiral Custom Notebook.png" alt="Notebooks" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-contain object-bottom group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
                
                {/* Card 2 */}
                <Link href="/products?category=custom-tshirt-printing" className="bg-white rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-sm border border-gray-100 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#111] font-bold text-[13px] sm:text-[14px] leading-tight text-center relative z-10">Custom<br/>Apparel</h3>
                  <div className="relative flex-1 w-full mt-1.5 overflow-hidden rounded-[8px]">
                    <Image src="/uploads/products/tshirt.jpg" alt="Apparel" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover object-bottom group-hover:scale-110 transition-transform" />
                  </div>
                </Link>

                {/* Card 3 */}
                <Link href="/products?category=photo-printing-online" className="bg-white rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-sm border border-gray-100 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#111] font-bold text-[13px] sm:text-[14px] leading-tight text-center relative z-10">Decor &<br/>Canvas</h3>
                  <div className="relative flex-1 w-full mt-1.5 overflow-hidden rounded-[8px]">
                    <Image src="/uploads/products/Premium Canvas Photo Print.png" alt="Canvas" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover object-bottom group-hover:scale-110 transition-transform" />
                  </div>
                </Link>

                {/* Card 4 */}
                <Link href="/products?category=custom-gifts-printing" className="bg-white rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-sm border border-gray-100 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#111] font-bold text-[13px] sm:text-[14px] leading-tight text-center relative z-10">Bulk<br/>Orders</h3>
                  <div className="relative flex-1 w-full mt-1.5 overflow-hidden rounded-[8px]">
                    <Image src="/uploads/products/Standard Business Cards (100 pcs).png" alt="Bulk" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-contain object-bottom group-hover:scale-110 transition-transform" />
                  </div>
                </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="container-app py-6 space-y-6 pb-4">
        {/* Festive Picks */}
        <section aria-labelledby="festive-heading" className="-mx-4 px-4 py-6 mb-6 relative overflow-hidden bg-white border-y border-gray-100">
          
          <div className="flex flex-col mb-4 relative z-10">
             <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-2">
                 <h2 id="festive-heading" className="text-[22px] sm:text-[26px] font-black text-[#111] tracking-tight">Trending Now</h2>
                 <div className="bg-gradient-to-r from-[#fa028e] to-[#ff477e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse shadow-sm">Hot</div>
               </div>
             </div>
             <p className="text-gray-500 text-sm mt-0.5">Most loved custom prints this week</p>
          </div>
          
          {/* Horizontal scroll like Blinkit */}
          <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x hide-scrollbar relative z-10">
            {bestsellers.map((p, i) => (
              <div key={p.id} className="relative w-[150px] sm:w-[170px] flex-shrink-0 snap-start bg-white rounded-[16px] border border-gray-200 shadow-sm p-1.5 pt-3 transition-transform hover:scale-105">
                 <DemoProductCard 
                   product={p} 
                   priority={i < 2} 
                   onSelectProduct={handleSelectProduct}
                   timer={<><Clock size={10} className="animate-pulse" /> {formatTime(timeLeft)}</>}
                 />
              </div>
            ))}
          </div>
        </section>
        
        {/* Explore Categories - Blinkit Grouped Style */}
        <div aria-label="Explore Categories" className="-mx-4 px-0">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.title} className="mb-1 bg-white px-4 pt-5 pb-6 border-b border-gray-100">
              <h2 className="text-[24px] font-black text-[#111] mb-4">{group.title}</h2>
              <div className="grid grid-cols-4 gap-x-3 gap-y-5">
                {group.items.map((cat) => {
                  const product = PRODUCTS.find(p => p.image === cat.image) || PRODUCTS[0];
                  return (
                    <button 
                      key={cat.id} 
                      onClick={(e) => { e.preventDefault(); handleSelectProduct(product); }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className="w-full aspect-square rounded-[14px] overflow-hidden relative transition-transform group-hover:scale-105 border border-gray-100"
                        style={{ backgroundColor: cat.bg || '#f8f9fa' }}
                      >
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          priority={true}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-[16px] sm:text-[18px] font-bold text-center leading-snug text-[#222] line-clamp-2">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
           <FAQSection />
        </div>

        {/* Features Banner */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {VALUE_PROPS.map((prop, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:-translate-y-2"
                  style={{ backgroundColor: `${prop.color}15`, color: prop.color }}
                >
                  <prop.icon size={24} />
                </div>
                <h3 className="font-bold text-[13px] sm:text-[15px] text-[#111] mb-1 leading-tight">{prop.label}</h3>
                <p className="text-[11px] sm:text-xs text-[#666] leading-tight">{prop.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Premium About blurb */}
        <section className="relative rounded-2xl overflow-hidden bg-[#f8f9fa] shadow-sm border border-gray-100">
          <div className="flex flex-col">
            <div className="relative w-full aspect-[4/3] min-h-[200px]">
              <Image src="/uploads/products/realistic_polo.jpg" alt="About Hashtag Custom Printing" fill sizes='(max-width: 768px) 100vw, 50vw' className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-transparent" />
            </div>
            <div className="w-full p-5 sm:p-8 relative z-10 -mt-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-4 bg-white shadow-sm border border-[#01a2fb]/10"
                style={{ color: '#01a2fb' }}>
                <Check size={12} /> Trusted by 500+ Businesses
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111] leading-tight mb-3">
                About Hashtag - Custom Printing in Salem
              </h2>
              <p className="text-[13px] sm:text-sm text-[#555] leading-relaxed mb-3">
                Hashtag is Salem&apos;s premier custom printing studio, offering premium personalized t-shirts, notebooks, mugs, photo prints, business cards, and stickers.
              </p>
              <p className="text-[13px] sm:text-sm text-[#555] leading-relaxed mb-5">
                We serve individuals, corporate teams, schools, and event organizers across Tamil Nadu. Same-day dispatch available in Salem.
              </p>
              <div className="flex flex-col gap-4">
                <Link href="/about" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#111] text-white text-[13px] font-bold rounded-xl shadow-sm hover:scale-105 transition-transform w-max">
                  Learn more
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-[#e5e7eb] border-2 border-[#f8f9fa] flex items-center justify-center text-[10px] text-[#888] font-bold">🙂</div>)}
                  </div>
                  <span className="text-[11px] font-semibold text-[#888]">10k+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Free Delivery Banner - Full Width */}
      {/* Floating Banner - Full Width */}
      {isBannerVisible && (
        <div className={`fixed bottom-[64px] lg:bottom-0 left-0 right-0 z-40 w-full pointer-events-none transition-transform duration-300 ${isBannerHiddenByScroll ? 'translate-y-[150px]' : 'translate-y-0'}`}>
           <div className="bg-white pointer-events-auto shadow-[0_-4px_16px_rgba(0,0,0,0.1)] border-t border-gray-200 p-2.5 px-4 flex items-center justify-between max-w-[600px] mx-auto">
              <div className="flex items-center gap-3">
                 <div className="text-[#0284c7]">
                   {bannerIndex === 0 ? <Bike size={32} strokeWidth={1.5} /> : <Tag size={32} strokeWidth={1.5} />}
                 </div>
                 <div className="min-w-[200px] transition-opacity duration-300">
                    <h4 className="text-[#0284c7] font-bold text-[16px] leading-tight">
                      {bannerIndex === 0 ? 'Get FREE delivery' : 'Extra 10% OFF'}
                    </h4>
                    <p className="text-[14px] font-medium text-gray-500 mt-0.5">
                      {bannerIndex === 0 ? 'on your order above ₹999' : 'on your first order using NEW10'} <ChevronRight size={12} className="inline opacity-60 -mt-0.5" />
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3 pr-1">
                 <button onClick={() => { setIsBannerVisible(false); window.dispatchEvent(new Event('bannerClosed')); }} className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 border border-gray-100 hover:bg-gray-100 transition-colors">
                   <X size={14} />
                 </button>
                 <div className="flex flex-col items-center gap-0.5 border-l border-gray-200 pl-3">
                   <span className="text-[12px] font-bold text-gray-500 leading-none">{bannerIndex + 1}/2</span>
                   <div className="flex gap-1 mt-0.5">
                     <div className={`w-1 h-1 rounded-full ${bannerIndex === 0 ? 'bg-[#111]' : 'bg-gray-300'}`} />
                     <div className={`w-1 h-1 rounded-full ${bannerIndex === 1 ? 'bg-[#111]' : 'bg-gray-300'}`} />
                   </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <FloatingCartButton />
      <ProductBottomSheet 
        product={selectedProduct} 
        isOpen={isBottomSheetOpen} 
        onClose={() => setIsBottomSheetOpen(false)} 
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsBottomSheetOpen(true);
        }}
      />
    </>
  );
}

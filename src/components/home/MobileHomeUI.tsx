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
import { OnboardingScreen } from '@/components/layout/OnboardingScreen';
import { ProductBottomSheet } from '@/components/ui/ProductBottomSheet';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';

// ─── DEMO DATA (works without DB) ─────────────────────────────

const CATEGORY_GROUPS = [
  {
    title: 'Custom Apparel',
    items: [
      { id: 1, name: 'T-Shirts', slug: 'custom-tshirt-printing', bg: '#e8f5fb', image: '/uploads/products/tshirt.jpg' },
      { id: 2, name: 'Polo Shirts', slug: 'custom-tshirt-printing', bg: '#fdf0fb', image: '/uploads/products/Polo Neck Custom T-Shirt.png' },
      { id: 6, name: 'Stickers', slug: 'custom-sticker-printing', bg: '#fff4e5', image: '/uploads/products/Custom Die-Cut Vinyl Stickers.png' },
      { id: 8, name: 'Custom Gifts', slug: 'custom-gifts-printing', bg: '#f0fff4', image: '/uploads/products/Corporate Gifting Set.png' },
    ]
  },
  {
    title: 'Stationery & Office',
    items: [
      { id: 3, name: 'Notebooks', slug: 'custom-notebook-printing', bg: '#fffff0', image: '/uploads/products/A5 Spiral Custom Notebook.png' },
      { id: 4, name: 'Business Cards', slug: 'business-card-printing', bg: '#f0fff4', image: '/uploads/products/Standard Business Cards (100 pcs).png' },
      { id: 9, name: 'Bulk Orders', slug: 'bulk-printing', bg: '#e0f7ff', image: '/uploads/products/Bulk T-Shirt Printing (50 pcs).png' },
      { id: 10, name: 'Canvas Prints', slug: 'photo-printing-online', bg: '#f5f3ff', image: '/uploads/products/Premium Canvas Photo Print.png' },
    ]
  },
  {
    title: 'Photo Products',
    items: [
      { id: 5, name: 'Photo Mugs', slug: 'custom-mug-printing', bg: '#e0f7ff', image: '/uploads/products/Custom Photo Magic Mug.png' },
      { id: 11, name: 'Canvas Prints', slug: 'photo-printing-online', bg: '#f5f3ff', image: '/uploads/products/Premium Canvas Photo Print.png' },
      { id: 12, name: 'Acrylic Prints', slug: 'photo-printing-online', bg: '#fff0f5', image: '/uploads/products/Premium Acrylic Photo Print.png' },
      { id: 13, name: 'Photo Frames', slug: 'photo-printing-online', bg: '#fffbeb', image: '/uploads/products/Custom Photo Magic Mug.png' },
    ]
  },
];

const CATEGORIES = [
  { id: 1, name: 'T-Shirts', slug: 'custom-tshirt-printing', icon: Shirt, color: '#EC008C', bg: '#ffe0f5', image: '/uploads/products/tshirt.jpg' },
  { id: 2, name: 'Notebooks', slug: 'custom-notebook-printing', icon: BookOpen, color: '#FFD700', bg: '#fffdf0', image: '/uploads/products/A5 Spiral Custom Notebook.png' },
  { id: 3, name: 'Photo Mugs', slug: 'custom-mug-printing', icon: Coffee, color: '#00AEEF', bg: '#e0f7ff', image: '/uploads/products/Custom Photo Magic Mug.png' },
  { id: 4, name: 'Canvas Prints', slug: 'photo-printing-online', icon: ImageIcon, color: '#7c3aed', bg: '#f5f3ff', image: '/uploads/products/Premium Canvas Photo Print.png' },
  { id: 5, name: 'Business Cards', slug: 'business-card-printing', icon: CreditCard, color: '#16a34a', bg: '#f0fff4', image: '/uploads/products/Standard Business Cards (100 pcs).png' },
  { id: 6, name: 'Stickers', slug: 'custom-sticker-printing', icon: Tag, color: '#EC008C', bg: '#ffe0f5', image: '/uploads/products/Custom Die-Cut Vinyl Stickers.png' },
  { id: 7, name: 'Bulk Orders', slug: 'bulk-printing', icon: Package, color: '#0090c5', bg: '#e0f7ff', image: '/uploads/products/Bulk T-Shirt Printing (50 pcs).png' },
  { id: 8, name: 'Custom Gifts', slug: 'custom-gifts-printing', icon: Gift, color: '#d97706', bg: '#fffbeb', image: '/uploads/products/Corporate Gifting Set.png' },
];

const PRODUCTS = [
  { id:1, name:'Classic Round Neck Custom T-Shirt', slug:'classic-round-neck-custom-tshirt', price:299, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/tshirt.jpg', rating:4.8, reviews:124, bestseller:true, description:'180 GSM combed cotton. Custom front/back print. Sizes XS–3XL.' },
  { id:2, name:'Polo Neck Custom T-Shirt', slug:'polo-neck-custom-tshirt', price:499, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Polo Neck Custom T-Shirt.png', rating:4.6, reviews:45, bestseller:false, description:'220 GSM pique cotton polo. Embroidered or printed logo. Perfect for corporate teams.' },
  { id:3, name:'A5 Spiral Custom Notebook', slug:'a5-spiral-custom-notebook', price:199, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/A5 Spiral Custom Notebook.png', rating:4.7, reviews:89, bestseller:false, description:'200 pages, ruled. Custom cover print. Durable spiral binding.' },
  { id:4, name:'Custom Hardcover Notebook', slug:'custom-hardcover-notebook', price:349, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/Custom Hardcover Notebook.png', rating:4.5, reviews:33, bestseller:false, description:'A5 hardcover with 150 ruled pages. Custom logo on cover.' },
  { id:5, name:'Custom Photo Magic Mug', slug:'custom-photo-magic-mug', price:349, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Custom Photo Magic Mug.png', rating:4.9, reviews:201, bestseller:true, description:'325ml ceramic mug. Heat-sensitive color change. Dishwasher safe.' },
  { id:6, name:'Premium Canvas Photo Print', slug:'premium-canvas-photo-print', price:699, category:'Canvas Prints', categorySlug:'photo-printing-online', image:'/uploads/products/Premium Canvas Photo Print.png', rating:4.8, reviews:67, bestseller:false, description:'Gallery-quality canvas. UV-resistant inks. Ready to hang.' },
  { id:7, name:'Standard Business Cards (100 pcs)', slug:'standard-business-cards', price:299, category:'Business Cards', categorySlug:'business-card-printing', image:'/uploads/products/Standard Business Cards (100 pcs).png', rating:4.7, reviews:156, bestseller:true, description:'350 GSM matt/gloss laminate. Double-sided full colour print.' },
  { id:8, name:'Corporate Gifting Set', slug:'corporate-gifting-set', price:1499, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Corporate Gifting Set.png', rating:4.9, reviews:88, bestseller:true, description:'Premium gift box containing custom printed notebook, pen, and coffee mug.' },
  { id:9, name:'Custom Printed Hoodie', slug:'custom-printed-hoodie', price:899, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Custom Printed Hoodie.png', rating:4.7, reviews:56, bestseller:false, description:'Premium 320 GSM cotton fleece hoodie with kangaroo pockets. Stay warm and stylish with custom prints.' },
  { id:10, name:'Oversized Drop Shoulder T-Shirt', slug:'oversized-drop-shoulder-tshirt', price:499, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Oversized Drop Shoulder T-Shirt.png', rating:4.8, reviews:89, bestseller:true, description:'Trendy oversized t-shirt in 220 GSM heavyweight cotton. Perfect for streetwear and casual custom designs.' },
  { id:11, name:'Custom Pocket Notebook A6', slug:'custom-pocket-notebook-a6', price:99, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/Custom Pocket Notebook A6.png', rating:4.6, reviews:34, bestseller:false, description:'Handy A6 pocket notebook with custom soft cover. 120 pages of 70 GSM paper. Easy to carry everywhere.' },
  { id:12, name:'Enamel Campfire Mug', slug:'enamel-campfire-mug', price:299, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Enamel Campfire Mug.png', rating:4.9, reviews:112, bestseller:false, description:'Durable enamel mug for outdoors. Custom printing that won\'t fade. Lightweight and shatterproof.' },
  { id:13, name:'Frosted Glass Beer Stein', slug:'frosted-glass-beer-stein', price:499, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Frosted Glass Stein.png', rating:4.8, reviews:76, bestseller:true, description:'Heavy frosted glass beer mug (16oz) with full-color custom print. Perfect for parties and gifts.' },
  { id:14, name:'Premium Acrylic Photo Print', slug:'premium-acrylic-photo-print', price:899, category:'Canvas Prints', categorySlug:'photo-printing-online', image:'/uploads/products/Premium Acrylic Photo Print.png', rating:5.0, reviews:45, bestseller:true, description:'Stunning HD print mounted on 5mm thick crystal clear acrylic. Modern and sleek frameless look.' },
  { id:15, name:'Transparent Business Cards (100 pcs)', slug:'transparent-business-cards-100', price:799, category:'Business Cards', categorySlug:'business-card-printing', image:'/uploads/products/Transparent Business Cards (100 pcs).png', rating:4.7, reviews:67, bestseller:false, description:'Stand out with clear, waterproof PVC business cards. Custom printed with high durability.' },
  { id:16, name:'Custom Die-Cut Vinyl Stickers', slug:'custom-die-cut-vinyl-stickers', price:99, category:'Stickers', categorySlug:'custom-sticker-printing', image:'/uploads/products/Custom Die-Cut Vinyl Stickers.png', rating:4.9, reviews:230, bestseller:true, description:'Durable, waterproof, and weatherproof die-cut stickers. Cut to the exact shape of your design.' },
  { id:17, name:'Personalized Mouse Pad', slug:'personalized-mouse-pad', price:199, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Personalized Mouse Pad.png', rating:4.8, reviews:154, bestseller:false, description:'Custom printed mouse pad with anti-slip rubber base and smooth fabric surface.' },
  { id:18, name:'Custom Printed Keychain', slug:'custom-printed-keychain', price:149, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Custom Printed Keychain.png', rating:4.6, reviews:88, bestseller:false, description:'High-quality MDF wood or acrylic keychains printed with your photos, logos, or text.' },
];

import { useWishlistStore } from '@/store/wishlistStore';

// ─── Product Card (Blinkit style) ───────────────────────────────
function DemoProductCard({ product, priority = false, onSelectProduct }: {
  product: typeof PRODUCTS[0];
  priority?: boolean;
  onSelectProduct?: (p: typeof PRODUCTS[0]) => void;
}) {
  const router         = useRouter();
  const toggleWishlist = useWishlistStore(s => s.toggleItem);
  const isWishlisted   = useWishlistStore(s => s.hasItem(product.id));

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
          <span className="absolute top-2 left-2 bg-[#EC008C] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <Zap size={8} /> Best
          </span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Wishlist"
        >
          <Heart size={13} className={isWishlisted ? 'fill-[#EC008C] text-[#EC008C]' : 'text-[#888]'} />
        </button>
      </div>

      {/* Text area */}
      <div className="px-2.5 pt-2 pb-2.5 flex flex-col flex-1">
        <p className="text-[9px] text-[#888] font-bold uppercase tracking-wide mb-0.5 truncate">{product.category}</p>
        <h3 className="text-[12px] font-bold text-[#111] leading-snug line-clamp-2 flex-1 mb-1.5">{product.name}</h3>

        {/* Rating mini */}
        <div className="flex items-center gap-0.5 mb-2">
          <Star size={9} className="fill-[#FFB800] text-[#FFB800]" />
          <span className="text-[10px] font-bold text-[#444]">{product.rating}</span>
          <span className="text-[9px] text-[#888] ml-0.5">({product.reviews})</span>
        </div>

        {/* Price + Add button row */}
        <div className="flex items-center justify-between gap-1">
          <div>
            <span className="text-[13px] font-black text-[#111]">₹{product.price}</span>
            <p className="text-[9px] text-[#888] leading-none mt-0.5">onwards</p>
          </div>
          {/* Green + button exactly like Blinkit */}
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 bg-white border-2 border-[#0f8a3c] rounded-lg flex items-center justify-center text-[#0f8a3c] hover:bg-[#eafbf0] active:scale-90 transition-all shadow-sm"
            aria-label={`Add ${product.name}`}
          >
            <Plus size={16} strokeWidth={3} />
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
        style={{ background: 'linear-gradient(135deg, #16a34a, #14532d)' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-90 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700">
           <Image src="/uploads/products/realistic_canvas.jpg" alt="Banner" fill className="object-cover object-center" unoptimized />
           <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a] to-transparent" />
        </div>
        <div className="relative z-10 p-8 lg:p-12 w-full lg:w-2/3">
          <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight mb-3">
            Stock up on premium<br />custom prints
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-md">
            Get gallery-quality canvas, custom tees, and business essentials delivered fast.
          </p>
          <div className="inline-flex items-center px-5 py-2.5 bg-white text-[#14532d] font-bold rounded-xl shadow-sm hover:scale-105 transition-transform">
            Shop Now
          </div>
        </div>
      </Link>

      {/* 3 Sub Banners */}
      <div className="grid grid-cols-3 gap-4">
        {/* Banner 1 */}
        <Link href="/products?category=custom-tshirt-printing" className="relative rounded-2xl overflow-hidden min-h-[160px] group"
          style={{ background: 'linear-gradient(135deg, #00AEEF, #006b99)' }}>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-80 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/tshirt.jpg" alt="T-Shirts" fill className="object-cover rounded-full mix-blend-luminosity" unoptimized />
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
          style={{ background: 'linear-gradient(135deg, #FFD700, #b29600)' }}>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-90 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/realistic_gifting.jpg" alt="Gifts" fill className="object-cover rounded-full mix-blend-luminosity" unoptimized />
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
          style={{ background: 'linear-gradient(135deg, #EC008C, #99005a)' }}>
          <div className="absolute right-0 bottom-0 w-28 h-28 opacity-80 group-hover:scale-110 transition-transform">
            <Image src="/uploads/products/realistic_bizcards.jpg" alt="Cards" fill className="object-cover mix-blend-luminosity" unoptimized />
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
  { icon: Clock, label: 'Same-day dispatch', sub: 'Order before 12 PM', color: '#00AEEF' },
  { icon: Star, label: 'Premium quality', sub: '5-star rated prints', color: '#FFD700' },
  { icon: BadgeCheck, label: 'Bulk discounts', sub: 'Up to 40% off', color: '#EC008C' },
  { icon: Phone, label: 'WhatsApp support', sub: 'Salem-based team', color: '#16a34a' },
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
  
  const [showOnboarding, setShowOnboarding] = useState(false);
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
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
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

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
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

      <style dangerouslySetInnerHTML={{ __html: `
        header.sticky-header { display: none !important; }
        main#main-content { padding-top: 0 !important; }
        body { background-color: #f4f6f9; }
      `}} />

      {showOnboarding && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      {/* BLINKIT STYLE TOP SECTION (Diwali Theme) */}
      <div className="bg-gradient-to-b from-[#91250b] to-[#7a1b06] px-4 pt-4 pb-8 rounded-b-[32px] relative overflow-hidden text-white shadow-md">
        {/* Authentic Indian Mandala/Rangoli Pattern */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C30 16.568 16.568 30 0 30C16.568 30 30 43.432 30 60C30 43.432 43.432 30 60 30C43.432 30 30 16.568 30 0Z' fill='%23FFD700' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
        
        {/* Header Row - Aligned EXACTLY like Blinkit */}
        <div className="flex flex-col relative z-10 mb-4">
          <span className="text-[12px] font-extrabold opacity-90 tracking-wide mb-1">Hashtag in</span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              <h1 className="text-[clamp(24px,6.5vw,36px)] font-black leading-none drop-shadow-md whitespace-nowrap">24 hours</h1>
              <div className="bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold flex items-center gap-1 border border-white/20 shadow-sm mt-1 whitespace-nowrap">
                <MapPin size={11} /> 1.7 km away
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/cart" className="bg-black/40 p-2.5 rounded-full border border-white/10 relative shadow-inner touch-target hover:scale-105 transition-transform">
                 <Wallet size={22} className="text-[#FFD700]" />
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#333] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#555] whitespace-nowrap">₹0</div>
              </Link>
              <Link href="/profile" className="bg-[#591410] p-2.5 rounded-full border border-white/10 shadow-inner touch-target hover:scale-105 transition-transform">
                 <User size={22} />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[13px] font-bold opacity-90">
            HOME - Salem, TN <ChevronDown size={14} className="opacity-80" />
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative z-10 mb-6">
          <div className="bg-white h-[52px] rounded-xl flex items-center px-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <Search size={22} className="text-[#888]" />
            <input 
              type="text" 
              placeholder="Search for t-shirts, mugs, gifts..."
              className="flex-1 bg-transparent border-none outline-none px-3 text-[#111] font-medium placeholder:text-[#888] placeholder:font-normal text-[15px]"
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
                <ShoppingBag size={28} className="text-white drop-shadow-md" />
              </div>
              <span className="text-[12px] font-bold border-b-[3px] border-white pb-0.5">All</span>
           </Link>

           <Link href="/products?category=custom-gifts-printing" className="flex flex-col items-center gap-1.5 relative group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#EC008C] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white whitespace-nowrap z-10 shadow-sm animate-pulse">New</div>
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform text-[26px]">
                🪔
              </div>
              <span className="text-[12px] font-bold text-[#FFD700]">Diwali Offers</span>
           </Link>

           <Link href="/products?category=custom-tshirt-printing" className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Shirt size={28} className="text-white opacity-90 drop-shadow-md" />
              </div>
              <span className="text-[12px] font-semibold opacity-90">T-Shirts</span>
           </Link>

           <Link href="/products?category=custom-gifts-printing" className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Gift size={28} className="text-white opacity-90 drop-shadow-md" />
              </div>
              <span className="text-[12px] font-semibold opacity-90">Gifts</span>
           </Link>
        </div>
      </div>

      {/* DIWALI HERO GRID */}
      <div className="px-4 -mt-4 relative z-10">
        {/* Jharokha (Archway) Style Container */}
        <div className="bg-gradient-to-b from-[#631505] to-[#3d0901] rounded-b-[24px] rounded-t-[50px] sm:rounded-t-[70px] border-t-[6px] border-x-[3px] border-b border-[#FFD700]/90 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] overflow-hidden relative">
           
           {/* Decorative Marigold Garlands (CSS Shapes) */}
           <div className="absolute top-0 left-4 w-8 flex flex-col items-center gap-[3px] opacity-90 pointer-events-none">
              <div className="w-[1.5px] h-3 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF6B00] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FF8C00] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FFD700]/60 scale-110 rotate-12" />
              </div>
              <div className="w-[1.5px] h-1.5 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FFB300] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FF8C00]/60 scale-110 -rotate-12" />
              </div>
              <div className="w-[1.5px] h-1.5 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF6B00] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FF8C00] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FFD700]/60 scale-110 rotate-45" />
              </div>
              {/* Mango Leaf */}
              <div className="w-3 h-5 bg-gradient-to-b from-green-600 to-green-800 rounded-t-full rounded-br-full -rotate-12 mt-1 shadow-sm border border-green-900/50" />
           </div>

           <div className="absolute top-0 right-4 w-8 flex flex-col items-center gap-[3px] opacity-90 pointer-events-none">
              <div className="w-[1.5px] h-3 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF6B00] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FF8C00] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FFD700]/60 scale-110 rotate-45" />
              </div>
              <div className="w-[1.5px] h-1.5 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FFB300] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FF8C00]/60 scale-110 -rotate-12" />
              </div>
              <div className="w-[1.5px] h-1.5 bg-green-800/80" />
              <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF6B00] shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-[#FF8C00] flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full rounded-full border-[3px] border-dashed border-[#FFD700]/60 scale-110 rotate-12" />
              </div>
              {/* Mango Leaf */}
              <div className="w-3 h-5 bg-gradient-to-b from-green-600 to-green-800 rounded-t-full rounded-bl-full rotate-12 mt-1 shadow-sm border border-green-900/50" />
           </div>

           <div className="text-center mb-6 relative z-10 mt-3 flex flex-col items-center">
             <div className="flex items-center justify-center gap-3 mb-1">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#FFD700] to-[#FFD700]" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFB300] text-[10px] tracking-[0.3em] uppercase font-bold drop-shadow-sm">Celebrate</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#FFD700] to-[#FFD700]" />
             </div>
             <h2 className="text-[34px] sm:text-[38px] font-serif font-black leading-none relative inline-block">
                {/* Subtle glow behind */}
                <span className="absolute inset-0 blur-lg bg-gradient-to-r from-[#FFD700]/20 to-[#FF8C00]/20 z-0 rounded-full scale-150" />
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-[#FFF3B0] via-[#FFE5B4] to-[#FFB300] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Diwali Offers
                </span>
             </h2>
           </div>

           {/* 1 Tall + 4 Square Grid */}
           <div className="grid grid-cols-12 gap-3 relative z-10 pb-2">
              
              {/* Tall Left Card */}
              <Link href="/products?category=custom-gifts-printing" className="col-span-5 bg-[#FFE1A8] rounded-[16px] p-3 flex flex-col relative overflow-hidden group shadow-md border border-[#FFD700]/40 min-h-[220px] sm:min-h-[260px]">
                <div className="relative z-10 mb-2">
                  <h3 className="text-[#8B1C10] font-black text-[20px] sm:text-[24px] leading-[1.05] mb-1.5">Festive<br/>Essentials</h3>
                  <span className="text-[#8B1C10] text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded text-center block w-max border border-[#8B1C10]/20">Up to 40% OFF</span>
                </div>
                <div className="relative flex-1 w-full mt-2">
                  <Image src="/uploads/products/Corporate Gifting Set.png" alt="Gifts" fill className="object-contain object-bottom group-hover:scale-105 transition-transform drop-shadow-xl" />
                </div>
              </Link>

              {/* Right 2x2 Grid */}
              <div className="col-span-7 grid grid-cols-2 gap-3">
                {/* Card 1 */}
                <Link href="/products?category=custom-gifts-printing" className="bg-[#FFE1A8] rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-md border border-[#FFD700]/40 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#8B1C10] font-black text-[12px] sm:text-[14px] leading-tight text-center relative z-10">Corporate<br/>Gifts</h3>
                  <div className="relative flex-1 w-full mt-1.5">
                    <Image src="/uploads/products/A5 Spiral Custom Notebook.png" alt="Notebooks" fill className="object-contain object-bottom group-hover:scale-110 transition-transform drop-shadow-md" />
                  </div>
                </Link>
                
                {/* Card 2 */}
                <Link href="/products?category=custom-tshirt-printing" className="bg-[#FFE1A8] rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-md border border-[#FFD700]/40 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#8B1C10] font-black text-[12px] sm:text-[14px] leading-tight text-center relative z-10">Custom<br/>Apparel</h3>
                  <div className="relative flex-1 w-full mt-1.5">
                    <Image src="/uploads/products/tshirt.jpg" alt="Apparel" fill className="object-cover object-bottom group-hover:scale-110 transition-transform mix-blend-multiply opacity-90 rounded-md" />
                  </div>
                </Link>

                {/* Card 3 */}
                <Link href="/products?category=photo-printing-online" className="bg-[#FFE1A8] rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-md border border-[#FFD700]/40 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#8B1C10] font-black text-[12px] sm:text-[14px] leading-tight text-center relative z-10">Decor &<br/>Canvas</h3>
                  <div className="relative flex-1 w-full mt-1.5">
                    <Image src="/uploads/products/Premium Canvas Photo Print.png" alt="Canvas" fill className="object-cover object-bottom group-hover:scale-110 transition-transform mix-blend-multiply opacity-90 rounded-md" />
                  </div>
                </Link>

                {/* Card 4 */}
                <Link href="/products?category=bulk-printing" className="bg-[#FFE1A8] rounded-[12px] p-2 flex flex-col relative overflow-hidden group shadow-md border border-[#FFD700]/40 min-h-[105px] sm:min-h-[125px]">
                  <h3 className="text-[#8B1C10] font-black text-[12px] sm:text-[14px] leading-tight text-center relative z-10">Bulk<br/>Orders</h3>
                  <div className="relative flex-1 w-full mt-1.5">
                    <Image src="/uploads/products/Standard Business Cards (100 pcs).png" alt="Bulk" fill className="object-contain object-bottom group-hover:scale-110 transition-transform mix-blend-multiply drop-shadow-md rounded-md" />
                  </div>
                </Link>
              </div>
           </div>

           {/* Scalloped edge decorative */}
           <div className="absolute bottom-0 left-0 right-0 h-4 w-full z-20"
                style={{
                  backgroundSize: '24px 24px',
                  backgroundImage: 'radial-gradient(circle at 12px 0, transparent 12px, #f4f6f9 13px)',
                  backgroundRepeat: 'repeat-x'
                }}
           />
        </div>
      </div>

      <div className="container-app py-8 space-y-8 pb-32">
        {/* Festive Picks - Diwali Themed Section */}
        <section aria-labelledby="festive-heading" className="-mx-4 px-4 py-8 mb-8 relative overflow-hidden bg-gradient-to-b from-[#FFF5E1] to-[#FFE8B5]/40 border-y-2 border-[#FFD700]/50 shadow-inner">
          {/* Rangoli decorative pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16L20 0Z' fill='%238B1C10' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '32px 32px' }} />
          
          <div className="flex flex-col items-center justify-center mb-6 relative z-10">
             <div className="flex items-center gap-3">
               <span className="text-[22px] animate-pulse">🪔</span>
               <h2 id="festive-heading" className="text-[26px] sm:text-[30px] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8B1C10] to-[#b32415] tracking-wide drop-shadow-sm">Festive Picks</h2>
               <span className="text-[22px] animate-pulse">🪔</span>
             </div>
             <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#FF8C00]/50 to-transparent mt-2" />
          </div>
          
          {/* Horizontal scroll like Blinkit */}
          <div className="flex overflow-x-auto gap-4 pb-4 pt-4 snap-x hide-scrollbar relative z-10">
            {bestsellers.map((p, i) => (
              <div key={p.id} className="relative w-[150px] sm:w-[170px] flex-shrink-0 snap-start bg-white rounded-[16px] shadow-[0_4px_12px_rgba(139,28,16,0.08)] border border-[#FFD700]/40 p-1.5 pt-4 transition-transform hover:scale-105">
                 {/* Live Timer Badge */}
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B1C10] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-full flex items-center justify-center gap-1 w-max border border-[#FFD700] shadow-sm z-20 whitespace-nowrap">
                   <Clock size={12} className="text-[#FFD700] animate-pulse" /> Offer ends in {formatTime(timeLeft)}
                 </div>
                 <DemoProductCard product={p} priority={i < 2} onSelectProduct={handleSelectProduct} />
              </div>
            ))}
          </div>
        </section>
        
        {/* Explore Categories - Blinkit Grouped Style */}
        <div aria-label="Explore Categories" className="-mx-4 px-0">
          {CATEGORY_GROUPS.map((group) => (
            <div key={group.title} className="mb-1 bg-white px-4 pt-5 pb-6 border-b border-gray-100">
              <h2 className="text-[19px] font-black text-[#111] mb-4">{group.title}</h2>
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
                        className="w-full aspect-square rounded-[14px] overflow-hidden relative transition-transform group-hover:scale-105"
                        style={{ backgroundColor: cat.bg || '#f3f9fb' }}
                      >
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover mix-blend-multiply"
                          unoptimized
                        />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-bold text-center leading-snug text-[#222] line-clamp-2">{cat.name}</span>
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
                    <h4 className="text-[#0284c7] font-bold text-[14px] leading-tight">
                      {bannerIndex === 0 ? 'Get FREE delivery' : 'Extra 10% OFF'}
                    </h4>
                    <p className="text-[12px] font-medium text-gray-500 mt-0.5">
                      {bannerIndex === 0 ? 'on your order above ₹999' : 'on your first order using NEW10'} <ChevronRight size={12} className="inline opacity-60 -mt-0.5" />
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-3 pr-1">
                 <button onClick={() => { setIsBannerVisible(false); window.dispatchEvent(new Event('bannerClosed')); }} className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 border border-gray-100 hover:bg-gray-100 transition-colors">
                   <X size={14} />
                 </button>
                 <div className="flex flex-col items-center gap-0.5 border-l border-gray-200 pl-3">
                   <span className="text-[10px] font-bold text-gray-500 leading-none">{bannerIndex + 1}/2</span>
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

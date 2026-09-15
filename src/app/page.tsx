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
  Check, Plus, Phone, Tag, Heart
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { OnboardingScreen } from '@/components/layout/OnboardingScreen';

function MobileSplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Hard fallback: 15s max waiting time
    const fallback = setTimeout(onComplete, 15000);

    const handleEnded = () => {
      clearTimeout(fallback);
      onComplete();
    };

    video.addEventListener('ended', handleEnded);

    // Some mobile browsers need a gentle push
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => console.error("Autoplay prevented:", e));
    }

    return () => {
      clearTimeout(fallback);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#efefef] lg:hidden">
      <video
        ref={videoRef}
        src="/logoanimation.mp4"
        poster="/HP_Logo.png"
        className="w-full h-full object-contain"
        playsInline
        autoPlay
        muted
        preload="auto"
      />
    </div>
  );
}

// ─── DEMO DATA (works without DB) ─────────────────────────────

const CATEGORIES = [
  { id: 1, name: 'T-Shirts', slug: 'custom-tshirt-printing', icon: Shirt, color: '#EC008C', bg: '#ffe0f5', image: '/uploads/categories/cat_tshirts.jpg' },
  { id: 2, name: 'Notebooks', slug: 'custom-notebook-printing', icon: BookOpen, color: '#FFD700', bg: '#fffdf0', image: '/uploads/categories/cat_notebooks.jpg' },
  { id: 3, name: 'Photo Mugs', slug: 'custom-mug-printing', icon: Coffee, color: '#00AEEF', bg: '#e0f7ff', image: '/uploads/categories/cat_mugs.jpg' },
  { id: 4, name: 'Canvas Prints', slug: 'photo-printing-online', icon: ImageIcon, color: '#7c3aed', bg: '#f5f3ff', image: '/uploads/categories/cat_canvas.jpg' },
  { id: 5, name: 'Business Cards', slug: 'business-card-printing', icon: CreditCard, color: '#16a34a', bg: '#f0fff4', image: '/uploads/categories/cat_bizcards.jpg' },
  { id: 6, name: 'Stickers', slug: 'custom-sticker-printing', icon: Tag, color: '#EC008C', bg: '#ffe0f5', image: '/uploads/categories/cat_stickers.jpg' },
  { id: 7, name: 'Bulk Orders', slug: 'bulk-printing', icon: Package, color: '#0090c5', bg: '#e0f7ff', image: '/uploads/categories/cat_bulk.jpg' },
  { id: 8, name: 'Custom Gifts', slug: 'custom-gifts-printing', icon: Gift, color: '#d97706', bg: '#fffbeb', image: '/uploads/categories/cat_gifts.jpg' },
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

// ─── Product Card ──────────────────────────────────────────────
function DemoProductCard({ product, priority = false }: { product: typeof PRODUCTS[0]; priority?: boolean }) {
  const router = useRouter();
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.slug}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', { icon: isWishlisted ? '💔' : '❤️' });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card overflow-hidden flex flex-col group relative"
      aria-label={product.name}
    >
      <div className="relative overflow-hidden bg-[#f8f9fa] aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={priority ? 'eager' : 'lazy'}
          unoptimized
        />
        {product.bestseller && (
          <span className="absolute top-2 left-2 badge badge-magenta text-[10px] px-2 py-0.5 flex items-center gap-1">
            <Zap size={9} /> Bestseller
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={14} className={isWishlisted ? 'fill-[#EC008C] text-[#EC008C]' : 'text-[#888]'} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[10px] text-[#888] font-medium uppercase tracking-wide mb-0.5">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#111] leading-snug line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={11} className="fill-[#FFD700] text-[#FFD700]" />
          <span className="text-xs font-semibold text-[#444]">{product.rating}</span>
          <span className="text-[10px] text-[#888]">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-2.5 gap-1 sm:gap-2">
          <div className="leading-none flex flex-col sm:flex-row sm:items-baseline">
            <span className="text-[13px] sm:text-base font-black text-[#111]">{formatPrice(product.price)}</span>
            <span className="text-[9px] sm:text-[10px] text-[#888] sm:ml-1 mt-0.5 sm:mt-0">onwards</span>
          </div>
          <button
            onClick={handleAdd}
            className="flex-shrink-0 flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 min-h-[28px] sm:min-h-[32px] bg-white border border-[#00AEEF] text-[#00AEEF]"
            aria-label="View details"
          >
            <span className="whitespace-nowrap px-1">View</span>
          </button>
        </div>
      </div>
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
export default function HomePage() {
  const bestsellers = PRODUCTS.filter(p => p.bestseller);
  const featured = PRODUCTS.filter(p => !p.bestseller);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': ['Organization', 'LocalBusiness'],
        name: 'Hashtag Custom Prints', url: 'https://hashtagprints.in',
        description: "Salem's leading custom printing service - t-shirts, notebooks, mugs, photo prints.",
        address: { '@type': 'PostalAddress', addressLocality: 'Salem', addressRegion: 'Tamil Nadu', postalCode: '636001', addressCountry: 'IN' },
        priceRange: '₹₹', openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '20:00' },
      }) }} />

      {showSplash && <MobileSplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && showOnboarding && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      <div className="container-app py-4 space-y-8">

        {/* Hero - Hidden on mobile, shown on tablet/desktop */}
        <section aria-label="Promotions"><BlinkitHero /></section>

        {/* Categories - Grid layout matching Blinkit mobile */}
        <section aria-labelledby="cat-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="cat-heading" className="text-lg md:text-xl font-black text-[#111]">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 justify-items-center">
            {CATEGORIES.map((cat) => {
              return (
                <Link key={cat.id} href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 group w-full max-w-[96px]"
                  aria-label={cat.name}>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg shadow-sm bg-[#f8f9fa] border border-gray-100 flex-shrink-0">
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight text-[#444] group-hover:text-[#111] transition-colors">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CMYK divider */}
        <div className="cmyk-divider" />

        {/* Bestsellers */}
        <section aria-labelledby="bestseller-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="bestseller-heading" className="text-lg font-black text-[#111]">Bestsellers</h2>
              <p className="text-xs text-[#888]">Most ordered in Salem</p>
            </div>
            <Link href="/products?bestseller=true" className="text-xs font-semibold text-[#EC008C] flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="product-grid">
            {bestsellers.map((p, i) => <DemoProductCard key={p.id} product={p} priority={i < 2} />)}
          </div>
        </section>

        {/* Design CTA */}
        <section aria-label="Design your own">
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
            style={{ background: 'linear-gradient(135deg,#111 0%,#1e1e1e 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#00AEEF,transparent)' }} />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#EC008C,transparent)' }} />
            </div>
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(0,174,239,0.12)', border: '1px solid rgba(0,174,239,0.2)' }}>
              <Upload size={36} className="text-[#00AEEF]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Design Your Own</h3>
              <p className="text-white/60 text-sm leading-relaxed">Upload your artwork, add text, choose your size - get an instant preview before ordering.</p>
            </div>
            <Link href="/products/classic-round-neck-custom-tshirt" className="flex-shrink-0 btn btn-lg font-bold"
              style={{ background: 'linear-gradient(135deg,#00AEEF,#EC008C)', color: 'white' }}>
              Start Designing <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* More Products */}
        <section aria-labelledby="more-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="more-heading" className="text-lg font-black text-[#111]">More Products</h2>
              <p className="text-xs text-[#888]">Hand-picked for you</p>
            </div>
            <Link href="/products" className="text-xs font-semibold text-[#00AEEF] flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="product-grid">
            {featured.map((p) => <DemoProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* FAQ */}
        <FAQSection />

        {/* Premium About blurb */}
        <section className="relative rounded-2xl overflow-hidden mt-8" style={{ background: '#f8f9fa' }}>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="relative w-full lg:w-1/2 aspect-video lg:aspect-square min-h-[300px]">
              <Image src="/uploads/products/realistic_polo.jpg" alt="About Hashtag Custom Printing" fill className="object-cover" unoptimized />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent, #f8f9fa)' }} />
            </div>
            <div className="w-full lg:w-1/2 p-8 lg:p-12 relative z-10 -mt-12 lg:mt-0 bg-[#f8f9fa] lg:bg-transparent" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black)' }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: '#00AEEF15', color: '#00AEEF' }}>
                <Check size={12} /> Trusted by 500+ Businesses
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111] leading-tight mb-4">
                About Hashtag - Custom Printing in Salem
              </h2>
              <p className="text-[#444] leading-relaxed mb-4">
                Hashtag is Salem&apos;s premier custom printing studio, offering premium personalized t-shirts, notebooks, mugs, photo prints, business cards, and stickers.
              </p>
              <p className="text-[#444] leading-relaxed mb-6">
                We serve individuals, corporate teams, schools, and event organizers across Tamil Nadu. Same-day dispatch available in Salem.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/about" className="btn btn-primary font-bold">
                  Learn more
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-[#e5e7eb] border-2 border-white flex items-center justify-center text-[10px] text-[#888] font-bold">😊</div>)}
                  </div>
                  <span className="text-xs font-semibold text-[#888]">10k+ Happy Customers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

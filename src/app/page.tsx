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

// Splash Screen Video Removed as per request

// Splash Screen Video Removed as per request

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
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setIsChecking(false);
  }, []);

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
        {/* Subtle decorative background for top header */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #FFD700 0%, transparent 50%)' }} />
        
        {/* Header Row - Aligned EXACTLY like Blinkit */}
        <div className="flex flex-col relative z-10 mb-4">
          <span className="text-[12px] font-extrabold opacity-90 tracking-wide mb-1">Hashtag in</span>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-[40px] font-black leading-none drop-shadow-md">24 hours</h1>
              <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 border border-white/20 shadow-sm mt-1">
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
              <div className="w-12 h-12 flex flex-col items-center justify-end group-hover:scale-110 transition-transform">
                <Sparkles size={28} className="text-[#FFD700] drop-shadow-md" />
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
        <div className="bg-gradient-to-b from-[#631505] to-[#3d0901] rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#a1291b] overflow-hidden relative">
           
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
        {/* Festive Picks */}
        <section aria-labelledby="festive-heading">
          <div className="flex items-center justify-center mb-6 relative">
             <h2 id="festive-heading" className="text-2xl font-serif font-black text-[#8B1C10] tracking-wide">Festive Picks</h2>
          </div>
          
          {/* Horizontal scroll like Blinkit */}
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {bestsellers.map((p, i) => (
              <div key={p.id} className="w-[160px] sm:w-[180px] flex-shrink-0 snap-start bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
                 <DemoProductCard product={p} priority={i < 2} />
              </div>
            ))}
          </div>
        </section>
        
        {/* CMYK divider */}
        <div className="cmyk-divider" />

        {/* Regular Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[19px] font-black text-[#111]">Explore Categories</h2>
            <Link href="/products" className="text-[13px] font-bold text-[#00AEEF]">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.slice(0, 8).map((p) => (
               <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
                  <DemoProductCard product={p} />
               </div>
            ))}
          </div>
        </section>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
           <FAQSection />
        </div>
      </div>

      {/* Floating Free Delivery Banner - Exact Replica */}
      <div className="fixed bottom-[64px] lg:bottom-6 left-4 right-4 z-40 max-w-[400px] mx-auto">
         <div className="bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border border-gray-100 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="text-[#0284c7]">
                 <Bike size={32} strokeWidth={1.5} />
               </div>
               <div>
                  <h4 className="text-[#0284c7] font-bold text-[14px] leading-tight">Get FREE delivery</h4>
                  <p className="text-[12px] font-medium text-gray-500 mt-0.5">on your order above ₹999 <ChevronRight size={12} className="inline opacity-60 -mt-0.5" /></p>
               </div>
            </div>
            <div className="flex items-center gap-3 pr-1">
               <button className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 border border-gray-100 hover:bg-gray-100 transition-colors">
                 <X size={14} />
               </button>
               <div className="flex flex-col items-center gap-0.5 border-l border-gray-200 pl-3">
                 <span className="text-[10px] font-bold text-gray-500 leading-none">1/2</span>
                 <div className="flex gap-1 mt-0.5">
                   <div className="w-1 h-1 bg-[#111] rounded-full" />
                   <div className="w-1 h-1 bg-gray-300 rounded-full" />
                 </div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
}

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Star, Zap, ShoppingCart, Check, Plus, ChevronRight, BookOpen, Coffee, ImageIcon, CreditCard, Package, Gift, Shirt, Tag, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── Demo product data ─────────────────────────────────────────
export const ALL_PRODUCTS = [
  { id:1, name:'Classic Round Neck Custom T-Shirt', slug:'classic-round-neck-custom-tshirt', price:299, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/tshirt.jpg', rating:4.8, reviews:124, bestseller:true, description:'180 GSM combed cotton. Custom front/back print. Sizes XS–3XL.' },
  { id:2, name:'Polo Neck Custom T-Shirt', slug:'polo-neck-custom-tshirt', price:499, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Polo Neck Custom T-Shirt.png', rating:4.6, reviews:45, bestseller:false, description:'220 GSM pique cotton polo. Embroidered or printed logo. Perfect for corporate teams.' },
  { id:3, name:'A5 Spiral Custom Notebook', slug:'a5-spiral-custom-notebook', price:199, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/A5 Spiral Custom Notebook.png', rating:4.7, reviews:89, bestseller:false, description:'200 pages, ruled. Custom cover print. Durable spiral binding.' },
  { id:4, name:'Custom Hardcover Notebook', slug:'custom-hardcover-notebook', price:349, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/Custom Hardcover Notebook.png', rating:4.5, reviews:33, bestseller:false, description:'A5 hardcover with 150 ruled pages. Custom logo on cover.' },
  { id:5, name:'Custom Photo Magic Mug', slug:'custom-photo-magic-mug', price:349, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Custom Photo Magic Mug.png', rating:4.9, reviews:201, bestseller:true, description:'325ml ceramic mug. Heat-sensitive color change. Dishwasher safe.' },
  { id:6, name:'Premium Canvas Photo Print', slug:'premium-canvas-photo-print', price:699, category:'Canvas Prints', categorySlug:'photo-printing-online', image:'/uploads/products/Premium Canvas Photo Print.png', rating:4.8, reviews:67, bestseller:false, description:'Gallery-quality canvas. UV-resistant inks. Ready to hang.' },
  { id:7, name:'Standard Business Cards (100 pcs)', slug:'standard-business-cards', price:299, category:'Business Cards', categorySlug:'business-card-printing', image:'/uploads/products/Standard Business Cards (100 pcs).png', rating:4.7, reviews:156, bestseller:true, description:'350 GSM matt/gloss laminate. Double-sided full colour print.' },
  { id:8, name:'Bulk T-Shirt Printing (50 pcs)', slug:'bulk-tshirt-printing', price:9999, category:'Bulk Orders', categorySlug:'bulk-printing', image:'/uploads/products/Bulk T-Shirt Printing (50 pcs).png', rating:4.8, reviews:42, bestseller:false, description:'50-piece bulk order. Choose sizes & colours. Screen or DTF printing.' },
  { id:9, name:'Corporate Gifting Set', slug:'corporate-gifting-set', price:1499, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Corporate Gifting Set.png', rating:4.9, reviews:88, bestseller:true, description:'Premium gift box containing custom printed notebook, pen, and coffee mug.' },
  { id:10, name:'Custom Printed Hoodie', slug:'custom-printed-hoodie', price:899, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Custom Printed Hoodie.png', rating:4.7, reviews:56, bestseller:false, description:'Premium 320 GSM cotton fleece hoodie with kangaroo pockets. Stay warm and stylish with custom prints.' },
  { id:11, name:'Oversized Drop Shoulder T-Shirt', slug:'oversized-drop-shoulder-tshirt', price:499, category:'T-Shirts', categorySlug:'custom-tshirt-printing', image:'/uploads/products/Oversized Drop Shoulder T-Shirt.png', rating:4.8, reviews:89, bestseller:true, description:'Trendy oversized t-shirt in 220 GSM heavyweight cotton. Perfect for streetwear and casual custom designs.' },
  { id:12, name:'Custom Pocket Notebook A6', slug:'custom-pocket-notebook-a6', price:99, category:'Notebooks', categorySlug:'custom-notebook-printing', image:'/uploads/products/Custom Pocket Notebook A6.png', rating:4.6, reviews:34, bestseller:false, description:'Handy A6 pocket notebook with custom soft cover. 120 pages of 70 GSM paper. Easy to carry everywhere.' },
  { id:13, name:'Enamel Campfire Mug', slug:'enamel-campfire-mug', price:299, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Enamel Campfire Mug.png', rating:4.9, reviews:112, bestseller:false, description:'Durable enamel mug for outdoors. Custom printing that won\'t fade. Lightweight and shatterproof.' },
  { id:14, name:'Frosted Glass Beer Stein', slug:'frosted-glass-beer-stein', price:499, category:'Photo Mugs', categorySlug:'custom-mug-printing', image:'/uploads/products/Frosted Glass Stein.png', rating:4.8, reviews:76, bestseller:true, description:'Heavy frosted glass beer mug (16oz) with full-color custom print. Perfect for parties and gifts.' },
  { id:15, name:'Premium Acrylic Photo Print', slug:'premium-acrylic-photo-print', price:899, category:'Canvas Prints', categorySlug:'photo-printing-online', image:'/uploads/products/Premium Acrylic Photo Print.png', rating:5.0, reviews:45, bestseller:true, description:'Stunning HD print mounted on 5mm thick crystal clear acrylic. Modern and sleek frameless look.' },
  { id:16, name:'Transparent Business Cards (100 pcs)', slug:'transparent-business-cards-100', price:799, category:'Business Cards', categorySlug:'business-card-printing', image:'/uploads/products/Transparent Business Cards (100 pcs).png', rating:4.7, reviews:67, bestseller:false, description:'Stand out with clear, waterproof PVC business cards. Custom printed with high durability.' },
  { id:17, name:'Custom Die-Cut Vinyl Stickers', slug:'custom-die-cut-vinyl-stickers', price:99, category:'Stickers', categorySlug:'custom-sticker-printing', image:'/uploads/products/Custom Die-Cut Vinyl Stickers.png', rating:4.9, reviews:230, bestseller:true, description:'Durable, waterproof, and weatherproof die-cut stickers. Cut to the exact shape of your design.' },
  { id:18, name:'Personalized Mouse Pad', slug:'personalized-mouse-pad', price:199, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Personalized Mouse Pad.png', rating:4.8, reviews:154, bestseller:false, description:'Custom printed mouse pad with anti-slip rubber base and smooth fabric surface.' },
  { id:19, name:'Custom Printed Keychain', slug:'custom-printed-keychain', price:149, category:'Custom Gifts', categorySlug:'custom-gifts-printing', image:'/uploads/products/Custom Printed Keychain.png', rating:4.6, reviews:88, bestseller:false, description:'High-quality MDF wood or acrylic keychains printed with your photos, logos, or text.' },
];

const CATEGORIES = [
  { slug:'', name:'All', icon: SlidersHorizontal },
  { slug:'custom-tshirt-printing', name:'T-Shirts', icon: Shirt },
  { slug:'custom-notebook-printing', name:'Notebooks', icon: BookOpen },
  { slug:'custom-mug-printing', name:'Photo Mugs', icon: Coffee },
  { slug:'photo-printing-online', name:'Canvas', icon: ImageIcon },
  { slug:'business-card-printing', name:'Cards', icon: CreditCard },
  { slug:'custom-sticker-printing', name:'Stickers', icon: Tag },
  { slug:'bulk-printing', name:'Bulk', icon: Package },
  { slug:'custom-gifts-printing', name:'Gifts', icon: Gift },
];

const SORT_OPTIONS = [
  { value:'newest', label:'Newest First' },
  { value:'popular', label:'Most Popular' },
  { value:'price_asc', label:'Price: Low → High' },
  { value:'price_desc', label:'Price: High → Low' },
  { value:'rating', label:'Top Rated' },
];

const PRICE_RANGES = [
  { label:'Under ₹200', min:0, max:200 },
  { label:'₹200–₹500', min:200, max:500 },
  { label:'₹500–₹1000', min:500, max:1000 },
  { label:'Above ₹1000', min:1000, max:999999 },
];

function ProductCard({ product }: { product: typeof ALL_PRODUCTS[0] }) {
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
    <Link href={`/products/${product.slug}`} className="card overflow-hidden flex flex-col group relative" aria-label={product.name}>
      <div className="relative overflow-hidden bg-[#f8f9fa] aspect-square">
        <Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw,33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" unoptimized />
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
          <button onClick={handleAdd}
            className="flex-shrink-0 flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-200 min-h-[28px] sm:min-h-[32px] bg-white border border-[#00AEEF] text-[#00AEEF]"
            aria-label="View details">
            <span className="whitespace-nowrap px-1">View</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSort, setShowSort] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = Number(searchParams.get('minPrice') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 999999);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Filter
  let products = ALL_PRODUCTS.filter(p => {
    if (category && p.categorySlug !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (minPrice && p.price < minPrice) return false;
    if (maxPrice < 999999 && p.price > maxPrice) return false;
    return true;
  });

  // Sort
  if (sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') products = [...products].sort((a, b) => b.reviews - a.reviews);

  const activeCategory = CATEGORIES.find(c => c.slug === category);
  const hasFilters = !!(category || search || minPrice || maxPrice < 999999);

  return (
    <div className="container-app py-4">

      <div className="mb-4">
        <h1 className="text-xl font-black text-[#111]">
          {search ? `Results for "${search}"` : activeCategory?.name || 'All Products'}
        </h1>
        <p className="text-sm text-[#888]">{products.length} products</p>
      </div>

      {/* Category chips */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 mb-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.slug;
          return (
            <button key={cat.slug} onClick={() => updateParam('category', cat.slug)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-all border"
              style={{ background: isActive ? '#00AEEF' : 'white', color: isActive ? 'white' : '#444', borderColor: isActive ? '#00AEEF' : '#e5e7eb' }}>
              <Icon size={13} /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        <button onClick={() => setShowSort(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#e5e7eb] bg-white text-xs font-semibold text-[#444] flex-shrink-0">
          <ArrowUpDown size={13} /> Sort
        </button>
        {PRICE_RANGES.map((range) => {
          const isActive = minPrice === range.min && (maxPrice === range.max || (range.max === 999999 && maxPrice >= 999999));
          return (
            <button key={range.label} onClick={() => {
              if (isActive) { updateParam('minPrice', ''); updateParam('maxPrice', ''); }
              else { updateParam('minPrice', range.min.toString()); updateParam('maxPrice', range.max.toString()); }
            }}
              className="flex-shrink-0 px-3 py-2 rounded-full border text-xs font-semibold transition-all"
              style={{ borderColor: isActive ? '#00AEEF' : '#e5e7eb', background: isActive ? '#00AEEF' : 'white', color: isActive ? 'white' : '#444' }}>
              {range.label}
            </button>
          );
        })}
        {hasFilters && (
          <button onClick={() => router.push('/products')}
            className="flex items-center gap-1 flex-shrink-0 px-3 py-2 rounded-full border border-[#e5e7eb] bg-white text-xs font-semibold text-[#EC008C]">
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <SlidersHorizontal size={48} className="mx-auto text-[#ccc] mb-4" />
          <h3 className="text-lg font-bold text-[#111] mb-2">No products found</h3>
          <p className="text-sm text-[#888] mb-6">Try adjusting your filters.</p>
          <button onClick={() => router.push('/products')} className="btn btn-primary btn-sm">Clear filters</button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Sort Drawer */}
      {showSort && (
        <>
          <div className="drawer-overlay" onClick={() => setShowSort(false)} />
          <div className="drawer-panel pb-8">
            <div className="drawer-handle" />
            <div className="p-5">
              <h3 className="font-black text-[#111] text-base mb-4">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { updateParam('sort', opt.value); setShowSort(false); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: sort === opt.value ? '#e0f7ff' : 'transparent', color: sort === opt.value ? '#00AEEF' : '#444' }}>
                    {opt.label}
                    {sort === opt.value && <span className="w-4 h-4 rounded-full bg-[#00AEEF] flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-white" /></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-app py-4"><div className="product-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}</div></div>}>
      <ProductsContent />
    </Suspense>
  );
}

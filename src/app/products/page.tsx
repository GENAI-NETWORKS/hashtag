'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Star, Zap, ShoppingCart, Check, Plus, ChevronRight, ChevronDown, BookOpen, Coffee, ImageIcon, CreditCard, Package, Gift, Shirt, Tag, Heart, LayoutGrid } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ProductBottomSheet } from '@/components/ui/ProductBottomSheet';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';

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
  { slug:'custom-tshirt-printing', name:'T-Shirts', icon: Shirt, image: '/uploads/products/tshirt.jpg' },
  { slug:'custom-notebook-printing', name:'Notebooks', icon: BookOpen, image: '/uploads/products/A5 Spiral Custom Notebook.png' },
  { slug:'custom-mug-printing', name:'Photo Mugs', icon: Coffee, image: '/uploads/products/Custom Photo Magic Mug.png' },
  { slug:'photo-printing-online', name:'Canvas', icon: ImageIcon, image: '/uploads/products/Premium Canvas Photo Print.png' },
  { slug:'business-card-printing', name:'Cards', icon: CreditCard, image: '/uploads/products/Standard Business Cards (100 pcs).png' },
  { slug:'custom-sticker-printing', name:'Stickers', icon: Tag, image: '/uploads/products/Custom Die-Cut Vinyl Stickers.png' },
  { slug:'bulk-printing', name:'Bulk', icon: Package, image: '/uploads/products/Bulk T-Shirt Printing (50 pcs).png' },
  { slug:'custom-gifts-printing', name:'Gifts', icon: Gift, image: '/uploads/products/Corporate Gifting Set.png' },
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
          <span className="absolute top-2 left-2 badge badge-magenta text-[10px] px-2 py-0.5 flex items-center gap-1">
            <Zap size={9} /> Bestseller
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={14} className={isMounted && isWishlisted ? 'fill-[#EC008C] text-[#EC008C]' : 'text-[#888]'} />
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
          <div className="flex flex-col items-end flex-shrink-0">
            <button onClick={handleAdd}
              className="flex items-center justify-center px-4 py-1.5 rounded-md border border-[#0f8a3c] bg-green-50/50 text-[#0f8a3c] text-xs font-black transition-all duration-200 shadow-sm uppercase tracking-wide"
              aria-label="Add to cart">
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSort, setShowSort] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsBottomSheetOpen(true);
  };

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
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Left Sidebar (Categories) */}
      <div className="w-[80px] sm:w-[100px] flex-shrink-0 border-r border-gray-100 overflow-y-auto scrollbar-hide bg-gray-50/50 pb-20">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.slug;
          return (
            <button key={cat.slug} onClick={() => updateParam('category', cat.slug)}
              className={`w-full flex flex-col items-center py-4 px-1 gap-2 relative transition-colors ${isActive ? 'bg-white' : 'hover:bg-gray-100'}`}>
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0f8a3c] rounded-r-md" />}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 relative shadow-sm flex-shrink-0 flex items-center justify-center">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <cat.icon size={20} className="text-gray-400" />
                )}
              </div>
              <span className={`text-[10px] leading-tight text-center ${isActive ? 'font-bold text-[#111]' : 'font-semibold text-[#666]'}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-white relative pb-20">
        <div className="p-3 sm:p-4">
          

          {/* Filters Row */}
          <div className="flex items-center gap-2 mb-4 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10 -mx-3 px-3 sm:-mx-4 sm:px-4 overflow-x-auto scrollbar-hide shadow-[0_4px_6px_-6px_rgba(0,0,0,0.1)]">
            <button onClick={() => setShowSort(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[13px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              <SlidersHorizontal size={14} className="text-gray-500" /> Filters <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button onClick={() => setShowSort(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[13px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              <ArrowUpDown size={14} className="text-gray-500" /> Sort <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[13px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              Material <ChevronDown size={14} className="text-gray-500" />
            </button>
            {hasFilters && (
              <button onClick={() => router.push('/products')} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-200 text-[13px] font-semibold text-red-600 bg-red-50 whitespace-nowrap">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <SlidersHorizontal size={48} className="mx-auto text-[#ccc] mb-4" />
              <h3 className="text-lg font-bold text-[#111] mb-2">No products found</h3>
              <p className="text-sm text-[#888] mb-6">Try adjusting your filters.</p>
              <button onClick={() => router.push('/products')} className="px-4 py-2 bg-[#0f8a3c] text-white rounded-lg text-sm font-bold">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => <ProductCard key={p.id} product={p} onSelect={handleSelectProduct} />)}
            </div>
          )}
        </div>
      </div>

      {/* Sort Drawer */}
      {showSort && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[100]" onClick={() => setShowSort(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[101] pb-8 animate-slideInBottom">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto my-3" />
            <div className="p-5">
              <h3 className="font-black text-[#111] text-base mb-4">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => { updateParam('sort', opt.value); setShowSort(false); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ background: sort === opt.value ? '#e6f7eb' : 'transparent', color: sort === opt.value ? '#0f8a3c' : '#444' }}>
                    {opt.label}
                    {sort === opt.value && <span className="w-4 h-4 rounded-full bg-[#0f8a3c] flex items-center justify-center"><span className="w-2 h-2 rounded-full bg-white" /></span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <ProductBottomSheet 
        product={selectedProduct} 
        isOpen={isBottomSheetOpen} 
        onClose={() => setIsBottomSheetOpen(false)} 
        onSelectProduct={handleSelectProduct}
      />
      <FloatingCartButton />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-app py-4"><div className="product-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}</div></div>}>
      <div className="flex flex-col h-[calc(100dvh-144px)] lg:h-[calc(100dvh-92px)] overflow-hidden w-full">
        <ProductsContent />
      </div>
    </Suspense>
  );
}

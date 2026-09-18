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
import { ALL_PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ui/ProductCard';



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

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSort, setShowSort] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleSelectProduct = (product: any) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      router.push(`/products/${product.slug}`);
    } else {
      setSelectedProduct(product);
      setIsBottomSheetOpen(true);
    }
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
              <span className={`text-[12px] leading-tight text-center ${isActive ? 'font-bold text-[#111]' : 'font-semibold text-[#666]'}`}>
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
            <button onClick={() => setShowSort(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[15px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              <SlidersHorizontal size={14} className="text-gray-500" /> Filters <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button onClick={() => setShowSort(true)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[15px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              <ArrowUpDown size={14} className="text-gray-500" /> Sort <ChevronDown size={14} className="text-gray-500" />
            </button>
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-[15px] font-semibold text-[#444] bg-white whitespace-nowrap active:bg-gray-50 transition-colors">
              Material <ChevronDown size={14} className="text-gray-500" />
            </button>
            {hasFilters && (
              <button onClick={() => router.push('/products')} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-200 text-[15px] font-semibold text-red-600 bg-red-50 whitespace-nowrap">
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

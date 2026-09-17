'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { ALL_PRODUCTS } from '@/app/products/page';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowLeft, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

function WishlistCard({ product }: { product: typeof ALL_PRODUCTS[0] }) {
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const addItem = useCartStore((s) => s.addItem);
  const hasOptions = product.categorySlug === 'custom-tshirt-printing';

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/products/${product.slug}`} className="card overflow-hidden flex flex-col group relative">
      <div className="relative overflow-hidden bg-[#f8f9fa] aspect-square">
        <Image src={product.image} alt={product.name} fill sizes="(max-width:640px) 50vw,33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" unoptimized />
        {product.bestseller && (
          <span className="absolute top-2 left-2 badge badge-magenta text-[12px] px-2 py-0.5 flex items-center gap-1">
            <Zap size={9} /> Bestseller
          </span>
        )}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors text-[#EC008C]"
        >
          <Heart size={14} className="fill-[#EC008C]" />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[12px] text-[#888] font-medium uppercase tracking-wide mb-0.5">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#111] leading-snug line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2.5 gap-1 sm:gap-2">
          <div className="leading-none flex flex-col sm:flex-row sm:items-baseline">
            <span className="text-[15px] sm:text-base font-black text-[#111]">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={(e) => {
              if (hasOptions) return; // Link will handle routing
              e.preventDefault();
              e.stopPropagation();
              // @ts-ignore
              addItem({ id: product.id, name: product.name, basePrice: product.price, images: [product.image], slug: product.slug, categoryId: 1 });
            }}
            className="flex-shrink-0 flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[12px] sm:text-xs font-bold transition-all duration-200 min-h-[28px] sm:min-h-[32px] bg-white border border-[#00AEEF] text-[#00AEEF]"
          >
            <span className="whitespace-nowrap px-1">{hasOptions ? 'Select' : 'Add'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function WishlistPage() {
  const itemIds = useWishlistStore((s) => s.items);
  const wishlistedProducts = ALL_PRODUCTS.filter((p) => itemIds.includes(p.id));

  return (
    <div className="container-app py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center hover:bg-[#e5e7eb] transition-colors">
          <ArrowLeft size={16} className="text-[#111]" />
        </Link>
        <h1 className="text-xl font-black text-[#111]">My Wishlist</h1>
        <span className="badge badge-gray text-xs ml-auto">{wishlistedProducts.length} items</span>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="card p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#fee2e2] flex items-center justify-center mb-4">
            <Heart size={28} className="text-[#EC008C]" />
          </div>
          <h2 className="text-lg font-bold text-[#111] mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-[#888] mb-6 max-w-xs">
            Save items you love to your wishlist to easily find them later.
          </p>
          <Link href="/products" className="btn btn-primary px-8">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {wishlistedProducts.map((p) => (
            <WishlistCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

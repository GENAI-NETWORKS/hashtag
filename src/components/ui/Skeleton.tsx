interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} style={style} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CategoryChipSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0" aria-hidden="true">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <Skeleton className="w-14 h-2.5 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card p-4 space-y-3" aria-hidden="true">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return <Skeleton className="w-full h-48 sm:h-64 lg:h-80 rounded-2xl" />;
}


import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Predefined skeleton patterns for common use cases
const SkeletonCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border rounded-lg p-5 space-y-3", className)} {...props}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-20 w-full" />
    <div className="flex justify-between">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
)

const SkeletonText = ({ lines = 3, className, ...props }: { lines?: number } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )} 
      />
    ))}
  </div>
)

export { Skeleton, SkeletonCard, SkeletonText }

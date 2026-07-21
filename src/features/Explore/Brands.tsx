import { Link } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import { useBrands } from "./hooks"

export default function Brands() {
  const { data: brands, isLoading, isError } = useBrands()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Brands</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all brands available on Cartify.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load brands. Please try again.
        </p>
      )}

      {!isLoading && !isError && brands?.length === 0 && (
        <p className="text-sm text-muted-foreground">No brands found.</p>
      )}

      {!isLoading && !isError && brands && brands.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              to={`/brands/${brand._id}`}
              className="flex flex-col items-center gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex aspect-square w-full items-center justify-center">
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="truncate text-xs font-medium text-muted-foreground">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
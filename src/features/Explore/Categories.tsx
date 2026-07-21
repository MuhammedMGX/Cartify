import { Link } from "react-router-dom"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "./hooks"

export default function Categories() {
  const { data: categories, isLoading, isError } = useCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all product categories.
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Couldn't load categories. Please try again.
        </p>
      )}

      {!isLoading && !isError && categories?.length === 0 && (
        <p className="text-sm text-muted-foreground">No categories found.</p>
      )}

      {!isLoading && !isError && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`}
              className="group relative overflow-hidden rounded-xl border"
            >
              <AspectRatio ratio={1}>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
                    {category.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-base font-medium text-white">
                  {category.name}
                </span>
              </AspectRatio>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
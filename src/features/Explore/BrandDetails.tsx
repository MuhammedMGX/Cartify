import { useParams, } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "../Products/hooks"
import { getSpecificBrandsApi } from "./exploreApi"
import type { Product } from "../Products/product.types"
import { useEffect } from "react"
import ProductCard from "../Products/ProductCard"

export default function BrandDetails() {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => getSpecificBrandsApi(id!),
    enabled: !!id,
  })

  const { data: allProducts, isLoading: productsLoading } = useProducts()

  const brandProducts =
    allProducts?.filter((product: Product) => product.brand?._id === id) ?? []

  if (brandLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64" />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Brand not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-lg border bg-card p-2">
          <img
            src={brand.image}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {brandProducts.length} product{brandProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {productsLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : brandProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products from this brand yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-0 md:gap-5">
          {brandProducts.map((product: Product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  )
}
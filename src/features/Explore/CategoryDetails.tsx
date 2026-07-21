import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "../Products/hooks"
import { getSpecificCategoriesApi, getSubCategoriesApi } from "./exploreApi"
import type { Product } from "../Products/product.types"
import { useEffect } from "react"
import ProductCard from "../Products/ProductCard"

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getSpecificCategoriesApi(id!),
    enabled: !!id,
  })

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => getSubCategoriesApi(id!),
    enabled: !!id,
  })

  const { data: allProducts, isLoading: productsLoading } = useProducts()

  const categoryProducts =
    allProducts?.filter((product: Product) => product.category?._id === id) ?? []

  if (categoryLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center gap-4">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="size-16 rounded-lg object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {subcategories && subcategories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Badge key={sub._id} variant="secondary">
              {sub.name}
            </Badge>
          ))}
        </div>
      )}

      {productsLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : categoryProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products in this category yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-0 md:gap-5">
          {categoryProducts.map((product: Product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  )
}
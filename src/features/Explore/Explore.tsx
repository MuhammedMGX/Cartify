import { Link } from "react-router-dom"
import { ArrowRight, Star } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useBrands, useCategories } from "./hooks"
import { useProducts } from "../Products/hooks"
import type { Product } from "../Products/product.types"

export default function ExplorePage() {
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: brands, isLoading: brandsLoading } = useBrands()
  const { data: products, isLoading: productsLoading } = useProducts()

  const featuredProducts = [...(products ?? [])]
    .sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    .slice(0, 6)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page intro */}
      <div className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore</h1>
        <p className="mt-2 text-muted-foreground">
          Browse by category, discover top brands, and see what's trending right now.
        </p>
      </div>

      {/* Categories */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Shop by category</h2>
          <Button variant="ghost" size="sm" render={<Link to="/categories" />}>
            View all
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories?.slice(0, 6).map((category) => (
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
                  <span className="absolute bottom-2 left-2 right-2 text-sm font-medium text-white">
                    {category.name}
                  </span>
                </AspectRatio>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Brands */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Top brands</h2>
          <Button variant="ghost" size="sm" render={<Link to="/brands" />}>
            View all
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {brandsLoading ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {brands?.slice(0, 8).map((brand) => (
              <Link
                key={brand._id}
                to={`/brands/${brand._id}`}
                className="flex aspect-square items-center justify-center rounded-lg border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Top rated products</h2>
          <Button variant="ghost" size="sm" render={<Link to="/products" />}>
            View all
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 ">
            {featuredProducts.map((product: Product) => (
              <div
              key={product._id}
              className=" min:h-[360px] p-4 product rounded-xl overflow-hidden transition duration-500 shadow hover:shadow-2xl dark:shadow-gray-800 dark:hover:shadow-3xl relative dark:bg-gray-800"
            >
              <Link to={`/products/${product._id}/${product.category?.name ?? "category"}`}>
                <div>
                  <img
                    loading="lazy"
                    src={product.imageCover}
                    className="w-full h-full rounded-xl overflow-hidden"
                    alt={product.title}
                  />
                </div>

                <div className="flex justify-between pt-1">
                  <h3 className="text-sm font-semibold dark:text-gray-200">
                    {product.title.split(" ").slice(0, 2).join(" ")}
                  </h3>
                </div>

                <div className="flex justify-between items-center py-1">
                  <div className="font-medium text-sm text-gray-500 dark:text-gray-300 w-[50px]">
                    <Star size={13} fill="currentColor" className="inline-block text-yellow-400" />{" "}
                    {product.ratingsAverage}
                  </div>

                  {product.priceAfterDiscount ? (
                    <div className="relative flex justify-center font-bold text-sm dark:text-gray-200 w-[40px]">
                      £{product.priceAfterDiscount}
                      <span className="absolute -bottom-4 text-xs line-through text-gray-500 dark:text-gray-300 w-[40px]">
                        £{product.price}
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex justify-center font-bold text-sm dark:text-gray-200 w-[40px]">
                      £{product.price}
                    </div>
                  )}
                </div>
              </Link>

              {product.priceAfterDiscount ? (
                <div className="absolute top-0 left-0 w-[50px] h-[30px] bg-black rounded-br-xl flex justify-center items-center dark:bg-gray-700">
                  <h3 className="text-white text-xs font-extrabold dark:text-white">
                    {Math.round(((product.priceAfterDiscount - product.price) / product.price) * 100)}%
                  </h3>
                </div>
              ) : null}
            </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
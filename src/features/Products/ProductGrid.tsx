import { useEffect, useMemo, useState } from "react"
import {  useSearchParams } from "react-router-dom"
import { useProducts } from "./hooks"
import {  ArrowUpDown, Check } from "lucide-react" // FIXED: added missing icon imports
import { Button } from "@/components/ui/button" // FIXED: was missing entirely
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Product } from "./product.types"
import ProductCard from "./ProductCard"
import { useAppDispatch } from "@/store/hooks"
import { getWishlist } from "../Wishlist/wishlistSlice"
import { Spinner } from "@/components/Spinner"


type SortOption = "default" | "price-asc" | "price-desc" | "rating-desc" | "name-asc"

const sortLabels: Record<SortOption, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Highest Rated",
  "name-asc": "Name: A to Z",
}



export function ProductGrid() {
  const dispatch = useAppDispatch()
  const { data: products, isLoading, isError } = useProducts()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("default") 

  useEffect(() => {
    const paramValue = searchParams.get("search") ?? ""
    setSearch(paramValue)
  }, [searchParams])
   useEffect(() => {
      dispatch(getWishlist())
    }, [dispatch])

  const categories = useMemo(() => {
    if (!products) return []
    const unique = new Map<string, string>()
    products.forEach((product: Product) => {
      if (product.category?._id && product.category?.name) {
        unique.set(product.category._id, product.category.name)
      }
    })
    return Array.from(unique.entries())
  }, [products])


  const filteredProducts = useMemo(() => {
    if (!products) return []

    const normalizedSearch = search.trim().toLowerCase()

    let result = products.filter((item: Product) => {
      const matchesSearch = normalizedSearch
        ? item.title.toLowerCase().includes(normalizedSearch)
        : true
      const matchesCategory =
        categoryFilter === "all" || item.category?._id === categoryFilter 
      return matchesSearch && matchesCategory
    })

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.priceAfterDiscount ?? a.price) - (b.priceAfterDiscount ?? b.price)
        case "price-desc":
          return (b.priceAfterDiscount ?? b.price) - (a.priceAfterDiscount ?? a.price)
        case "rating-desc":
          return b.ratingsAverage - a.ratingsAverage
        case "name-asc":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return result
  }, [products, search, sortBy, categoryFilter])



  if (isLoading) return <Spinner />
  if (isError) return <p>Something went wrong loading products.</p>

  return (
    <div className="container py-10 mx-auto mb-20">


      <div className="flex flex-wrap items-center justify-between gap-3 px-4 mb-6 sm:px-10">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value ?? "all")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
              <ArrowUpDown className="size-4" />
              {sortLabels[sortBy]}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSortBy(option)}
                >
                  {sortLabels[option]}
                  {sortBy === option && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>


      <div className="flex flex-wrap justify-center gap-0 md:gap-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No products found.</p>
        )}
      </div>
    </div>
  )
}
import { useQuery } from "@tanstack/react-query"
import { getProducts, getProductById } from "./productsApi"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // cache considered fresh for 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}
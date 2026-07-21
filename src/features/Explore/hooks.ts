import { useQuery } from "@tanstack/react-query"
import { getCategoriesApi, getBrandsApi } from "./exploreApi"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
    staleTime: 1000 * 60 * 10, 
  })
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrandsApi,
    staleTime: 1000 * 60 * 10,
  })
}
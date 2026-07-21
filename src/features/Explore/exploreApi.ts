import axios from "axios";
import type { CategoriesData, BrandData } from "./explore.types";

export async function getCategoriesApi(): Promise<CategoriesData[]> {
  const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/categories");
  return data.data; 
}

export async function getSpecificCategoriesApi(catId: string): Promise<CategoriesData> {
  const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${catId}`);
  return data.data; 
}

export async function getSubCategoriesApi(catId: string): Promise<CategoriesData[]> {
  const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories/${catId}/subcategories`);
  return data.data; 
}

export async function getBrandsApi(): Promise<BrandData[]> {
  const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/brands");
  return data.data; 
}

export async function getSpecificBrandsApi(brandId: string): Promise<BrandData> {
  const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`);
  return data.data; 
}
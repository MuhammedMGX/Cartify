import axios from "axios"
import type { AddProductReview, Product, ProductReview } from "./product.types"

function getAuthHeaders() {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}`, token } : {}
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/products")
  return data.data
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  return data.data
}

export async function createReviewForProduct(id: string, values: AddProductReview): Promise<ProductReview> {
  const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/products/${id}/reviews`, values, {
    headers: getAuthHeaders(),
  })
  return data.data
}

export async function updateReviewForProduct(id: string, reviewId: string, values: AddProductReview): Promise<ProductReview> {
  const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/products/${id}/reviews/${reviewId}`, values, {
    headers: getAuthHeaders(),
  })
  return data.data
}

export async function deleteReviewForProduct(id: string, reviewId: string): Promise<void> {
  await axios.delete(`https://ecommerce.routemisr.com/api/v1/products/${id}/reviews/${reviewId}`, {
    headers: getAuthHeaders(),
  })
}

export async function getReviewForProduct(id: string): Promise<ProductReview[]> {
  const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}/reviews`, {
    headers: getAuthHeaders(),
  })
  const reviews = data?.data ?? data
  return Array.isArray(reviews) ? reviews : reviews ? [reviews] : []
}


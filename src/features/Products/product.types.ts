export interface Product {
  _id: string
  title: string
  description?: string
  price: number
  priceAfterDiscount?: number
  imageCover: string
  images?: string[]
  category: { _id: string; name: string; slug?: string; image?: string }
  brand: { _id: string; name: string; slug?: string; image?: string }
  ratingsAverage: number
  ratingsQuantity?: number
  quantity: number
}


export interface AddProductReview {
  review: string,
  rating: number
}

export type ProductReview = {
  _id: string
  review: string
  rating: number
  product: string
  user: { _id: string; name: string }
  createdAt: string
  updatedAt: string
}
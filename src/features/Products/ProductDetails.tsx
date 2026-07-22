import { useParams } from "react-router-dom"
import { Star, Heart, Share2, Truck } from "lucide-react"
import { useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useProduct, useProducts } from "./hooks"
import type { Product } from "./product.types";
import  {ProductReviews} from "./ProductReviews";
import ProductCard from "./ProductCard";
import { addToCart } from "../Cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "../Wishlist/wishlistSlice";

const CLOTHING_CATEGORIES = ["Men's Fashion", "Women's Fashion", "Kids", "Accessories", "Fashion"]

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="size-4"
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={1.5}
          style={{ color: "#FACA2C" }}
        />
      ))}
    </div>
  )
}


export default function ProductDetails() {
  const dispatch = useAppDispatch();
      const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError } = useProduct(id ?? "")
  const { data: allProducts } = useProducts()

const { wishlist } = useAppSelector((state) => state.wishlistReducer);
const isInWishlist = wishlist.some((item: Product) => item._id === product?._id);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [id]);


  const relatedProducts =
    allProducts?.filter(
      (item: Product) =>
        item.category?._id === product?.category?._id && item._id !== product?._id
    ) ?? []

  if (isLoading) return <p className="container mx-auto py-20 text-center"></p>
  if (isError || !product) return <p className="container mx-auto py-20 text-center">Product not found.</p>

  const discountPercent = product.priceAfterDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount) / product.price) * 100
      )
    : null



  return (
    <>
    
    
    <div className="container mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:justify-center">
        {/* Image carousel */}
        <div className="relative w-full md:w-1/2">
          <Carousel>
            <CarouselContent>
              {product.images?.map((src) => (
                <CarouselItem key={src}>
                  <img
                    src={src}
                    alt={product.title}
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </Button>

          {discountPercent && (
            <Badge className="absolute top-2 left-2 rounded-full">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-extrabold">{product.title}</h1>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.ratingsAverage} />
            <span className="text-sm font-medium text-muted-foreground">
              {product.ratingsQuantity} reviews
            </span>
          </div>

          <div className="my-6 flex items-baseline gap-3">
            {product.priceAfterDiscount ? (
              <>
                <span className="text-5xl font-extrabold">
                  £{product.priceAfterDiscount}
                </span>
                <span className="text-2xl font-extrabold text-muted-foreground line-through">
                  £{product.price}
                </span>
              </>
            ) : (
              <span className="text-5xl font-extrabold">£{product.price}</span>
            )}
          </div>

          <Separator />

          <p className="px-2 py-5 text-sm font-medium text-muted-foreground">
            {product.description}
          </p>
          <p className="px-2 pb-5 text-sm font-semibold">{product.category?.name}</p>

          <Separator />

          {/* Size selector — cosmetic only, matches original */}
          {product.category?.name && CLOTHING_CATEGORIES.includes(product.category.name) && (
            <div className="my-5 flex gap-2 px-1">
              {["S", "M", "L", "XL"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled
                >
                  {size}
                </Button>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2 pt-5 text-sm">
            <Button
              className="w-1/2 rounded-full"
              size="lg"
              onClick={() => dispatch(addToCart(product._id))}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => dispatch(toggleWishlist({productId: product._id, isInWishlist,}))}
              aria-label="Add to wishlist"
            >
              <Heart className="size-4 text-red-500" fill={isInWishlist ? "red" : "none"} />
            </Button>
          </div>
{/* {wishlistId.includes(productDetails._id) */}
          <p className="flex items-center gap-2 py-3 text-sm font-semibold text-muted-foreground">
            <Truck className="size-4" />
            Free delivery on orders over £350
          </p>
        </div>
      </div>


              <ProductReviews productId={product._id} />



      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto py-10">
          <h2 className="mb-7 mt-20 text-center text-xl font-extrabold">
            Related Products
          </h2>
          <div className="flex flex-wrap justify-center gap-0 md:gap-5">
            {relatedProducts.map((related: Product) => (
              <ProductCard key={related._id} product={related}/>
            ))}
          </div>
        </div>
      )}
    </div>
    
    
    
    </>
  )
}

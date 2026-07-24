import { Link } from "react-router-dom";
import type { Product } from "./product.types";
import { Heart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "../Wishlist/wishlistSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCard({product}: {product: Product}) {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.wishlistReducer);
  const isInWishlist = wishlist.some((item: Product) => item._id === product?._id);
// sm:w-1/4 md:w-1/4 lg:w-1/6
  return (
    <>
    
    <div className="w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6  min:h-[360px] p-4 product sm:rounded-xl border sm:border-none overflow-hidden transition duration-500   shadow-none    sm:shadow sm:hover:shadow-2xl   dark:hover:shadow-gray-900 dark:hover:shadow-xl  relative dark:bg-muted/50">
        <Link to={`/products/${product._id}/${product.category?.name ?? "category"}`}>
          <div className="aspect-3/4 ">

          {product.imageCover ? 
          <img
              loading="lazy"
              src={product.imageCover}
              className="w-full h-full rounded-xl overflow-hidden"
              alt={product.title}
            />:
            <Skeleton className="w-full h-full rounded-xl"/>
            }
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

        <button onClick={() => dispatch(toggleWishlist({productId: product._id, isInWishlist,}))} className=' btnH text-xl text-white px-2 rounded mx-auto absolute top-5 right-3'>
            <Heart className="size-4 text-red-500 cursor-pointer" fill={isInWishlist ? "red" : "none"} stroke={"Gray"}/>
        </button>

        {product.priceAfterDiscount ? (
          <div className="absolute top-0 left-0 w-[50px] h-[30px] bg-black rounded-br-xl flex justify-center items-center dark:bg-gray-700">
            <h3 className="text-white text-xs font-extrabold dark:text-white">
              {Math.round(((product.priceAfterDiscount - product.price) / product.price) * 100)}%
            </h3>
          </div>
        ) : null}
      </div>
     
    </>
  )
}

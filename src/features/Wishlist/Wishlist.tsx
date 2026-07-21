import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getWishlist } from './wishlistSlice';
import ProductCard from '../Products/ProductCard';
import type { Product } from '../Products/product.types';
import { Spinner } from '@/components/Spinner';

export default function Wishlist() {
const dispatch = useAppDispatch()
const { wishlist, isLoading  } = useAppSelector((state) => state.wishlistReducer) 


useEffect(() => {
  dispatch(getWishlist())
}, [dispatch])
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);

    if (isLoading) return <div className='w-full h-[100vh] flex justify-center items-center'><Spinner /></div>

  return (
    <>
  
  <div className='container py-10 mx-auto mb-20'>
                      
        <div className='flex flex-wrap justify-center md:gap-8 '>

            {wishlist.map((product:Product) => (
                        <ProductCard key={product._id} product={product}/>
                    )
                    )}

        </div>

</div>
    
</>

)}

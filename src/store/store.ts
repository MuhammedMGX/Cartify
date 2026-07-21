import { cartReducer } from '@/features/Cart/cartSlice'
import { wishlistReducer } from '@/features/Wishlist/wishlistSlice';
import { configureStore } from '@reduxjs/toolkit'

export let store = configureStore({
  reducer: {
    cartReducer: cartReducer,
    wishlistReducer: wishlistReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
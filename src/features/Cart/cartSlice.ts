import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { AddToCartApi, ApplyCouponApi, ClearCartApi, GetCartApi, RemoveProductFromCartApi, UpdateCartQuantityApi } from "./cartApi";
import type { CartState } from "./cart.types";


const initialState: CartState = {
  cartId: null,
  cart: null,
  numOfCartItems: 0,
  isLoading: false,
  error: null,
}

export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await GetCartApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (productId: string, { rejectWithValue , dispatch  }) => {
    try {
      const data = await AddToCartApi(productId);
      await dispatch(getCart());
      toast.success(data.message);
      return data;
    } catch (err: any) {
        toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ productId, count,}: { productId: string;count: number;}, { rejectWithValue }
  ) => {
    try {
      const data = await UpdateCartQuantityApi(productId, count);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId: string, { rejectWithValue , dispatch }) => {
    try {
      const data = await RemoveProductFromCartApi(productId);
      await dispatch(getCart());
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue , dispatch }) => {
    try {
      const data = await ClearCartApi();
      await dispatch(getCart());
      toast.success(data.message);
      return data;
    } catch (err: any) {
        toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data);
    }
  }
);


export const applyCoupon = createAsyncThunk(
  "cart/applyCoupon",
  async ( couponName: string, { rejectWithValue }
  ) => {
    try {
      const data = await ApplyCouponApi(couponName);
      toast.success(data.message);
      return data;
    } catch (err: any) {
        toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data);
    }
  }
);


export let cartSlice = createSlice({
    name: "Cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    builder
      // getCart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.data;
        state.cartId = action.payload.cartId;
        state.numOfCartItems = action.payload.numOfCartItems;
        })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload.data;
      })

      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload.data;
      })

      // updateCartQuantity 
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload.data;
      })

      // ADDED: clearCart was missing entirely
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      })

      // ADDED: applyCoupon was missing entirely
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.cart = action.payload.data;
      });
  },
});

export let {} = cartSlice.actions
export let cartReducer = cartSlice.reducer
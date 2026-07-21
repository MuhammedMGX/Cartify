import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { AddWishlistApi, GetWishlistApi, RemoveWishlistApi } from "./WishlistApi";


export interface CartState {
  wishlist: any | null;
  count:number ;
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
    wishlist: [],
    count:0,
    isLoading: false,
    error: null,
}


export let getWishlist = createAsyncThunk(
    "Wishlist/getWishlist",
     async (_, { rejectWithValue  }) => {
        try {
          const data = await GetWishlistApi();
          return data;
        } catch (err: any) {
          return rejectWithValue(err.response?.data);
        }
      }
)

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (
    {
      productId,
      isInWishlist,
    }: {
      productId: string;
      isInWishlist: boolean;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      let data;

      if (isInWishlist) {
        data = await RemoveWishlistApi(productId);
        toast.success(data.message);
      } else {
        data = await AddWishlistApi(productId);
        toast.success(data.message);
      }

      await dispatch(getWishlist());

      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.message);
      return rejectWithValue(err.response?.data);
    }
  }
);





export let wishlistSlice = createSlice({
    name: "Wishlist",
    initialState,
    reducers: {},
   extraReducers: (builder) => {
    builder
      // getCart
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlist = action.payload.data;
        state.count = action.payload.count;
        })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Toggle Wishlist
      .addCase(toggleWishlist.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(toggleWishlist.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(toggleWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

  },
});


export let {} = wishlistSlice.actions
export let wishlistReducer = wishlistSlice.reducer
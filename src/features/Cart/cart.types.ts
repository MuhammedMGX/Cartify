export interface CartState {
  cartId: string | null;
  cart: any | null 
  numOfCartItems: number ;
  isLoading: boolean
  error: string | null
}

export interface OnlineshippingAddressdata {
  details: string,
    phone: string,
    city: string
}

export interface CashshippingAddressdata {
  details: string,
    phone: string,
    city: string,
    postalCode: string
}


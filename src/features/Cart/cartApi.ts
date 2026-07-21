import axios from "axios";
import type { CashshippingAddressdata, OnlineshippingAddressdata } from "./cart.types";
const returnUrl = `${window.location.origin}/profile`;
console.log(returnUrl)
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    token: token ?? "",
    Authorization: token ? `Bearer ${token}` : "",
  };
}


export async function GetCartApi(): Promise<any> {
  const { data } = await axios.get("https://ecommerce.routemisr.com/api/v2/cart",
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function AddToCartApi(productId: string) {
  const { data } = await axios.post("https://ecommerce.routemisr.com/api/v2/cart",
    { productId } ,
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function UpdateCartQuantityApi(productId: string , count: number) {
  const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
    {count},
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function RemoveProductFromCartApi(productId: string) {
  const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function ClearCartApi() {
  const { data } = await axios.delete("https://ecommerce.routemisr.com/api/v2/cart",
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function ApplyCouponApi(couponName: string ) {
  const { data } = await axios.put("https://ecommerce.routemisr.com/api/v2/cart/applyCoupon",
    {couponName},
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function OnlinePaymentApi(shippingAddress: OnlineshippingAddressdata , cartId : string ) {
  await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
    {shippingAddress},
    { headers: getAuthHeaders() }
  ).then((data) => {
        window.location.href = data.data.session.url;
        return data;
      })
      .catch((err) => {
        return err;
      });
}

export async function cashPaymentApi(shippingAddress: CashshippingAddressdata , cartId : string ) {
  const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
    {shippingAddress},
    { headers: getAuthHeaders() }
  );
  return data;
}


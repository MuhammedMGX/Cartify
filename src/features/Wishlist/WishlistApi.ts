import axios from "axios";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    token: token ?? "",
    Authorization: token ? `Bearer ${token}` : "",
  };
}


export async function GetWishlistApi(): Promise<any> {
  const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist",
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function AddWishlistApi(productId : string): Promise<any> {
  const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/wishlist",
    {productId},
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function RemoveWishlistApi(productId : string): Promise<any> {
  const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
    {headers: getAuthHeaders() }
  );
  return data;
}



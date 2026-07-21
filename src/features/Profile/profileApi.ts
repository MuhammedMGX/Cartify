import axios from "axios";
import type { AddAddressData, UpdateUserDataData, UpdateUserPasswordData } from "./profile.types";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    token: token ?? "",
    Authorization: token ? `Bearer ${token}` : "",
  };
}


export async function UpdateUserPasswordApi(values: UpdateUserPasswordData) {
  const { data } = await axios.put(
    "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
    values,
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function UpdateUserDataApi(values: UpdateUserDataData) {
  const { data } = await axios.put(
    "https://ecommerce.routemisr.com/api/v1/users/updateMe",
    values,
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function AddAddressApi(values: AddAddressData) {
  const { data } = await axios.post(
    "https://ecommerce.routemisr.com/api/v1/addresses",
    values,
    { headers: getAuthHeaders() } 
  );
  return data;
}

export async function RemoveAddressApi(addressId: string) {
  const { data } = await axios.delete(
    `https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`,
    { headers: getAuthHeaders() } 
  );
  return data;
}

export async function GetAddressApi() {
  const { data } = await axios.get(
    "https://ecommerce.routemisr.com/api/v1/addresses",
    { headers: getAuthHeaders() }
  );
  return data;
}

export async function GetUserOrdersApi(values: string) {
  const { data } = await axios.get(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${values}`,
    { headers: getAuthHeaders() } 
  );
  return data;
}
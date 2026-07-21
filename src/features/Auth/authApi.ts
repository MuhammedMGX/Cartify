import axios from "axios";
import type { LoginFormData, RegisterFormData } from "./auth.types";

export async function loginApi(values: LoginFormData) {
  const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", values);
  return data;
}

export async function registerApi(values: RegisterFormData) {
  const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values);
  return data;
}

export async function forgotPasswordApi(values: { email: string }) {
  const { data } = await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", values);
  return data;
}

export async function verifyCodeApi(values: { code: string }) {
  const { data } = await axios.post(
    "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", 
    { resetCode: values.code } 
  );
  return data;
}

export async function resetPasswordApi(values: { email: string; password: string }) {
  const { data } = await axios.put( 
    "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
    { email: values.email, newPassword: values.password } 
  );
  return data;
}
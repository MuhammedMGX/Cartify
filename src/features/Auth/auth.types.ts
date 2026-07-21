export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}
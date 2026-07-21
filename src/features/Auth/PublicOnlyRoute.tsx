import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function PublicOnlyRoute() {
  const { token } = useAuth()

  if (token) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
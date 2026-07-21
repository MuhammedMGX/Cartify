import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "./AuthContext"

export function ProtectedRoute() {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    // ADDED: remember where the user was trying to go, so we can send them
    // back there after a successful login instead of always landing on "/"
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
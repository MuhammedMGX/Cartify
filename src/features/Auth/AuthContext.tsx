import { createContext, useContext, useState, type ReactNode } from "react"
import type { AuthContextType, User } from "./auth.types"


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  )
  const [user, setUser] = useState<User | null>(() => {
  const storedUser = localStorage.getItem("user")
  const storedToken = localStorage.getItem("token")

  if (!storedUser) return null

  const user = JSON.parse(storedUser)

  if (!user._id && storedToken) {
    const payload = JSON.parse(atob(storedToken.split(".")[1]))
    user._id = payload.id
  }

  return user
})

  const login = (newToken: string, newUser: User) => {
  const payload = JSON.parse(atob(newToken.split(".")[1]))

  const userWithId: User = {
    ...newUser,
    _id: payload.id,
  }

  localStorage.setItem("token", newToken)
  localStorage.setItem("user", JSON.stringify(userWithId))

  setToken(newToken)
  setUser(userWithId)
}

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}


import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import ProfileLayout from "./layouts/ProfileLayout"
import { ProtectedRoute } from "./features/Auth/ProtectedRoute"
import { PublicOnlyRoute } from "./features/Auth/PublicOnlyRoute"
import { Spinner } from "./components/Spinner"

// CHANGED: every page is now lazy-loaded instead of eagerly imported —
// each becomes its own chunk, only downloaded when that route is visited
const HomePage = lazy(() => import("./pages/HomePage"))
const ProductsPage = lazy(() => import("./pages/ProductsPage"))
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"))
const ExplorePage = lazy(() => import("./pages/ExplorePage"))
const BrandsPage = lazy(() => import("./pages/BrandsPage"))
const BrandDetailsPage = lazy(() => import("./pages/BrandDetailsPage"))
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"))
const CategoryDetailsPage = lazy(() => import("./pages/CategoryDetailsPage"))
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"))
const CartPage = lazy(() => import("./pages/CartPage"))
const WishlistPage = lazy(() => import("./pages/WishlistPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

const LoginPage = lazy(() => import("./pages/authPages/LoginPage"))
const RegisterPage = lazy(() => import("./pages/authPages/RegisterPage"))
const ForgotPasswordPage = lazy(() => import("./pages/authPages/ForgotPasswordPage"))
const VerifyResetCodePage = lazy(() => import("./pages/authPages/VerifyResetCodePage"))
const ResetPasswordPage = lazy(() => import("./pages/authPages/ResetPasswordPage"))

const ProfilePage = lazy(() => import("./pages/profilePages/ProfilePage"))
const OrdersPage = lazy(() => import("./pages/profilePages/OrdersPage"))
const AddressPage = lazy(() => import("./pages/profilePages/AddressPage"))
const SettingsPage = lazy(() => import("./pages/profilePages/SettingsPage"))
const HelpCenter = lazy(() =>
  import("./pages/profilePages/HelpCenter").then((m) => ({ default: m.HelpCenter })) 
)
const FAQ = lazy(() =>
  import("./pages/profilePages/FAQ").then((m) => ({ default: m.FAQ })) 
)

function withSuspense(element: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100vh] items-center justify-center text-sm text-muted-foreground">
          <Spinner />
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(<HomePage />), handle: { title: "Home" } },
      { path: "/products", element: withSuspense(<ProductsPage />), handle: { title: "Products" } },
      { path: "/products/:id/:category", element: withSuspense(<ProductDetailsPage />), handle: { title: "Product" } },
      { path: "/explore", element: withSuspense(<ExplorePage />), handle: { title: "Explore" } },
      { path: "/brands", element: withSuspense(<BrandsPage />), handle: { title: "Brands" } },
      { path: "/brands/:id", element: withSuspense(<BrandDetailsPage />), handle: { title: "Brand" } },
      { path: "/categories", element: withSuspense(<CategoriesPage />), handle: { title: "Categories" } },
      { path: "/categories/:id", element: withSuspense(<CategoryDetailsPage />), handle: { title: "Category" } },
      { path: "/checkout", element: withSuspense(<CheckoutPage />), handle: { title: "Checkout" } },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "/cart", element: withSuspense(<CartPage />), handle: { title: "Your Cart" } },
          { path: "/wishlist", element: withSuspense(<WishlistPage />), handle: { title: "Wishlist" } },
          {
            element: <ProfileLayout />,
            children: [
              { path: "/profile", element: withSuspense(<ProfilePage />), handle: { title: "Profile" } },
              { path: "/profile/allorders", element: withSuspense(<OrdersPage />), handle: { title: "Your Orders" } },
              { path: "/profile/addresses", element: withSuspense(<AddressPage />), handle: { title: "Addresses" } },
              { path: "/profile/settings", element: withSuspense(<SettingsPage />), handle: { title: "Settings" } },
              { path: "/profile/helpcenter", element: withSuspense(<HelpCenter />), handle: { title: "Help Center" } },
              { path: "/profile/faq", element: withSuspense(<FAQ />), handle: { title: "FAQ" } },
            ],
          },
        ],
      },

      { path: "*", element: withSuspense(<NotFoundPage />), handle: { title: "Page Not Found" } },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "/login", element: withSuspense(<LoginPage />), handle: { title: "Login" } },
          { path: "/register", element: withSuspense(<RegisterPage />), handle: { title: "Register" } },
        ],
      },
      { path: "/forgotPassword", element: withSuspense(<ForgotPasswordPage />), handle: { title: "Forgot Password" } },
      { path: "/verifyResetCode", element: withSuspense(<VerifyResetCodePage />), handle: { title: "Verify Code" } },
      { path: "/resetPassword", element: withSuspense(<ResetPasswordPage />), handle: { title: "Reset Password" } },
    ],
  },
])
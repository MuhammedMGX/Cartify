import { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Menu, ShoppingCart, Heart, Search, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/features/Auth/AuthContext"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { getCart } from "@/features/Cart/cartSlice"
import { getWishlist } from "@/features/Wishlist/wishlistSlice"
import { ThemeToggle } from "./ThemeToggle"

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Explore", to: "/explore" },
]

export function Navbar() {
  const dispatch = useAppDispatch()
  const { numOfCartItems } = useAppSelector((state) => state.cartReducer) 
  const { count } = useAppSelector((state) => state.wishlistReducer);
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate() 

  useEffect(() => {
    dispatch(getCart())
    dispatch(getWishlist())
  }, [])

  const handleSearchSubmit = (query: string, closeAfter: () => void) => {
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/products?search=${encodeURIComponent(trimmed)}`)
    closeAfter()
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8 xl:flex xl:justify-between">

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <span className="text-xl font-bold tracking-tight">
                  <span className="font-black">C</span>artify
                </span>
              </SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-4 px-4">


              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearchSubmit(mobileSearchQuery, () => {
                    setMobileOpen(false)
                    setMobileSearchQuery("")
                  })
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                />
              </form>


              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                        isActive ? "bg-accent text-foreground" : "text-muted-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="border-t pt-4">
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <User className="size-4" />
                    {user.name}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    <User className="size-4" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

  
        <Link
          to="/"
          className="col-start-2 flex shrink-0 items-center justify-self-center xl:col-start-auto xl:order-first xl:justify-self-auto"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="font-black">C</span>artify
          </span>
        </Link>

        {/* Desktop nav links — only visible at xl+, sits between logo and actions */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1 sm:gap-2 xl:justify-self-auto">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger
              render={<Button variant="ghost" size="icon" aria-label="Search" />}
            >
              <Search className="size-5" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 sm:w-80">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearchSubmit(searchQuery, () => {
                    setSearchOpen(false)
                    setSearchQuery("")
                  })
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            nativeButton={false}
            render={<Link to="/wishlist" aria-label="Wishlist" />}
          >
            <Heart className="size-5" />
            {count > 0 && (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                {count}
              </Badge>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            nativeButton={false}
            render={<Link to="/cart" aria-label="Cart" />}
          >
            <ShoppingCart className="size-5" />
            {numOfCartItems > 0 && (
              <Badge className="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-[10px]">
                {numOfCartItems}
              </Badge>
            )}
          </Button>
<ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<Link to={user ? "/profile" : "/login"} aria-label="Account" />}
          >
            <User className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
import { Link } from "react-router-dom"
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons"
import { Mail, MapPin, Phone } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const shopLinks = [
  { label: "All Products", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Brands", to: "/brands" },
  { label: "Wishlist", to: "/wishlist" },
]

const supportLinks = [
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/faq" },
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Track Order", to: "/track-order" },
]

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
]

const socialLinks = [
  { icon: SiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: SiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: SiX, href: "https://twitter.com", label: "Twitter" },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                Cart<span className="text-primary">ify</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Everything you need, delivered fast. Quality products, honest prices.
            </p>

            <div className="mt-2 flex flex-col gap-2">
              <p className="text-sm font-medium">Subscribe to our newsletter</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-56"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Shop</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <a
                href="mailto:support@cartify.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4 shrink-0" />
                support@cartify.com
              </a>

              <a
                href="tel:+201234567890"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" />
                +20 123 456 7890
              </a>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                Cairo, Egypt
              </div>
            </div>

          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cartify. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
  <a
    key={social.label}
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={social.label}
    className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
  >
    <social.icon size={16} />
  </a>
))}
          </div>
        </div>
      </div>
    </footer>
  )
}
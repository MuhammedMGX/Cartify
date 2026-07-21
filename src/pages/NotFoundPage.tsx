
import { Link } from "react-router-dom"
import { ArrowLeft, Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <span
        className="text-[7rem] font-medium leading-none tracking-tight text-muted-foreground/30 sm:text-[9rem]"
        style={{
          fontFamily: "'Fraunces Variable', serif",
          fontOpticalSizing: "auto",
        }}
      >
        404
      </span>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        This page took a wrong turn
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        The page you're looking for doesn't exist, moved, or the link is broken.
        Let's get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link to="/" />}>
          <Home className="size-4" />
          Back to home
        </Button>
        <Button variant="outline" render={<Link to="/products" />}>
          <Search className="size-4" />
          Browse products
        </Button>
      </div>

      <button
        onClick={() => window.history.back()}
        className="mt-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Go back
      </button>
    </div>
  )
}
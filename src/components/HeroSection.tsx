import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/features/Explore/hooks"
import { useProducts } from "@/features/Products/hooks"

export function HeroSection() {
  const { data: categories } = useCategories()
  const { data: products } = useProducts()

  // Real top-rated products drive the hero imagery — no stock photos
  const heroProducts = [...(products ?? [])]
    .sort((a, b) => b.ratingsAverage - a.ratingsAverage)
    .slice(0, 3)

  const categoryNames = categories?.map((c) => c.name) ?? []
  // Repeat the list so the marquee loops seamlessly
  const marqueeItems = [...categoryNames, ...categoryNames]

  return (
    <section className="relative overflow-hidden border-b">

      <svg
    viewBox="0 0 1400 700"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-0 h-full w-full text-foreground/[0.15] dark:text-foreground/[0.22]"
    aria-hidden="true"
  >
    <path
      d="M -100 180
         C 150 80, 350 320, 550 200
         S 950 40, 1150 220
         S 1400 380, 1500 260"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      className="animate-[wave-drift_16s_ease-in-out_infinite]"
    />
    <path
      d="M -100 420
         C 200 340, 400 560, 650 460
         S 1000 300, 1250 480
         S 1450 600, 1550 500"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="1 14"
      strokeLinecap="round"
      fill="none"
      className="animate-[wave-drift_20s_ease-in-out_infinite_reverse]"
    />
    <path
      d="M -100 550
         C 100 500, 300 650, 500 580
         S 850 460, 1050 600"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      className="animate-[wave-drift_24s_ease-in-out_infinite]"
    />
  </svg>

  <svg
    viewBox="0 0 400 480"
    fill="none"
    className="pointer-events-none absolute -inset-16 z-0 text-foreground/[0.07] dark:text-foreground/[0.12]"
    aria-hidden="true"
  >
    <path
      d="M -20 60
         C 60 10, 140 130, 220 70
         S 380 20, 420 110
         S 340 260, 260 220
         S 100 160, 60 280
         S 140 420, 40 460
         S -40 380, -20 460"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="animate-[wave-drift_18s_ease-in-out_infinite]"
    />
    <path
      d="M 380 -20
         C 320 60, 400 140, 340 200
         S 220 260, 280 340
         S 420 400, 380 480"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="animate-[wave-drift_22s_ease-in-out_infinite_reverse]"
    />
  </svg>

  
      {/* Category marquee */}
      {categoryNames.length > 0 && (
        <div className="relative flex overflow-hidden border-b bg-muted/90 py-2">
          <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
            {marqueeItems.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                {name}
                <span className="text-border">•</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center px-4 py-16 sm:px-6 md:grid-cols-2 lg:py-24 lg:px-8">
        {/* Left — headline */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-center sm:text-left">
          <h1
            className="text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl lg:text-7xl"
            style={{
                fontFamily: "'Fraunces Variable', serif",
                fontOpticalSizing: "auto", 
                fontVariationSettings: "'SOFT' 40, 'WONK' 1",
            }}
            >
            Everything you need.
            <br />
            <span className="italic text-muted-foreground">Nothing you don't.</span>
          </h1>

          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            Fashion, electronics, home — one catalog, fast checkout, and free
            delivery on orders over £350.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <Button size="lg" nativeButton={false} render={<Link to="/products" />}>
              Shop all products
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link to="/categories" />}>
              Browse categories
            </Button>
          </div>
        </div>

        {/* Right — product image collage, built from real top-rated items */}
        <div className="relative mx-auto hidden h-[420px] w-full max-w-md sm:block lg:h-[480px]">

          
          {heroProducts[0] && (
        <div className="-rotate-3 absolute left-0 top-4 h-[70%] w-[62%] overflow-hidden rounded-2xl border shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-100 ">
            <img
            src={heroProducts[0].imageCover}
            alt={heroProducts[0].title}
            className="h-full w-full object-cover"
            loading="eager"      
            fetchPriority="high"  
            />
        </div>
        )}
        {heroProducts[1] && (
        <div className="rotate-5 absolute right-0 top-0 h-[52%] w-[46%] overflow-hidden rounded-2xl border shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-200 "> 
            <img src={heroProducts[1].imageCover} alt={heroProducts[1].title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        )}
        {heroProducts[2] && (
        <div className="rotate-1 border-none absolute bottom-0 right-10 h-[46%] w-[52%] overflow-hidden rounded-2xl border bg-card shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-300 "> 
            <img src={heroProducts[2].imageCover} alt={heroProducts[2].title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        )}
        </div>
      </div>
    </section>
  )
}
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/features/Products/ProductGrid";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
const shown = useRef(false);

useEffect(() => {
  if (shown.current) return;

  if (location.state?.success) {
    shown.current = true;
    toast.success(location.state.success);

    navigate(location.pathname, {
      replace: true,
      state: {},
    });
  }
}, [location.state, location.pathname, navigate]);

  return (
    <>
    <HeroSection />
    <ProductGrid />
    </>
  )
}

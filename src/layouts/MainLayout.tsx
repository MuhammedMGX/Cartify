import {Footer} from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { RouteTitle } from "@/components/RouteTitle";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
    <div className="flex min-h-screen flex-col">
      <RouteTitle />
      <Navbar />
      <main className="min-h-screen">
          <Outlet />
      </main>
      <Footer/>
    </div>
    </>
  )
}

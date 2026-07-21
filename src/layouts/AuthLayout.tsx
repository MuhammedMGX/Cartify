import { RouteTitle } from "@/components/RouteTitle";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
    <RouteTitle />
    <main className="min-h-screen flex items-center justify-center">
      <Outlet />
    </main></>
  )
}

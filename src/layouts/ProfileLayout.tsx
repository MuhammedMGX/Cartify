import { Outlet, useLocation, Link } from "react-router-dom"
import { AppSidebar } from "@/features/Profile/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const labelMap: Record<string, string> = {
  profile: "Profile",
  orders: "Orders",
  addresses: "Addresses",
  settings: "Settings",
  helpcenter: "Help Center",
  faq: "FAQ",
}

export default function ProfileLayout() {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  return (

    <SidebarProvider style={{ minHeight: 0 }} >
      <AppSidebar style={{
          position: "sticky",
          top: "4rem",
          bottom: "auto",
          height: "calc(100dvh - 4rem)",
          backgroundColor: "red",
        }}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink render={<Link to="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              {segments.map((segment, index) => {
                const path = "/" + segments.slice(0, index + 1).join("/")
                const isLast = index === segments.length - 1
                const label = labelMap[segment] ?? segment

                return (
                  <span key={path} className="contents">
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link to={path} />}>{label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


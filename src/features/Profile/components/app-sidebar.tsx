import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { User, Package, MapPin, Settings, LogOut, HelpCircle, LifeBuoy } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/Auth/AuthContext"
import  {Separator}  from "@/components/ui/separator"

// CHANGED: replaced docs sample data with your actual Profile section links
const data = {
  navMain: [
    {
      title: "My Account",
      items: [
        { title: "Profile", url: "/profile", icon: User },
        { title: "Orders", url: "/profile/allorders", icon: Package },
        { title: "Addresses", url: "/profile/addresses", icon: MapPin },
        { title: "Settings", url: "/profile/settings", icon: Settings },
      ],
      
    },

    {
      title: "Support",
      items: [
        { title: "Help Center", url: "/profile/helpcenter", icon: LifeBuoy },
        { title: "FAQ", url: "/profile/faq", icon: HelpCircle },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <Sidebar {...props} className="border-none">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 pt-4 ">
          <span className="text-lg font-bold tracking-tight">
            Cart<span className="text-primary">ify</span>
          </span>
        </div>
        
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                 {item.items.map((link) => {
                  const isActive = location.pathname === link.url
                  return (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton
                        isActive={isActive} 
                        render={<NavLink to={link.url} />}
                      >
                        <link.icon />
                        <span>{link.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}

              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}


        <Separator className="my-2" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

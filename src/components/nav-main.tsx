import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "react-router-dom"

type User = {
  role: string;
} | null | undefined;


export function NavMain({
  items,
  user,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[];
   user: User
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items
            .filter((item) => {
              // If the item is the admin dashboard, check the user's role
              if (item.url === "/admin") {
                return user?.role === 'admin';
              }
              // Otherwise, always show the item
              return true;
            })
            .map((item) => (
              <NavLink to={item.url} key={item.title} end={item.url === "/"}>

                {({ isActive }) => (
                  <SidebarMenuItem key={item.title} className={isActive ? "bg-green-400 rounded-md text-white font-semibold" : ""}>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </NavLink >
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

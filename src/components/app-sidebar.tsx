import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  Wallet2Icon,
  Crown,
  UserCircleIcon,
  TicketMinus,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Payment from "@/pages/Payment"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Admin Dashboard",
      url: "/admin",
      icon: Crown,
    },
    {
      title: "Account",
      url: "/profile",
      icon: UserCircleIcon,
    },
    {
      title: "Billing",
      url: "/payment",
      icon: Wallet2Icon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { user, logout, isAuthenticated } = useAuth();  

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={'/'}>
                <TicketMinus className='text-green-500 w-5 h-5' />
                <span className="text-base font-semibold">Service Desk</span>
              </Link>
            </SidebarMenuButton>
               <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} user={user} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout}/>
      </SidebarFooter>
    </Sidebar>
  )
}

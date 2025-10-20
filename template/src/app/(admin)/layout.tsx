"use client"

import { BaseSidebar } from "@/components/base-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUserData } from "@/lib/hooks/fetchData"
import { Home, User, ChartNoAxesCombined, Logs } from "lucide-react"
import { SidebarLinkProps } from "@/components/base-sidebar"
import { useEffect } from "react"

const items: SidebarLinkProps[] = [
  {link: "/admin", icon: Home, title: "Home"},
  {link: "/admin/users", icon: User, title: "Users"},
  {link: "/admin/stats", icon: ChartNoAxesCombined, title: "Stats"},
  {link: "/admin/logs", icon: Logs, title: "Logs"},
]

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const userData = useUserData()

  return (
    <SidebarProvider>
      <BaseSidebar user={userData} items={items}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div>
              
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

"use client"

import { BaseSidebar } from "@/components/base-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUserData } from "@/lib/hooks/fetchData"
import { Folder, Home, MessageCircle } from "lucide-react"
import { SidebarLinkProps } from "@/components/base-sidebar"
import { ModeToggle } from "@/components/theme-provider"

const items: SidebarLinkProps[] = [
  {link: "/dashboard", icon: Home, title: "Dashboard"},
  {link: "/dashboard/projects", icon: Folder, title: "Projects"},
  {link: "/dashboard/annotations", icon: MessageCircle, title: "Annotations"},
]

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const userData = useUserData()

  return (
    <SidebarProvider>
      <BaseSidebar items={items} user={userData}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">
                Dashboard
              </h1>
              <span className="text-sm text-muted-foreground">
                Welcome back, {userData?.user?.name || 'User'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Home, User, LucideIcon, ChartNoAxesCombined, Logs} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NavUser } from "./nav-user"
import { UserData } from "@/hooks/use-user-data"

export interface SidebarLinkProps {
  link: string
  icon: LucideIcon
  title: string
}

const examples: SidebarLinkProps[] = [
  {link: "/admin", icon: Home, title: "Home"},
  {link: "/admin/users", icon: User, title: "User" },
  {link: "/admin/stats", icon: ChartNoAxesCombined, title: "Stats" },
  {link: "/admin/logs", icon: Logs, title: "Logs" },
]

type BaseSidebarProps = React.ComponentProps<typeof Sidebar> & {
  items?: SidebarLinkProps[]
  user: UserData
}

export function BaseSidebar({user, items, ...props}: BaseSidebarProps) {
  const { open } = useSidebar();
  const router = useRouter()
  const pathname = usePathname()

  if (!user) return null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
          <Link href="/" className="flex gap-2 items-center">
            <Home size={20}/>
            {open ? <div className="font-bold">YourApp</div> : ""}
          </Link>
      </SidebarHeader>
      <div className="border-b mb-10"/>
      <SidebarContent>
        <SidebarMenu >
          <div className={`flex flex-col gap-2 w-full ${open ? "" : "items-center"}`}>
            {items?.map((item) => {
              const isActive = pathname === item.link
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.title}>
                  {open ? (
                    <SidebarMenuButton asChild>
                      <Link href={item.link} className={`flex gap-4 items-center ${pathname === item.link ? "bg-muted" : ""}`}>
                        <item.icon size={20}/>
                        <div className={`font-bold text-lg`}>{item.title}</div>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => router.push(item.link)}
                          className={`p-2 rounded ${isActive ? "bg-muted" : ""}`}
                        >
                          <Icon size={20} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="center">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </SidebarMenuItem>
              )
          })}
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.user?.name ?? "Guest",
            email: user.user?.email ?? "",
            image: user.user?.image ?? "/avatar.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
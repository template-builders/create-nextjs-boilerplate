"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme-provider"
import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const session = authClient.useSession()
  const router = useRouter()

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out of current session")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign out")
        }
      }
    })
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CoverCraft</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex gap-4">
          <ModeToggle />
          
            {session.data && session.data.user
            ?
              <div className="flex gap-4">
                <Link href="/profile">
                  <Button variant="outline" className="hidden md:inline-flex bg-transparent">
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" className="hidden md:inline-flex bg-transparent" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            :
              <div className="flex gap-4">
                <Link href="/signin">
                  <Button variant="outline" className="hidden md:inline-flex bg-transparent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="hidden md:inline-flex bg-transparent">
                    Sign Up
                  </Button>
                </Link>
              </div>
            }
        </div>
      </div>
    </header>
  )
}
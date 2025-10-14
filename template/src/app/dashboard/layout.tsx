"use client"

import { protectPage } from "@/lib/auth-client"
import { useEffect } from "react"
import { useUserData } from "../profile/fetchData"
import { LoadingScreen } from "@/components"

export default function DashboardLayout({ children }: { children: React.ReactNode }) { 
  const userData = useUserData()

  useEffect(() => {
    protectPage()
  }, [])

  if (userData.isLoading) return <LoadingScreen />


  return (
    <div>
      {children}
    </div>
  )
}
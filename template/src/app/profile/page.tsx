"use client"
import { useUserData, UserData } from "./fetchData"
import { MainDetails } from "./mainDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const userData = useUserData()

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <Tabs defaultValue="details">
          <TabsList className="flex gap-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="details"><MainDetails data={userData}/></TabsContent>
          <TabsContent value="security">Change your password here.</TabsContent>
        </Tabs>
        
      </div>
    </div>
  )
}
export interface TabsComponentProps {
  data: UserData
}


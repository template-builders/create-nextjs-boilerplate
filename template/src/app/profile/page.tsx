"use client"
import { useUserData, UserData } from "./fetchData"
import { MainDetails } from "./mainDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { User, Settings, Shield, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ProfilePage() {
  const userData = useUserData()
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <motion.div 
        className="max-w-4xl mx-auto space-y-8 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <User className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              onClick={logout}
              className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger 
                value="details" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Account Details
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <TabsContent value="details" className="mt-6">
                <MainDetails data={userData}/>
              </TabsContent>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <TabsContent value="security" className="mt-6">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Security Settings</h3>
                    <p className="text-muted-foreground">
                      Advanced security options will be available here. Manage your password, two-factor authentication, and more.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

export interface TabsComponentProps {
  data: UserData
}


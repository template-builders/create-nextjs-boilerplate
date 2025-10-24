import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faMobileScreenButton, faTabletScreenButton, faComputer, faTv, faKey } from "@fortawesome/free-solid-svg-icons"
import { PasskeyForm } from "./forms/passkeyForm"
import { authClient } from "@/lib/auth-client"
import { TabsComponentProps } from "./page"
import { PasswordForm } from "./forms/passwordForm"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { User, Monitor, Smartphone, Tablet, Key, Link as LinkIcon, Unlink } from "lucide-react"

function formatTimeElapsed(createdAt: Date): string {
  const seconds = Math.floor((new Date().getTime() - createdAt.getTime()) / 1000)
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60) 
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}

export const MainDetails = ({data}: TabsComponentProps) => {

  const providerList = data.accounts.map((account) => account.providerId)
  const sessions = data.sessions.sort((a, b) => (a.current ? -1 : 0) - (b.current ? -1 : 0))
  const socialsList = [
    {provider: "Google", icon: faGoogle, connected: providerList.includes("google")},
    {provider: "Github", icon: faGithub, connected: providerList.includes("github")},
    {provider: "Discord", icon: faDiscord, connected: providerList.includes("discord")}
  ]

  const sessionIconMap = {Tablet: faTabletScreenButton, Phone: faMobileScreenButton, Desktop: faComputer, Unknown: faTv }

  async function revokeActiveSession(token: string) {
    await authClient.revokeSession({
      token,
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.info("Successfully removed session")
          data.refetch()
        },
        onError: (ctx) => {
          toast.error("Failed to remove session")
        }
      }
    })
  }

  async function linkSocialProvider(provider: string) {
    await authClient.linkSocial({
      provider: provider.toLowerCase(),
      callbackURL: "/profile",
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.info(`Attempting to connect to ${provider}`)
        },
        onError: (ctx) => {
          toast.error("Failed to link account")
        }
      }
    })
  }

  async function unlinkSocialProvider(provider: string) {
    await authClient.unlinkAccount({
      providerId: provider.toLowerCase(),
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.info(`Successfully unlinked account from ${provider}`)
          data.refetch()
        },
        onError: (ctx) => {
          toast.error("Failed to unlink account")
        }
      }
    })
  }

  async function removePasskey(id: string) {
    await authClient.passkey.deletePasskey({
      id,
      fetchOptions: {
        onSuccess: (ctx) => {
          toast.info(`Successfully removed passkey`)
          data.refetch()
        },
        onError: (ctx) => {
          toast.error("Failed to remove passkey")
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
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Desktop': return <Monitor className="w-5 h-5" />
      case 'Phone': return <Smartphone className="w-5 h-5" />
      case 'Tablet': return <Tablet className="w-5 h-5" />
      default: return <Monitor className="w-5 h-5" />
    }
  }

  return (
    <motion.div 
      className="flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your profile details and account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
              </motion.div>
              <motion.div 
                className="space-y-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
              </motion.div>
            </div>

            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" />
            </motion.div>
            
            <div className="flex justify-between gap-4">
              <PasswordForm data={data}/>
              <div className="flex gap-4">
                <Button variant="outline" className="hover:bg-accent/50 transition-all duration-200">Cancel</Button>
                <Button className="hover:bg-primary/90 transition-all duration-200">Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Active Sessions
            </CardTitle>
            <CardDescription>Manage your active login sessions across devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session, index) => (
              <motion.div 
                key={session.token}
                className="flex items-center justify-between p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getDeviceIcon(session.type)}
                  </div>
                  <div>
                    <p className="font-medium">{session.type}, {session.browser}</p>
                    <p className="text-sm text-muted-foreground">{session.current ? "Current Session" : formatTimeElapsed(session.createdAt)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200" 
                  disabled={session.current} 
                  onClick={() => revokeActiveSession(session.token)}
                >
                  {session.current ? "Current" : "Revoke"}
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Passkeys
            </CardTitle>
            <CardDescription>Manage your passkeys for secure, passwordless authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Passkeys [{data.passkeys.length}]</span>
              </div>
              <PasskeyForm data={data}></PasskeyForm>
            </div>
            {data.passkeys.map((passkey, index) => (
              <motion.div 
                key={passkey.id}
                className="flex items-center justify-between p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{passkey.name}</p>
                    <p className="text-sm text-muted-foreground">Added on {passkey.createdAt.toLocaleDateString("en-us", {day: "numeric", month: "long", year: "numeric"})}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200" 
                  onClick={() => removePasskey(passkey.id)}
                >
                  Remove
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Connected Accounts
            </CardTitle>
            <CardDescription>Manage your social sign-in connections and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialsList.map((social, index) => (
              <motion.div 
                key={social.provider}
                className="flex items-center justify-between p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FontAwesomeIcon icon={social.icon} size="lg" className="text-primary"/>
                  </div>
                  <div className="font-bold">{social.provider}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="transition-all duration-200 hover:bg-accent/50"
                  onClick={social.connected ? () => unlinkSocialProvider(social.provider) : () => linkSocialProvider(social.provider)}
                >
                  {social.connected ? (
                    <>
                      <Unlink className="w-4 h-4 mr-2" />
                      Unlink
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Link
                    </>
                  )}
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
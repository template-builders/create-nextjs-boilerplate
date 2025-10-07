import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faMobileScreenButton, faTabletScreenButton, faComputer, faTv, faKey } from "@fortawesome/free-solid-svg-icons"
import { PasskeyForm } from "./passkeyForm"
import { authClient } from "@/lib/auth-client"
import { TabsComponentProps } from "./page"
import { PasswordForm } from "./passwordForm"
import { toast } from "sonner"

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

  return (
    <div className="flex flex-col pt-4 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john.doe@example.com" />
          </div>
          <div className="flex justify-between gap-4">
            <PasswordForm data={data}/>
            <div className="flex gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <div className="flex items-center justify-between p-4 border rounded-lg border-border">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={sessionIconMap[session.type]}/>
                <div>
                  <p className="font-medium">{session.type}, {session.browser}</p>
                  <p className="text-sm text-muted-foreground">{session.current ? "Current Session" : formatTimeElapsed(session.createdAt)}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={session.current} onClick={() => revokeActiveSession(session.token)}>
                Revoke Session
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
          <CardDescription>Manage your passkeys for passwordless authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} />
              <span className="text-sm font-medium">Passkeys [{data.passkeys.length}]</span>
            </div>
            <PasskeyForm data={data}></PasskeyForm>
          </div>
          {data.passkeys.map((passkey) => (
            <div className="flex items-center justify-between p-4 border rounded-lg border-border">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faKey} />
                <div>
                  <p className="font-medium">{passkey.name}</p>
                  <p className="text-sm text-muted-foreground">Added on {passkey.createdAt.toLocaleDateString("en-us", {day: "numeric", month: "long", year: "numeric"})}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removePasskey(passkey.id)}>
                Remove
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your social sign-in connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {socialsList.map((social) => (
          <div className="flex items-center justify-between p-4 border rounded-lg border-border">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={social.icon} size="xl"/>
              <div className="font-bold">{social.provider}</div>
            </div>
            <Button variant="outline" size="sm" onClick={social.connected ? () => unlinkSocialProvider(social.provider) : () => linkSocialProvider(social.provider)}>
              {social.connected ? "Unlink Account" : "Link Account"}
            </Button>
          </div>
        ))}
        </CardContent>
      </Card>
    </div>
  )
}
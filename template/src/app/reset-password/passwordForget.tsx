import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"

export function PasswordForgetForm() {
  const [email, setEmail] = useState<string>("")

  const sendResetLink = async (email: string) => {
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
    })
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-foreground">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="name@example.com"
                className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Reset Link</Button>

          <div className="text-center">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
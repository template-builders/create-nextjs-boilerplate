"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ShieldCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import {
  Form, 
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
  FormControl 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const FormSchema = z.object({
    pin: z.string().min(8, {
      error: "Your one-time password must be 8 characters"
    })
  })

  async function resendOTP() {
    await authClient.twoFactor.sendOtp()
  }

  async function onSubmitOTP(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    await authClient.twoFactor.verifyOtp({
      code: data.pin,
      trustDevice: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("You are now signed in!")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message  || "Incorrect OTP code, please check your code")
          setLoading(false)
        }
      }
    })
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: ""
    }
  })
  return (
    <div className="flex items-center justify-center py-40">
      <div className="flex flex-col gap-6 items-center border-4 border-primary rounded-lg border-blue p-8">
        <ShieldCheck size={100}/>
        <div className="text-3xl font-bold">Authenticate Your Account</div>
        <div className="text-xl text-wrap max-w-200 text-center">
          Protecting your personal information is our top priority. Please confirm your account by entering the authentication code&nbsp;
          sent to your email address
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitOTP)} className="flex flex-col justify-center gap-4">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-4">
                  <FormLabel className="">One-Time Password</FormLabel>
                  <FormControl>
                  <InputOTP maxLength={8} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                  </FormControl>
                  <FormDescription className="text-foreground">Please enter the one-time password sent to your phone.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className={loading ? "bg-muted/60 hover:cursor-not-allowed" : ""}
            >
              {loading ? <Loader className="animate-spin"/> : "Submit"}
            </Button>
            <FormDescription className="text-foreground text-center">Didn't receive the code?</FormDescription>
            <FormDescription 
              className="text-foreground text-center underline font-bold hover:cursor-pointer"
              onClick={resendOTP}
            >
              Resend Code
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
    
  )
}
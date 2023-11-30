"use client"
import * as React from "react"
import { ButtonProps, buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"

const SignInButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={async () => {
          await signIn("keycloak", { callbackUrl: "/dashboard" })
        }}
        {...props}
      />
    )
  }
)

export default SignInButton

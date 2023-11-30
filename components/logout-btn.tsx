"use client"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

export default function LogoutButton({ session }: { session: any }) {
  return (
    <Button
      className="p-0 rounded-full"
      aria-label="User Avatar"
      variant={"ghost"}
      onClick={async () => {
        await signOut({
          callbackUrl:
            "https://auth.bitkraken.no/realms/Futurize/protocol/openid-connect/logout" +
            `?post_logout_redirect_uri=${encodeURIComponent(
              "http://localhost:3000"
            )}&client_id=fe-local`,
        })
      }}
    >
      <Avatar className="w-12 h-12">
        <AvatarFallback className="font-semibold text-lg">
          {session?.user?.name?.[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Button>
  )
}

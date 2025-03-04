import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { auth } from "@/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import SignInButton from "./signin-button"

const font = Montserrat({ weight: "600", subsets: ["latin"] })

export const LandingNavbar = async () => {
  const session = await auth()

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div className="relative h-8 w-8 mr-4">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          LovAgent AI
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        {session ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/dashboard">Kom i gang</Link>
          </Button>
        ) : (
          <SignInButton variant="outline" className="rounded-full">
            Kom i gang
          </SignInButton>
        )}
      </div>
    </nav>
  )
}

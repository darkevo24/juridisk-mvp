"use client"

import Link from "next/link"
import Image from "next/image"
import { Montserrat } from "next/font/google"
import { LayoutDashboard, Search, FileStack, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FreeCounter } from "@/components/free-counter"

const poppins = Montserrat({ weight: "600", subsets: ["latin"] })

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Rettskildesøk",
    icon: Search,
    href: "/search?categories%5BhierarchicalCategories.lvl0%5D%5B0%5D=Rettsavgjørelser",
    color: "text-red-500",
  },
  {
    label: "Interntsøk",
    icon: FileStack,
    href: "/internal",
    color: "text-yellow-300",
  },
  {
    label: "Innstillinger",
    icon: Settings,
    href: "/settings",
  },
]

export const Sidebar = ({
  apiLimitCount = 0,
  isPro = false,
}: {
  apiLimitCount: number
  isPro: boolean
}) => {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.svg" />
          </div>
          <h1 className={cn("text-2xl font-bold", poppins.className)}>
            JuridiskAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                route.href.startsWith(pathname)
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} isPro={isPro} />
    </div>
  )
}

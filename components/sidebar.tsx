"use client"

import Link from "next/link"
import Image from "next/image"
import { Montserrat } from "next/font/google"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  FolderClosed,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"

const poppins = Montserrat({ weight: "600", subsets: ["latin"] })

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    activeMethod: "route",
  },
  {
    label: "Rettskildesøk",
    icon: Search,
    href: "/search",
    color: "text-red-500",
    activeMethod: "route",
  },
  {
    label: "TEK17",
    icon: Search,
    href: "/tek17",
    color: "text-lime-500",
    activeMethod: "route",
  },
  {
    label: "Interntsøk",
    icon: FileStack,
    href: "/internal",
    color: "text-yellow-300",
    activeMethod: "route",
  },
  {
    label: "Filbehandling",
    icon: FolderClosed,
    href: "/files",
    color: "text-fuchsia-500",
    activeMethod: "pathname",
  },
  {
    label: "Innstillinger",
    icon: Settings,
    href: "/settings",
    activeMethod: "route",
  },
]

export const Sidebar = () => {
  const [uiMode, setUIMode] = useState<"standard" | "compact">("standard")
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-col md:inset-y-0 z-80 bg-gray-900">
      <div className="space-y-4 sticky top-0 min-h-screen py-4 flex flex-col bg-[#111827] text-white">
        <div className="px-3 py-2">
          {uiMode === "standard" ? (
            <div className="flex items-center justify-between gap-10 mb-14">
              <Link href="/dashboard" className="flex items-center pl-3">
                <div className="relative h-8 w-8 mr-4">
                  <Image fill alt="Logo" src="/logo.png" />
                </div>
                <h1
                  className={cn(
                    "text-xl font-bold whitespace-nowrap",
                    poppins.className
                  )}
                >
                  LovAgent AI
                </h1>
              </Link>
              <Button
                onClick={() => setUIMode("compact")}
                aria-label="Left Close"
                variant={"ghost"}
                size={"icon"}
              >
                <PanelLeftClose />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setUIMode("standard")}
              aria-label="Right Open"
              variant={"ghost"}
              size={"icon"}
              className="mb-14"
            >
              <PanelRightClose />
            </Button>
          )}
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  route.activeMethod === "route"
                    ? route.href.startsWith(pathname)
                      ? "text-white bg-white/10"
                      : "text-zinc-400"
                    : pathname.startsWith(route.href)
                    ? "text-white bg-white/10"
                    : "text-zinc-400"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon
                    className={cn(
                      `h-5 w-5 ${uiMode === "standard" ? "mr-3" : ""}`,
                      route.color
                    )}
                  />
                  {uiMode === "standard" && route.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  ScanText,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const poppins = Montserrat({ weight: "600", subsets: ["latin"] })

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    activeMethod: "route",
    type: "link",
  },
  {
    label: "Rettskildesøk",
    icon: Search,
    href: "/search",
    color: "text-red-500",
    activeMethod: "route",
    type: "link",
  },
  {
    label: "Plan- og Bygning",
    icon: ScanText,
    color: "text-lime-500",
    type: "menu",
    items: [
      {
        label: "TEK17",
        href: "/tek17",
        activeMethod: "pathname",
      },
    ],
  },
  {
    label: "Interntsøk",
    icon: FileStack,
    href: "/internal",
    color: "text-yellow-300",
    activeMethod: "route",
    type: "link",
  },
  {
    label: "Filbehandling",
    icon: FolderClosed,
    href: "/files",
    color: "text-fuchsia-500",
    activeMethod: "pathname",
    type: "link",
  },
  {
    label: "Innstillinger",
    icon: Settings,
    href: "/settings",
    activeMethod: "route",
    type: "link",
  },
]

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-col md:inset-y-0 z-80 bg-gray-900">
      <div className="space-y-4 sticky min-w-[20rem] top-0 min-h-screen py-4 flex flex-col bg-[#111827] text-white">
        <div className="px-3 py-2">
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
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <>
                {route.type === "link" ? (
                  <Link
                    key={route.href}
                    href={route.href!}
                    className={cn(
                      "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                      route.activeMethod === "route"
                        ? route.href.startsWith(pathname)
                          ? "text-white bg-white/10"
                          : "text-zinc-400"
                        : pathname.startsWith(route.href!)
                        ? "text-white bg-white/10"
                        : "text-zinc-400"
                    )}
                  >
                    <div className="flex items-center flex-1">
                      <route.icon className={cn(`h-5 w-5 mr-3`, route.color)} />
                      {route.label}
                    </div>
                  </Link>
                ) : (
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      className="px-3 border-b-0 text-zinc-400"
                      value="item-1"
                    >
                      <AccordionTrigger>
                        <div className="flex items-center">
                          <route.icon
                            className={cn(`h-5 w-5 mr-3`, route.color)}
                          />
                          {route.label}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {route?.items?.map((link) => (
                          <Link
                            className={cn(
                              "ml-6 text-sm group flex p-3 justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                              link.activeMethod === "route"
                                ? link.href.startsWith(pathname)
                                  ? "text-white bg-white/10"
                                  : "text-zinc-400"
                                : pathname.startsWith(link.href)
                                ? "text-white bg-white/10"
                                : "text-zinc-400"
                            )}
                            key={link.href}
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

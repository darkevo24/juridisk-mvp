"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import routeData from "@/lib/structured_index_and_link.json"
import { Search } from "lucide-react"
import Link from "next/link"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 lg:px-32 py-10">
      <h1
        className="text-3xl font-semibold underline underline-offset-[20px] w-full"
        style={{ textDecorationThickness: "1px" }}
      >
        Byggteknisk forskrift (TEK17) med veiledning
      </h1>
      <div className="flex mt-10 gap-8">
        <div className="flex flex-col gap-6 py-4 bg-gray-100 w-full max-w-sm overflow-y-auto h-screen sticky top-0">
          <h2 className="text-xl px-4">INNHOLD TEK17</h2>
          <div className="px-4">
            <div className="flex w-full items-center bg-white rounded-md">
              <input
                className="flex h-10 w-full bg-background px-3 py-2 text-sm"
                type="search"
                placeholder="Søk i TEK17"
              />
              <Button variant={"ghost"}>
                <Search className="w5 h-5" />
              </Button>
            </div>
          </div>
          <div>
            <Link
              className="font-medium block py-3 border-y px-4 border-gray-500"
              href={"/tek17"}
            >
              Om veiledningen til TEK17
            </Link>
            <Accordion
              type="single"
              collapsible
              className="w-full divide-y divide-gray-500"
            >
              {Object.keys(routeData).map((header: any) => (
                <AccordionItem value={header}>
                  <AccordionTrigger className="px-4 text-start">
                    {header}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col items-start">
                    {/* @ts-ignore */}
                    {Object.keys(routeData[header]).map((subheader) => (
                      <Button
                        className="text-neutral-800 h-auto ml-6 text-base whitespace-break-spaces"
                        variant={"link"}
                        asChild
                        key={subheader}
                      >
                        {/* @ts-ignore */}
                        <Link href={`/tek17${routeData[header][subheader]}`}>
                          {subheader}
                        </Link>
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

// @ts-nocheck
"use client"
import tekdata from "@/lib/tek17.json"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

export default function page({ params }: { params: { id: string[] } }) {
  const outerId = Number(params.id[0])
  const header = Object.keys(tekdata)[outerId - 1] as keyof typeof tekdata
  const subheaders = Object.keys(tekdata[header])
  const currentSubHeader = subheaders.filter((subh) =>
    tekdata[header][subh].url.endsWith([...params.id].splice(1, 2).join("/"))
  )[0] as string
  const content: string = tekdata[header][currentSubHeader]?.content ?? ""
  const currentIndex = subheaders.findIndex((sub) => sub === currentSubHeader)
  const nextDocLink: string =
    currentIndex < subheaders.length - 1
      ? tekdata[header][subheaders[currentIndex + 1]].url
      : outerId === 18 && params.id[1] === "18-2"
      ? ""
      : tekdata[Object.keys(tekdata)[outerId]][
          Object.keys(tekdata[Object.keys(tekdata)[outerId]])[0]
        ].url
  const prevDocLink: string =
    currentIndex > 0
      ? tekdata[header][subheaders[currentIndex - 1]].url
      : outerId === 1 && params.id[1] === "1-1"
      ? "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17"
      : tekdata[Object.keys(tekdata)[outerId - 2]][
          Object.keys(tekdata[Object.keys(tekdata)[outerId - 2]])[
            Object.keys(tekdata[Object.keys(tekdata)[outerId - 2]]).length - 1
          ]
        ].url
  useEffect(() => {
    document.querySelectorAll(".accordion-navigation").forEach((acc) => {
      acc.classList.add("group")
      const content = acc.children[1] as HTMLDivElement
      content.classList.add(
        "group-data-[state=open]:animate-accordion-down",
        "group-data-[state=closed]:animate-accordion-up"
      )
      content.childNodes.forEach((p) => {
        if (!p.textContent) p.remove()
      })
      content.style.setProperty(
        "--radix-accordion-content-height",
        `${content.scrollHeight}px`
      )
      const toggleBtn = acc.children[0] as HTMLAnchorElement
      toggleBtn.href = "javascript:void(0)"
      toggleBtn.addEventListener("click", (e) => {
        e.stopImmediatePropagation()
        const currentState = acc.getAttribute("data-state") ?? "closed"
        acc.setAttribute(
          "data-state",
          currentState === "closed" ? "open" : "closed"
        )
      })
    })
  }, [])
  return (
    <div className="py-4">
      <div className="w-full flex justify-between">
        {prevDocLink && (
          <Link
            href={prevDocLink.replace(
              "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
              "/tek17"
            )}
            className="flex items-center px-3 py-1 border border-blue-800 text-blue-800 font-medium cursor-pointer hover:bg-blue-800 hover:text-primary-foreground transition"
          >
            <ChevronLeft className="mr-1" />
            Forrige
          </Link>
        )}
        {nextDocLink && (
          <Link
            href={nextDocLink.replace(
              "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
              "/tek17"
            )}
            className="flex ml-auto items-center px-3 py-1 border border-blue-800 text-blue-800 font-medium cursor-pointer hover:bg-blue-800 hover:text-primary-foreground transition"
          >
            Neste
            <ChevronRight className="ml-1" />
          </Link>
        )}
      </div>
      <h1 className="text-xl text-blue-800 font-medium mt-6">{header}</h1>
      <h2 className="text-2xl text-blue-800 font-semibold mt-2">
        {currentSubHeader}
      </h2>
      <div
        className="prose group:max-w-[75ch] prose-lg prose-neutral prose-ul:font-medium prose-p:text-neutral-800 prose-p:font-medium prose-ul:w-full prose-li:w-full prose-p:my-4 prose-table:border prose-td:border-x prose-table:border-gray-700 prose-tr:border-gray-700 prose-td:border-gray-700 prose-td:px-4 max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  )
}

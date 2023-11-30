"use client"
import tekdata from "@/lib/tek17.json"
import { useEffect } from "react"

export default function page({ params }: { params: { id: string[] } }) {
  const outerId = Number(params.id[0])
  const header = Object.keys(tekdata)[outerId - 1] as keyof typeof tekdata
  const subheaders = Object.keys(tekdata[header])
  const currentSubHeader = subheaders.filter((subh) =>
    // @ts-ignore
    tekdata[header][subh].url.endsWith(params.id[1])
  )[0] as string
  // @ts-ignore
  const content: string = tekdata[header][currentSubHeader].content

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
        console.log(currentState)
        acc.setAttribute(
          "data-state",
          currentState === "closed" ? "open" : "closed"
        )
      })
    })
  }, [])
  return (
    <div className="py-4">
      <h1 className="text-xl text-blue-800 font-medium">{header}</h1>
      <h2 className="text-2xl text-blue-800 font-semibold mt-2">
        {currentSubHeader}
      </h2>
      <div
        className="prose group:max-w-[75ch] prose-lg prose-neutral prose-ul:font-medium prose-p:text-neutral-800 prose-p:font-medium prose-ul:w-full prose-li:w-full prose-p:my-4"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </div>
  )
}

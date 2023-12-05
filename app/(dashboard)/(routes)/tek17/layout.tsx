"use client"
import "./_styles/index.css"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import routeData from "@/lib/structured_index_and_link.json"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { Search } from "lucide-react"
import Link from "next/link"
import {
  Dispatch,
  SetStateAction,
  useDeferredValue,
  useEffect,
  useState,
} from "react"
import {
  Configure,
  Highlight,
  Snippet,
  useHits,
  useSearchBox,
} from "react-instantsearch"
import { InstantSearchNext } from "react-instantsearch-nextjs"

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILISEARCH_URL || "",
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
)

export default function layout({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState("")
  const deferredValue = useDeferredValue(value)

  return (
    <InstantSearchNext
      indexName="tek17"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <Configure attributesToSnippet={["text_content:60"]} />
      <div className="px-4 lg:px-20 py-10">
        <h1
          className="text-3xl font-semibold underline underline-offset-[20px] w-full"
          style={{ textDecorationThickness: "1px" }}
        >
          Byggteknisk forskrift (TEK17) med veiledning
        </h1>
        <div className="flex mt-10 gap-8">
          <div className="flex flex-col gap-6 py-4 shrink-0 bg-gray-100 w-full max-w-sm overflow-y-auto h-screen sticky top-0">
            <h2 className="text-xl px-4">INNHOLD TEK17</h2>
            <SearchInput
              value={value}
              deferredValue={deferredValue}
              setValue={setValue}
            />
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
                  <AccordionItem key={header} value={header}>
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
                          onClick={() => setValue("")}
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
          {!!value.length ? <Hits setValue={setValue} /> : children}
        </div>
      </div>
    </InstantSearchNext>
  )
}

function SearchInput({
  deferredValue,
  setValue,
  value,
}: {
  deferredValue: string
  setValue: Dispatch<SetStateAction<string>>
  value: string
}) {
  const { refine, clear } = useSearchBox()

  useEffect(() => {
    if (!!deferredValue) refine(deferredValue)
    else clear()
  }, [deferredValue])
  return (
    <div className="px-4">
      <div className="flex w-full items-center bg-white rounded-md">
        <input
          className="flex h-10 w-full bg-background px-3 py-2 text-sm"
          type="search"
          placeholder="Søk i TEK17"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={512}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button variant={"ghost"}>
          <Search className="w5 h-5" />
        </Button>
      </div>
    </div>
  )
}

interface HitType {
  [key: string]: string
}

function Hits({ setValue }: { setValue: Dispatch<SetStateAction<string>> }) {
  const { hits } = useHits<HitType>()
  console.log(hits[0])
  return (
    <div className="py-4 flex flex-col gap-3">
      {hits.map((hit, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 border-b border-blue-800 py-2"
        >
          <Highlight className="text-lg" hit={hit} attribute={"chapter"} />
          <Link
            href={hit.url.replace(
              "https://www.dibk.no/regelverk/byggteknisk-forskrift-tek17",
              "/tek17"
            )}
            onClick={() => setValue("")}
          >
            <Highlight
              className="text-2xl font-semibold underline underline-offset-2 hover:no-underline"
              hit={hit}
              attribute={"sub_chapter"}
            />
          </Link>
          <Snippet
            className="text-lg font-medium max-w-full"
            hit={hit}
            attribute="text_content"
          />
        </div>
      ))}
    </div>
  )
}

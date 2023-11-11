"use client"
import React, { useTransition, useState, useEffect } from "react"
import {
  SearchBox,
  Highlight,
  Configure,
  Pagination,
  useHits,
  useInstantSearch,
} from "react-instantsearch"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { Button } from "@/components/ui/button"
import { File, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

interface HitType {
  [key: string]: any
}

const InternalClient = ({ userEmail }: { userEmail: string }) => {
  const [indexExists, setIndexExists] = useState<boolean>(false)
  const [activeHit, setActiveHit] = useState<HitType | null>(null)
  const searchClient = instantMeiliSearch(
    "http://localhost:7700",
    "KfL0tPu0lkYgFXs8mphBZWu6_-n9dyAJ7nyKKgo5FYU"
  )

  useEffect(() => {
    async function checkIndex() {
      try {
        const response = await fetch(
          "http://localhost:8000/check_meilisearch_index_exists",
          { method: "GET" }
        )
        const data = await response.json()
        if (data && data.status === "success") {
          setIndexExists(true)
        }
      } catch (error) {
        console.error("Error checking MeiliSearch index:", error)
      }
    }
    checkIndex()
  }, [])

  return (
    <div className="flex flex-row w-full gap-8 h-full">
      <div className="flex-1 flex flex-col">
        {indexExists && (
          <InstantSearchNext
            indexName="documents"
            searchClient={searchClient}
            future={{
              preserveSharedStateOnUnmount: true,
            }}
          >
            <Configure
              hitsPerPage={5}
              attributesToSnippet={["content:50"]}
              filters={`author = '${userEmail}'`}
            />
            <div className="flex flex-col mt-4 flex-1 overflow-auto pl-4">
              <Hits setActiveHit={setActiveHit} />
            </div>
          </InstantSearchNext>
        )}
      </div>
      {activeHit && (
        <SidePanel
          userEmail={userEmail}
          activeHit={activeHit}
          setActiveHit={setActiveHit}
        />
      )}
    </div>
  )
}

function Hits({ setActiveHit }: { setActiveHit: (hit: HitType) => void }) {
  const { hits } = useHits()
  const { status } = useInstantSearch()
  hits.sort(function (a, b) {
    const t1 = a.timestamp as number
    const t2 = b.timestamp as number
    return t2 - t1
  })
  return (
    <>
      {hits.length !== 0 ? (
        <>
          <SearchBox
            placeholder="Skriv søkeord her..."
            classNames={{
              root: "mb-4",
              input: "!py-4 !px-12",
              submit: "!left-5 !z-0",
              reset: "!right-5",
            }}
          />
          <div className="space-y-2 flex-1 pb-4">
            {status === "loading" || status === "stalled" ? (
              <div className="flex space-x-4 h-full items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-current animate-spin"></div>
              </div>
            ) : (
              <>
                {hits.map((hit, index) => (
                  <Hit setActiveHit={setActiveHit} hit={hit} key={index} />
                ))}
              </>
            )}
          </div>
          <Pagination
            showLast={false}
            className="navigation-container fixed bottom-0 p-8 left-1/2 mx-auto w-fit"
          />
        </>
      ) : (
        <p className="text-lg">
          Ingen opplastinger ennå. Gå til{" "}
          <Button className="px-0 text-base" asChild variant={"link"}>
            <Link href={"/files"}>filbehandling</Link>
          </Button>
          , last opp et dokument for å sette i gang med internsøk.
        </p>
      )}
    </>
  )
}

function SidePanel({
  activeHit,
  setActiveHit,
  userEmail,
}: {
  activeHit: HitType
  setActiveHit: (hit: HitType | null) => void
  userEmail: string
}) {
  const [deletePending, startDeleteTransition] = useTransition()

  return (
    <div className="flex-1 relative rounded-lg space-y-5 bg-neutral-100 overflow-auto">
      <div className="flex gap-4 w-full justify-end sticky bg-neutral-100 top-0 py-4 px-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <File className="w-5 h-5" />
              <span className="ml-2">Open PDF</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-7xl max-h-[80%] h-full">
            <DialogTitle>{activeHit.title}</DialogTitle>
            <div className="h-80 w-full flex justify-center items-center">
              <object
                data={`/api/getpdf?author=${activeHit.author}&title=${activeHit.title}`}
                width="100%"
                height="600px"
                style={{
                  maxHeight: "600px",
                }}
              >
                <p>Unable to display PDF file.</p>
              </object>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => setActiveHit(null)}
          variant={"outline"}
          size={"icon"}
          aria-label="Close"
        >
          <X />
        </Button>
      </div>
      <div className="px-8">
        <span className="flex gap-2 items-center">
          <h2 className="font-medium text-2xl lg:text-3xl">
            {activeHit.title}
          </h2>
        </span>
      </div>
      <div className="px-8 pb-12">
        <p className="mt-4">{activeHit.content}</p>
      </div>
    </div>
  )
}

function Hit({
  hit,
  setActiveHit,
}: {
  hit: any
  setActiveHit: (hit: HitType) => void
}) {
  return (
    <button
      onClick={() => setActiveHit(hit)}
      className="p-8 text-left w-full flex flex-col gap-y-2 rounded-lg bg-neutral-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition space-y-2"
    >
      <div className="flex justify-between items-center w-full">
        <Highlight
          classNames={{
            nonHighlighted: "!text-neutral-900 !text-lg !font-semibold",
            highlighted: "!bg-[#bba1ff]",
          }}
          hit={hit}
          attribute={"title"}
        />
      </div>
      <Highlight
        classNames={{
          nonHighlighted: "!text-sm text-secondary-foreground",
          highlighted: "!bg-[#bba1ff]",
        }}
        hit={hit}
        attribute={"content"}
      />
    </button>
  )
}

export default InternalClient

"use client"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import {
  SearchBox,
  Configure,
  Pagination,
  Highlight,
  useHits,
  useClearRefinements,
  RefinementList,
} from "react-instantsearch"
import { Search, X } from "lucide-react"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { useState } from "react"
import { MonthRangePicker } from "@semcore/ui/date-picker"
import { Button } from "@/components/ui/button"
// import { history } from "instantsearch.js/es/lib/routers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Combobox from "@/components/multiple-select-combobox"

/**
 * Using Meilisearch and Algolia InstantSearch components.
 * @see {@link https://www.meilisearch.com/docs/learn/what_is_meilisearch/overview}
 * @see {@link https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react}
 */

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILISEARCH_URL || "",
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
)

interface HitType {
  [key: string]: any
}

// const indexName = "all_data"

export default function ClientSearch() {
  const [date, setDate] = useState<Date[] | undefined[]>([])

  return (
    <InstantSearchNext
      // routing={{
      //   // @ts-ignore
      //   router: history(),
      //   stateMapping: {
      //     // @ts-ignore
      //     stateToRoute(uiState) {
      //       const indexUiState = uiState[indexName]
      //       return {
      //         q: indexUiState.query,
      //         categories: indexUiState.hierarchicalMenu,
      //         page: indexUiState.page,
      //       }
      //     },
      //     // @ts-ignore
      //     routeToState(routeState) {
      //       return {
      //         [indexName]: {
      //           query: routeState.q,
      //           hierarchicalMenu: routeState.categories,
      //           page: routeState.page,
      //         },
      //       }
      //     },
      //   },
      // }}
      indexName="court"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="space-y-4 mt-4 h-full">
        <Configure
          hitsPerPage={5}
          attributesToSnippet={["summary:30"]}
          filters={
            date[0] && date[1]
              ? `timestamp_unix ${Date.parse(date[0].toString()) / 1000} TO ${
                  Date.parse(date[1].toString()) / 1000
                }`
              : undefined
          }
        />
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="flex flex-col mt-4 max-w-xs w-full">
            <ClearFilters dateFilter={date} setDateFilter={setDate} />
            <h3 className="font-semibold pt-4">Datointervall:</h3>
            <MonthRangePicker
              value={date as any}
              onChange={(sdate) => {
                if (sdate[1]) {
                  const newD = new Date(
                    sdate[1].getFullYear(),
                    sdate[1].getMonth() + 1,
                    0
                  )
                  setDate([sdate[0], newD])
                } else {
                  setDate(sdate)
                }
              }}
            >
              <MonthRangePicker.Trigger />
              <MonthRangePicker.Popper />
            </MonthRangePicker>
            <h3 className="font-semibold pt-4">Kategori:</h3>
            <Combobox
              fieldName="Kategori"
              attribute="category"
              limit={1000000}
            />
            <h3 className="font-semibold pt-4">Underkategori:</h3>
            <Combobox
              fieldName="Underkategori"
              attribute="sub_category"
              limit={1000000}
            />
            <h3 className="font-semibold pt-4">Lovhenvisning:</h3>
            <Combobox
              fieldName="Lovhenvisning"
              attribute="law_reference"
              limit={1000000}
            />
            <h3 className="font-semibold pt-4">Juridisk kategori:</h3>
            <Combobox
              fieldName="Juridisk kategori"
              attribute="legal_category"
              limit={1000000}
            />
            <h3 className="font-semibold pt-4">Type:</h3>
            <Combobox fieldName="Type" attribute="type" limit={1000000} />
          </div>
          <div className="flex-1 px-4 overflow-auto flex flex-col">
            <SearchBox
              placeholder="Skriv søkeord her..."
              classNames={{
                root: "mb-4",
                input: "!py-4 !px-12",
                submit: "!left-5 !z-0",
                reset: "!right-5",
              }}
            />
            <Hits />
          </div>
        </div>
      </div>
    </InstantSearchNext>
  )
}

function ClearFilters({
  dateFilter,
  setDateFilter,
}: {
  dateFilter: Date[] | undefined[]
  setDateFilter: (dates: Date[] | undefined[]) => void
}) {
  const { canRefine, refine } = useClearRefinements()

  return (
    <Button
      className="w-fit"
      disabled={!canRefine && !dateFilter[0]}
      onClick={() => {
        if (canRefine) {
          refine()
        }
        if (dateFilter[0]) setDateFilter([undefined, undefined])
      }}
    >
      Fjern alle filtere
    </Button>
  )
}

function Hits() {
  const [openTabs, setOpenTabs] = useState<HitType[]>([])
  const [openTabId, setOpenTabId] = useState<null | string>(null)
  const { hits } = useHits<HitType>()
  // const { status } = useInstantSearch()
  return (
    <div className="space-y-2 flex-1">
      <Tabs value={openTabId ?? "search"} className="w-full">
        <TabsList
          className={`${
            openTabs.length ? "inline-flex" : "hidden"
          } overflow-x-auto w-full justify-start hide-scrollbar`}
        >
          <TabsTrigger
            onClick={() => setOpenTabId("search")}
            value="search"
            className="px-6"
          >
            Search <Search className="w-5 h-5 ml-2" />
          </TabsTrigger>
          {openTabs.map((hit, index) => (
            <TabsTrigger
              onClick={() => setOpenTabId(hit.uuid)}
              key={index}
              value={hit.uuid}
            >
              <span className="w-[25ch] text-left truncate">{hit.name}</span>
              <X
                onClick={(e) => {
                  e.stopPropagation()
                  const remainingTabs = openTabs.filter(
                    (tab) => tab.uuid !== hit.uuid
                  )
                  setOpenTabs(remainingTabs)
                  if (hit.uuid === openTabId) setOpenTabId("search")
                }}
                className="h-5 w-5 ml-4"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="search">
          <div className="space-y-2 flex-1 pb-4">
            {/* {status === "loading" || status === "stalled" ? (
                  <div className="flex space-x-4 h-full items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-current animate-spin"></div>
                  </div>
                ) : ( */}
            <>
              {hits.map((hit, index) => (
                <button
                  onClick={() => {
                    if (!openTabs.map((tab) => tab.uuid).includes(hit.uuid)) {
                      setOpenTabs((prev) => [...prev, hit])
                    }
                    setOpenTabId(hit.uuid)
                  }}
                  className="p-8 text-left w-full flex flex-col gap-y-2 rounded-lg bg-neutral-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition space-y-2"
                  key={index}
                >
                  {/* <h2 className="text-neutral-900 text-lg font-semibold">
                    {hit.name}
                  </h2>
                  <p className="text-sm text-secondary-foreground">
                    {hit.summary}
                  </p> */}
                  <Highlight
                    classNames={{
                      nonHighlighted:
                        "!text-neutral-900 !text-lg !font-semibold",
                      highlighted: "!bg-[#bba1ff]",
                    }}
                    hit={hit}
                    attribute={"name"}
                  />
                  <Highlight
                    classNames={{
                      nonHighlighted: "!text-sm text-secondary-foreground",
                      highlighted: "!bg-[#bba1ff]",
                    }}
                    hit={hit}
                    attribute={"summary"}
                  />
                  <div className="flex items-center justify-between text-xs gap-4 text-gray-600 w-full max-w-full">
                    <p className="line-clamp-1">{hit.law_reference}</p>
                    <p className="shrink-0">{hit.date}</p>
                  </div>
                </button>
              ))}
            </>

            {/* )} */}
          </div>
          <div className="flex justify-center mt-4 items-center space-x-4">
            <Pagination
              showLast={false}
              className="navigation-container fixed bottom-0 p-4 bg-neutral-100/20 backdrop-blur-sm rounded-lg font-semibold max-lg:w-full"
            />
          </div>
        </TabsContent>
        {openTabs.map((hit, index) => (
          <TabsContent key={index} value={hit.uuid} className="pb-8">
            {/* <div
              className="prose lg:prose-xl prose-neutral py-8 pl-4"
              dangerouslySetInnerHTML={{ __html: hit.content }}
            ></div> */}
            {/* {hit.content} */}
            <div
              className="prose prose-neutral pl-4"
              dangerouslySetInnerHTML={{
                __html: hit.content,
              }}
            ></div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

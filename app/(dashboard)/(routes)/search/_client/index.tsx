"use client"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import {
  SearchBox,
  Configure,
  Pagination,
  HierarchicalMenu,
  Breadcrumb,
  Highlight,
  useHits,
  useInstantSearch,
  useClearRefinements,
} from "react-instantsearch"
import { X } from "lucide-react"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { useState } from "react"
import { MonthRangePicker } from "@semcore/ui/date-picker"
import { Button } from "@/components/ui/button"
import { history } from "instantsearch.js/es/lib/routers"

const searchClient = instantMeiliSearch(
  process.env.NEXT_PUBLIC_MEILISEARCH_URL || "",
  process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY || ""
)

interface HitType {
  [key: string]: any
}

const indexName = "all_data"

export default function ClientSearch() {
  const [activeHit, setActiveHit] = useState<HitType | null>(null)
  const [date, setDate] = useState<Date[] | undefined[]>([])

  return (
    <InstantSearchNext
      routing={{
        // @ts-ignore
        router: history(),
        stateMapping: {
          // @ts-ignore
          stateToRoute(uiState) {
            const indexUiState = uiState[indexName]
            return {
              q: indexUiState.query,
              categories: indexUiState.hierarchicalMenu,
              page: indexUiState.page,
            }
          },
          // @ts-ignore
          routeToState(routeState) {
            return {
              [indexName]: {
                query: routeState.q,
                hierarchicalMenu: routeState.categories,
                page: routeState.page,
              },
            }
          },
        },
      }}
      indexName="all_data"
      searchClient={searchClient}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
    >
      <div className="space-y-4 mt-4 h-full">
        <Configure
          hitsPerPage={5}
          attributesToSnippet={["Sammendrag:30"]}
          filters={
            date[0] && date[1]
              ? `Timestamp ${Date.parse(date[0].toString()) / 1000} TO ${
                  Date.parse(date[1].toString()) / 1000
                }`
              : undefined
          }
        />
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="flex flex-col mt-4 space-x-4">
            <ClearFilters dateFilter={date} setDateFilter={setDate} />
            <h3 className="font-semibold pt-4">Kategori:</h3>
            <HierarchicalMenu
              attributes={[
                "hierarchicalCategories.lvl0",
                "hierarchicalCategories.lvl1",
              ]}
              sortBy={["count"]}
            />
            <h3 className="font-semibold pt-4">Dato:</h3>
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
            <Breadcrumb
              attributes={[
                "hierarchicalCategories.lvl0",
                "hierarchicalCategories.lvl1",
                "hierarchicalCategories.lvl2",
              ]}
              translations={{
                rootElementText: "",
              }}
            />
            <Hits setActiveHit={setActiveHit} />
          </div>
          {activeHit && (
            <div className="flex-1 relative rounded-lg space-y-3 bg-neutral-100 overflow-auto">
              <div className="flex w-full justify-end sticky top-0 bg-neutral-100 py-4 px-8">
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
                    {activeHit.Publisert}
                  </h2>
                  <p className="max-lg:text-sm">- {activeHit.Dato}</p>
                </span>
                <p className="text-zinc-600 mt-2 lg:text-lg">
                  {activeHit.Instans}
                </p>
                <p className="mt-4">
                  <span className="font-medium">Henvisninger</span> -{" "}
                  <span>{activeHit["Henvisninger i teksten"]}</span>
                </p>
                <p className="mt-4">
                  <span className="font-medium">Forfatter</span> -{" "}
                  <span>{activeHit.Forfatter}</span>
                </p>
                <h2 className="text-lg font-medium mt-4">Sammendrag</h2>
                <p className="mt-2">{activeHit.Sammendrag}</p>
                <p className="mt-4">
                  <span className="font-medium">Saksgang</span> -{" "}
                  <span>{activeHit.Saksgang}</span>
                </p>
                <p className="mt-4">
                  <span className="font-medium">Parter</span> -{" "}
                  <span>{activeHit.Parter}</span>
                </p>
              </div>
              <div className="mt-4 px-8">
                <h2 className="text-2xl font-medium">Full Content</h2>
                <p className="mt-4">{activeHit["Full Content"]}</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-4 items-center space-x-4">
          <Pagination
            showLast={false}
            className="navigation-container fixed bottom-0 p-4 bg-neutral-100/20 backdrop-blur-sm rounded-lg font-semibold max-lg:w-full"
          />
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

function Hits({ setActiveHit }: { setActiveHit: (hit: HitType) => void }) {
  const { hits } = useHits()
  const { status } = useInstantSearch()
  return (
    <div className="space-y-2 flex-1">
      {status === "loading" || status === "stalled" ? (
        <div className="flex space-x-4 h-full items-center justify-center">
          <div className="w-14 h-14 border-[6px] border-gray-200 rounded-full border-t-current animate-spin"></div>
        </div>
      ) : (
        <>
          {hits.map((hit, index) => (
            <Hit hit={hit} setActiveHit={setActiveHit} key={index} />
          ))}
        </>
      )}
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
      <Highlight
        classNames={{
          nonHighlighted: "!text-neutral-900 !text-lg !font-semibold",
          highlighted: "!bg-[#bba1ff]",
        }}
        hit={hit}
        attribute={"Publisert"}
      />
      <Highlight
        classNames={{
          nonHighlighted: "!text-sm text-secondary-foreground",
          highlighted: "!bg-[#bba1ff]",
        }}
        hit={hit}
        attribute={"Sammendrag"}
      />
      <div className="flex items-center justify-between text-xs gap-4 text-gray-600 w-full max-w-full">
        <p className="line-clamp-1">{hit["Henvisninger i teksten"]}</p>
        <p className="shrink-0">{hit.Dato}</p>
      </div>
    </button>
  )
}

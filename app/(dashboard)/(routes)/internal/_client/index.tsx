"use client";
import { useState } from "react";
import {
  SearchBox,
  Highlight,
  Configure,
  Pagination,
  useHits,
  useInstantSearch,
} from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HitType {
  [key: string]: any;
}

const searchClient = instantMeiliSearch(
  "http://localhost:7700",
  "KfL0tPu0lkYgFXs8mphBZWu6_-n9dyAJ7nyKKgo5FYU"
);

const InternalClient = ({ userEmail }: { userEmail: string }) => {
  return (
    <div className="flex flex-row w-full gap-8 h-full">
      <div className="flex-1 flex flex-col">
        {true && (
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
            <div className="flex flex-col mt-4 flex-1 overflow-y-auto px-4">
              <Hits />
            </div>
          </InstantSearchNext>
        )}
      </div>
    </div>
  );
};

function Hits() {
  const [openTabs, setOpenTabs] = useState<HitType[]>([]);
  const [openTabId, setOpenTabId] = useState<null | string>(null);
  const { hits } = useHits();
  const { status } = useInstantSearch();
  hits.sort(function (a, b) {
    const t1 = a.timestamp as number;
    const t2 = b.timestamp as number;
    return t2 - t1;
  });
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
          <Tabs value={openTabId ?? "search"} className="w-full">
            <TabsList className={openTabs.length ? "inline-flex" : "hidden"}>
              <TabsTrigger
                onClick={() => setOpenTabId("search")}
                value="search"
                className="px-6"
              >
                Search <Search className="w-5 h-5 ml-2" />
              </TabsTrigger>
              {openTabs.map((hit, index) => (
                <TabsTrigger
                  onClick={() => setOpenTabId(hit.id)}
                  key={index}
                  value={hit.id}
                >
                  <span className="w-[25ch] text-left truncate">
                    {hit.title}
                  </span>
                  <X
                    onClick={(e) => {
                      e.stopPropagation();
                      const remainingTabs = openTabs.filter(
                        (tab) => tab.id !== hit.id
                      );
                      setOpenTabs(remainingTabs);
                      if (hit.id === openTabId) setOpenTabId("search");
                    }}
                    className="h-5 w-5 ml-4"
                  />
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="search">
              <div className="space-y-2 flex-1 pb-4">
                {status === "loading" || status === "stalled" ? (
                  <div className="flex space-x-4 h-full items-center justify-center">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-current animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {hits.map((hit: any, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!openTabs.map((tab) => tab.id).includes(hit.id)) {
                            setOpenTabs((prev) => [...prev, hit]);
                          }
                          setOpenTabId(hit.id);
                        }}
                        className="p-8 text-left w-full flex flex-col gap-y-2 rounded-lg bg-neutral-100 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition space-y-2"
                      >
                        <div className="flex justify-between items-center w-full">
                          <Highlight
                            classNames={{
                              nonHighlighted:
                                "!text-neutral-900 !text-lg !font-semibold",
                              highlighted: "!bg-[#bba1ff]",
                            }}
                            hit={hit}
                            attribute={"title"}
                          />
                        </div>
                        <Highlight
                          classNames={{
                            nonHighlighted:
                              "!text-sm text-secondary-foreground",
                            highlighted: "!bg-[#bba1ff]",
                          }}
                          hit={hit}
                          attribute={"content"}
                        />
                      </button>
                    ))}
                  </>
                )}
              </div>
              <Pagination
                showLast={false}
                className="navigation-container fixed bottom-0 p-4 left-1/2 mx-auto w-fit z-50 bg-neutral-100/20 backdrop-blur-sm rounded-lg font-semibold max-lg:w-full"
              />
            </TabsContent>
            {openTabs.map((hit, index) => (
              <TabsContent key={index} value={hit.id} className="pb-8">
                <object
                  data={`/api/getpdf?author=${hit.author}&title=${hit.title}`}
                  width="100%"
                  height="700px"
                >
                  <p>Unable to display PDF file.</p>
                </object>
                {/* <p>{hit.content}</p> */}
              </TabsContent>
            ))}
          </Tabs>
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
  );
}

export default InternalClient;

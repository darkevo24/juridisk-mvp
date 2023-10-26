"use client";
import "instantsearch.css/themes/algolia-min.css";
import React from "react";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  Configure,
  Pagination,
  RefinementList,
  ClearRefinements,
  HierarchicalMenu,
  Breadcrumb,
} from "react-instantsearch";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { Heading } from "@/components/heading";
import { Search, ClipboardCopy } from "lucide-react";
import { toast } from "react-hot-toast";
import type { Hit } from "instantsearch.js";

// Move this to the server side
/*
const searchClient = instantMeiliSearch(
  process.env.MEILISEARCH_URL || "",
  process.env.MEILISEARCH_API_KEY || ""
);
*/
const searchClient = instantMeiliSearch(
  "https://ms-d55cb2765348-5626.lon.meilisearch.io",
  "f7ccdbb293f0606a3f0e23d9de6f2f58538854c4ba4e0bffc78b5644aa51e900"
);

const SearchPage = () => {
  return (
    <div>
      <Heading
        title="Rettskildesøk"
        description="Finn de mest relevante rettskildene."
        icon={Search}
        iconColor="text-red-500"
        bgColor="bg-red-500/10"
      />
      <div className="px-4 lg:px-8">
        <InstantSearch indexName="all_data" searchClient={searchClient}>
          <div className="space-y-4 mt-4">
            <Configure hitsPerPage={5} />
            <Configure attributesToSnippet={["Sammendrag:30"]} />
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-1 ">
                <div className="flex flex-col mt-4 space-x-4">
                  <ClearRefinements
                    translations={{
                      resetButtonText: "Fjern alle filtere",
                    }}
                    classNames={{
                      root: "flex justify-center items-center",
                      button:
                        "!inline-flex !items-center !justify-center !rounded-md !text-sm !font-medium !ring-offset-background !transition-colors !focus-visible:outline-none !focus-visible:ring-2 !focus-visible:ring-ring !focus-visible:ring-offset-2 !disabled:pointer-events-none !disabled:opacity-50 !bg-primary !text-primary-foreground !hover:bg-primary/90 !h-10 !px-4 !py-2",
                    }}
                  />
                  <h3 className="font-semibold pt-4">Kategori:</h3>
                  <HierarchicalMenu
                    attributes={[
                      "hierarchicalCategories.lvl0",
                      "hierarchicalCategories.lvl1",
                      "hierarchicalCategories.lvl2",
                    ]}
                    sortBy={["count"]}
                  />
                  <h3 className="font-semibold pt-4">Dato:</h3>
                  <RefinementList attribute="Dato" sortBy={["count"]} />
                </div>
              </div>
              <div className="col-span-5">
                <SearchBox
                  placeholder="Skriv søkeord her..."
                  classNames={{
                    root: "pb-2",
                    input: "!py-6",
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
                <Hits
                  hitComponent={Hit}
                  classNames={{
                    list: "text-black",
                    item: "!w-full !border-none !p-0 ",
                  }}
                />
              </div>
            </div>
            <div className="flex justify-center mt-4 items-center space-x-4 ">
              <Pagination
                showLast={false}
                className="navigation-container fixed bottom-0 p-8 "
              />
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

type HitProps = {
  hit: Hit;
};

function Hit({ hit }: HitProps) {
  return (
    <div className="p-8 w-full flex flex-col gap-y-2 rounded-lg bg-muted">
      <div className="flex items-center justify-between">
        <Highlight
          attribute="Publisert"
          hit={hit}
          classNames={{
            highlighted: "!text-lg font-semibold",
            nonHighlighted: "!text-lg font-semibold",
          }}
        />
      </div>

      <Highlight
        attribute="Sammendrag"
        hit={hit}
        classNames={{
          highlighted: "!text-xs",
          nonHighlighted: "!text-xs",
        }}
      />

      <div className="flex items-center justify-between text-xs text-gray-500">
        <p className="">{hit["Henvisninger i teksten"]}</p>
        <p className="">{hit.Dato}</p>
      </div>
    </div>
  );
}

export default SearchPage;

import "instantsearch.css/themes/algolia-min.css"
import ClientSearch from "./_client"
import { Heading } from "@/components/heading"
import { Search } from "lucide-react"

const SearchPage = () => {
  return (
    <>
      <Heading
        title="Rettskildesøk"
        description="Finn de mest relevante rettskildene."
        icon={Search}
        iconColor="text-red-500"
        bgColor="bg-red-500/10"
      />
      <div className="px-4 lg:px-32 flex-1 max-h-[80%]">
        <ClientSearch />
      </div>
    </>
  )
}

export default SearchPage

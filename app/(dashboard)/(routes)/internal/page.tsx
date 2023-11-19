import "instantsearch.css/themes/algolia-min.css"
import InternalClient from "./_client"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Heading } from "@/components/heading"
import { FileStack } from "lucide-react"

export const runtime = "edge"

export default async function InternalPage() {
  const user = await currentUser()
  if (!user?.emailAddresses) return redirect("/")

  return (
    <>
      <Heading
        title="Interntsøk"
        description="Finn de mest relevante interne dokumentene."
        icon={FileStack}
        iconColor="text-yellow-300"
        bgColor="bg-yellow-300/10"
      />
      <div className="px-4 lg:px-32 mt-8">
        <InternalClient userEmail={user.emailAddresses[0].emailAddress} />
      </div>
    </>
  )
}

import "instantsearch.css/themes/algolia-min.css"
import InternalClient from "./_client"
import { redirect } from "next/navigation"
import { Heading } from "@/components/heading"
import { FileStack } from "lucide-react"
import { auth } from "@/auth"

export default async function InternalPage() {
  const session = await auth()
  if (!session?.user) return redirect("/")

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
        <InternalClient userEmail={session?.user.email!} />
      </div>
    </>
  )
}

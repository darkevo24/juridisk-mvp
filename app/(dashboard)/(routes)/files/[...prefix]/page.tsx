import { getFoldersAndFiles } from "../_actions"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import FilesDataTable from "../_client_table"
import { Button } from "@/components/ui/button"
import { ChevronRight, Folder } from "lucide-react"
import Link from "next/link"
import React from "react"

export default async function FileManagementPage({
  params,
}: {
  params: { prefix: string[] }
}) {
  const session = await auth()
  if (!session?.user) return redirect("/")
  const finalPrefix = `${session.user.email}/${params.prefix.join("/")}`
  const data = await getFoldersAndFiles(finalPrefix)
  return (
    <>
      <div className="flex mb-6 items-center">
        <Button
          asChild
          className="text-neutral-600 font-semibold"
          variant={"link"}
        >
          <Link href={"/files"}>
            <Folder className="w-5 h-5 text-blue-500 mr-2" />
            Files
          </Link>
        </Button>
        {params.prefix.map((prefix, index) => (
          <React.Fragment key={index}>
            {index === params.prefix.length - 1 ? (
              <>
                <ChevronRight className="w-5 h-5" />
                <Button
                  className="text-neutral-800 font-semibold"
                  variant={"ghost"}
                >
                  {prefix}
                </Button>
              </>
            ) : (
              <>
                <ChevronRight className="w-5 h-5" />
                <Button
                  asChild
                  className="text-neutral-600 font-semibold"
                  variant={"link"}
                >
                  <Link
                    href={`/files/${params.prefix
                      .slice(0, index + 1)
                      .join("/")}`}
                  >
                    {prefix}
                  </Link>
                </Button>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
      <FilesDataTable data={data} />
    </>
  )
}

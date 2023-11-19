import { getFoldersAndFiles } from "./_actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import FilesDataTable from "./_client_table"

// export const runtime = "edge"

export default async function FileManagementPage() {
  const user = await currentUser()
  if (!user?.emailAddresses) return redirect("/")
  const data = await getFoldersAndFiles(user.emailAddresses[0].emailAddress)
  return <FilesDataTable data={data} />
}

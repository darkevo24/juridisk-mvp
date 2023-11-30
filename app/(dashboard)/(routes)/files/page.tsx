import { getFoldersAndFiles } from "./_actions"
import { redirect } from "next/navigation"
import FilesDataTable from "./_client_table"
import { auth } from "@/auth"

// export const runtime = "edge"

export default async function FileManagementPage() {
  const session = await auth()
  if (!session) return redirect("/")
  const data = await getFoldersAndFiles(session.user?.email!)
  return <FilesDataTable data={data} />
}

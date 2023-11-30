import { extractRightOfSlash } from "@/lib/utils"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url)
  // const path = searchParams.get("path")
  // if (path && path.includes("/"))
  //   revalidatePath(`/files/${extractRightOfSlash(path)}`)
  // else revalidatePath("/files")
  revalidatePath("/(dashboard)/(routes)/files", "page")
  console.log("reload")
  return Response.json({ revalidated: true, now: Date.now() }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
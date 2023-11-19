import { type NextRequest } from 'next/server'
import { GetObjectCommand } from "@aws-sdk/client-s3"
import client from "@/lib/s3client"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const author = searchParams.get("author")
  const title = searchParams.get("title")
  const command = new GetObjectCommand({
    Bucket: "lovagent-files",
    Key: `${author}/${title}`,
  })
  const response = await client.send(command)
  // @ts-ignore: blob response is working
  return new Response(response.Body)
}
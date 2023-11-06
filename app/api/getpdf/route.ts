import { type NextRequest } from 'next/server'
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const author = searchParams.get("author")
  const title = searchParams.get("title")
  const command = new GetObjectCommand({
    Bucket: "juridiskai-files",
    Key: `${author}/${title}`,
  })
  const response = await client.send(command)
  // @ts-ignore
  return new Response(response.Body)
}
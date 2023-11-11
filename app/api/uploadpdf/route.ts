import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  try {
    const response = await fetch(
      "http://localhost:8000/api/convert_document",
      {
        method: "POST",
        body: formData,
      }
    )
    if (response.ok) {
      const data = await response.json()
      if (data.status === "success") {
        return Response.json(data)
      } else {
        return Response.json(data)
      }
    } else {
      console.error("Error:", await response.text())
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
  return Response.json({ status: "done" })
}
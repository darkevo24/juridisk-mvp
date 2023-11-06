"use server"
import { revalidatePath } from "next/cache"

export async function createDoc(formData: FormData) {
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
        revalidatePath("/internal")
      } else {
        console.error(data.message)
      }
    } else {
      console.error("Error:", await response.text())
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

export async function deleteDoc(doc_id: string, email: string, title: string) {
  const formData = new FormData()
  formData.set("email", email)
  formData.set("title", title)
  try {
    const response = await fetch(
      `http://localhost:8000/delete_doc/${doc_id}`,
      {
        method: "POST",
        body: formData
      }
    )
    if (response.ok) {
      const data = await response.json()
      if (data.status === "success") {
        revalidatePath("/internal")
      } else {
        console.error(data.message)
      }
    } else {
      console.error("Error:", await response.text())
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}
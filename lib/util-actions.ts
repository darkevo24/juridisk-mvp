"use server"

import { revalidatePath } from "next/cache"

export async function refreshPage(path: string) {
  return revalidatePath(path)
}

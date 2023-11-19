"use server"

import { revalidatePath } from "next/cache"

export async function refreshPage(path: string) {
  return revalidatePath(path)
}

/**
 * A utility function to call from client comp to refresh page.
 */
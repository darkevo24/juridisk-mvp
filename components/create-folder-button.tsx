"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FolderPlus } from "lucide-react"
import { createFolder } from "@/app/(dashboard)/(routes)/files/_actions"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CreateFolderButton() {
  const pathname = usePathname()
  const { data: session } = useSession()

  async function getAction(formData: FormData) {
    const folderName = formData.get("foldername") as string
    const basePath = pathname.replace("/files", session?.user?.email ?? "")
    await createFolder(basePath + "/" + folderName, pathname)
  }

  return pathname === "/files" ? (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-transparent font-medium text-neutral-900 hover:bg-neutral-100 rounded-none px-10 py-5 flex items-center">
          <FolderPlus className="w-5 h-5 mr-2" /> Create Folder
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter folder name</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" action={getAction}>
          <Input placeholder="e.g. Imp Docs" name="foldername" />
          <DialogClose asChild>
            <Button type="submit">Create</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  ) : null
}

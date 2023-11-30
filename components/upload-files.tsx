"use client"
import { refreshPage } from "@/lib/util-actions"
import { useSession } from "next-auth/react"
import { Upload } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRef, useTransition } from "react"

const UploadButton = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { data: session } = useSession()

  return (
    <>
      <button
        onClick={() => {
          inputRef.current?.click()
        }}
        className="bg-transparent font-medium text-blue-700 hover:bg-neutral-100 rounded-none px-10 py-5 flex items-center"
      >
        {isPending ? (
          <>
            <div className="w-6 h-6 border-[3px] border-gray-200 rounded-full border-t-current animate-spin"></div>
            <span className="ml-2">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" /> Upload
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            const formData = new FormData()
            for (const file of e.target.files) {
              formData.append("files", file)
            }
            // formData.set("file", e.target.files[0])
            formData.set("email", session?.user?.email ?? "")
            formData.set(
              "file_path",
              pathname.replace("/files", session?.user?.email ?? "")
            )
            startTransition(async () => {
              const res = await fetch("/api/uploadpdf", {
                method: "POST",
                body: formData,
              })
              const resp = await res.json()
              if (resp.status === "success") await refreshPage(pathname)
            })
          }
        }}
      />
    </>
  )
}

export default UploadButton

"use client"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function ReloadPageButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() =>
        startTransition(() => {
          router.refresh()
        })
      }
      className="bg-transparent font-medium text-neutral-900 hover:bg-neutral-100 rounded-none px-10 py-5 flex items-center"
    >
      {isPending ? (
        <>
          <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Reloading...
        </>
      ) : (
        <>
          <RefreshCw className="w-5 h-5 mr-2" /> Reload
        </>
      )}
    </button>
  )
}

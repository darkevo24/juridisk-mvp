import CreateFolderButton from "@/components/create-folder-button"
import { Heading } from "@/components/heading"
import ReloadPageButton from "@/components/reload-page-button"
import UploadButton from "@/components/upload-files"
import { FolderClosed } from "lucide-react"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Heading
        title="Filbehandling"
        description="Utfør filrelaterte operasjoner."
        icon={FolderClosed}
        iconColor="text-fuchsia-500"
        bgColor="bg-fuchsia-500/10"
      />
      <main className="px-8 lg:px-32">
        <div className="divide-x-2 flex items-center mt-12 border-2 w-fit rounded-lg">
          <UploadButton />
          <CreateFolderButton />
          <ReloadPageButton />
        </div>
        <div className="space-y-2 mt-12 flex flex-col">
          <h2 className="text-neutral-900 text-2xl font-semibold mb-4">
            My Files
          </h2>
          {children}
        </div>
      </main>
    </>
  )
}

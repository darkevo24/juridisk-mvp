import { auth } from "@/auth"
import Navbar from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import AuthSessionProvider from "@/lib/session-provider"
import { redirect } from "next/navigation"

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session) redirect("/")
  return (
    <AuthSessionProvider>
      <div className="relative flex">
        <Sidebar />
        <main className="h-full flex flex-col px-24 w-full">
          <Navbar />
          {children}
        </main>
      </div>
    </AuthSessionProvider>
  )
}

export default DashboardLayout

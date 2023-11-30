import { MobileSidebar } from "@/components/mobile-sidebar"
import { auth } from "@/auth"
import LogoutButton from "./logout-btn"

const Navbar = async () => {
  const session = await auth()
  return (
    <div className="flex items-center py-6 px-8 lg:px-32">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <LogoutButton session={session} />
      </div>
    </div>
  )
}

export default Navbar

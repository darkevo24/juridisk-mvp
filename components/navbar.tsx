import { UserButton } from "@clerk/nextjs"
import { MobileSidebar } from "@/components/mobile-sidebar"

const Navbar = async () => {
  return (
    <div className="flex items-center py-6 px-8 lg:px-32">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10",
            },
          }}
          afterSignOutUrl="/"
        />
      </div>
    </div>
  )
}

export default Navbar

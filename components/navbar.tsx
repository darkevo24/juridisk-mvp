import { UserButton } from "@clerk/nextjs"

import { MobileSidebar } from "@/components/mobile-sidebar"
import { getApiLimitCount } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"

const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount()
  const isPro = await checkSubscription()

  return (
    <div className="flex items-center py-6 px-8 lg:px-32">
      <MobileSidebar isPro={isPro} apiLimitCount={apiLimitCount} />
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

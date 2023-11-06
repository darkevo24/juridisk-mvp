import { Settings } from "lucide-react"

import { Heading } from "@/components/heading"
import { SubscriptionButton } from "@/components/subscription-button"
import { checkSubscription } from "@/lib/subscription"

const SettingsPage = async () => {
  const isPro = await checkSubscription()

  return (
    <div>
      <Heading
        title="Innstillinger"
        description="Administrer kontoinnstillinger."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-32 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? "Du har en premiumbruker." : "Du har en gratisbruker."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  )
}

export default SettingsPage

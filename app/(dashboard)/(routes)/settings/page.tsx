import { Settings } from "lucide-react"
import { Heading } from "@/components/heading"

export const runtime = "edge"

const SettingsPage = async () => {
  return (
    <div>
      <Heading
        title="Innstillinger"
        description="Administrer kontoinnstillinger."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-32 space-y-4"></div>
    </div>
  )
}

export default SettingsPage

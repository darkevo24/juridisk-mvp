import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeadingProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor?: string
  bgColor?: string
}

export const Heading = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
}: HeadingProps) => {
  return (
    <>
      <div className="px-8 lg:px-32 flex items-center gap-x-4 mb-4">
        <div className={cn("p-4 w-fit rounded-md", bgColor)}>
          <Icon className={cn("w-6 h-6 lg:w-8 lg:h-8", iconColor)} />
        </div>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </>
  )
}

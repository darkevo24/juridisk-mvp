import { ArrowRight } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { tools } from "@/constants"
import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Juridisk AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Din pålitelige partner for rettskildesøk og juridisk analyse ved hjelp
          av kunstig intelligens.
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 flex flex-col gap-4">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.href}>
            <Card className="p-4 border-black/10 flex items-center justify-between hover:shadow-md transition cursor-pointer">
              <div className="flex items-center gap-x-4">
                <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                  <tool.icon className={cn("w-8 h-8", tool.color)} />
                </div>
                <div className="font-semibold">{tool.label}</div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

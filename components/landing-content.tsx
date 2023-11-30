import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    name: "Intelligent Søk",
    avatar: "🔍",
    title: "Finn Riktig Informasjon, Raskt",
    description:
      "Vår AI-assistent forstår dine søkeintensjoner og hjelper deg med å finne de mest relevante rettskildene raskt og effektivt.",
  },
  {
    name: "Dokument Tilpasning",
    avatar: "📄",
    title: "Skreddersydde Juridiske Dokumenter",
    description:
      "Basert på dine spesifikke behov, kan vår tjeneste skreddersy juridiske dokumenter som passer perfekt for deg.",
  },
  {
    name: "Pålitelig og Trygg",
    avatar: "🛡️",
    title: "Tydelig Sporbarhet",
    description:
      "Alle rettskilder har tydelig sporbarhet, slik at du kan stole på at prosessen er pålitelig, rask, og effektiv.",
  },
]

export const LandingContent = () => {
  return (
    <div className="px-10 pt-24 pb-5">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Kjernefunksjoner
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {features.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-x-2 justify-center">
                <div className="text-center w-full">
                  <span className="text-4xl">{item.avatar}</span>
                  <p className="text-lg mt-2">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

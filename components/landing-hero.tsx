import { auth } from "@/auth"
import SignInButton from "./signin-button"
import { Button } from "./ui/button"
import Link from "next/link"

export const LandingHero = async () => {
  const session = await auth()

  return (
    <div className="flex flex-col justify-center items-center space-y-8 md:space-y-0 pt-36 pb-16">
      {/* Flex container */}
      {/* First section: Current content */}
      <div className="text-white font-bold text-center space-y-5 w-full">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
          <h1>Din nye </h1>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Juridiske Assistent
          </div>
        </div>
        <div className="text-sm md:text-xl font-light text-zinc-400">
          AI-drevet juridisk assistanse med forståelse for dine behov. Finn de
          mest relevante rettskildene raskt og enkelt.
        </div>
        <div>
          {session ? (
            <Button
              asChild
              variant="premium"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              <Link href="/dashboard">Prøv det nå!</Link>
            </Button>
          ) : (
            <SignInButton
              variant="premium"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
            >
              Prøv det nå!
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  )
}

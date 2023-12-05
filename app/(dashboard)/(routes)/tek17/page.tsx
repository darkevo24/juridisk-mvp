import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function page() {
  return (
    <div>
      <div className="w-full flex justify-between">
        <Link
          href={"tek17/1/1-1"}
          className="flex ml-auto items-center px-3 py-1 border border-blue-800 text-blue-800 font-medium cursor-pointer hover:bg-blue-800 hover:text-primary-foreground transition"
        >
          Neste
          <ChevronRight className="ml-1" />
        </Link>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: `<h2>Veiledning om tekniske krav til byggverk</h2><p>Forskrift om tekniske krav til byggverk trekker opp grensen for det minimum av egenskaper et byggverk må ha for å kunne oppføres lovlig i Norge.</p>
      <p>Denne veiledningen forklarer forskriftens krav og gir preaksepterte ytelser som vil oppfylle kravene.</p>
      <p>Forskriften gir funksjonskrav, men i mange tilfeller er funksjonskravene også fortolket og gitt som ytelseskrav i forskriften. Dette gjelder for eksempel krav knyttet til tilgjengelig boenhet. Andre funksjonskrav er fortolket og gitt som preaksepterte ytelser i denne veiledningen. Dette gjelder for eksempel i stor grad for sikkerhet ved brann.</p>
      <p>Informasjon utgitt av Direktoratet for byggkvalitet kan fritt brukes og gjengis. Ved gjengivelse av tekst eller figurer, skal Direktoratet for byggkvalitet oppgis som kilde.</p>
      <p>Norske standarder og anvisninger fra SINTEFs byggforskserie er nyttige verktøy for å lage gode byggverk. Vi har derfor lagt inn lenker til en del standarder og anvisninger under de enkelte paragrafer, til tross for at dette ikke er gratis hjelpemidler. Adgang til dem krever avtale med prisfastsetting som faller utenfor vårt virkeområde, på samme måte som annet verktøy for prosjektering og bygging.</p>
      <p>Det finnes også andre standarder og anvisninger enn de vi har gitt lenker til som kan være nyttige ved planlegging, prosjektering og utførelse av byggverk. Standard Norge og SINTEF har sortert disse etter kapitlene i forskriften, jf. lenkene nedenfor.</p>
      <h3>Vil du laste ned eller skrive ut veiledningen?</h3>
      <p><span style="text-transform: inherit;">Du kan laste ned eller skrive ut enkeltbestemmelser, kapitler eller hele forskriften med veiledning. Bruk ikonet for "skriv ut" som er plassert øverst ved hvert kapittel, og velg hva du vil laste ned eller skrive ut.</span></p>
      <h2 class="h3">llustrasjoner</h2>
      <ul>
      <li>Grafonaut og Creuna, med mindre annet er oppgitt. Flere av illustrasjonene er laget etter idé fra SINTEF Community</li>
      <li>Kapittel 7: Norges vassdrags- og energidirektorat (NVE)</li>
      <li>Kapittel 14: Standard Norge og Boligprodusentenes forening</li>
      <li>§ 13-15 Figur 1: SINTEF Community (kilde)</li>
      </ul>
      <h2> </h2><p><div class="boxed-referral-list">
      <div class="boxed-referral-list-content">
      <h2 class="boxed-referral-list-title">Henvisninger</h2>
      <ul class="list-links">
      <li><a class="link-out" href="https://www.standard.no/nettbutikk/standarder-for-byggfag/referansestandarder-til-byggteknisk-forskrift-tek-med-veiledning/" title="standard.no: Referansestandarder fra Standard Norge">Referansestandarder fra Standard Norge</a></li>
      <li><a class="link-out" href="https://www.byggforsk.no/byggeregler" title="byggforsk.no: Anvisninger i Byggforskserien fra SINTEF Byggforsk">Anvisninger i Byggforskserien (SINTEF) </a></li>
      </ul>
      </div>
      </div></p>`,
        }}
        className="prose group:max-w-[75ch] prose-lg prose-neutral prose-ul:font-medium prose-p:text-neutral-800 prose-p:font-medium py-6 max-w-none"
      ></div>
    </div>
  )
}

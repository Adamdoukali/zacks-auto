import { createFileRoute, Link } from "@tanstack/react-router";
import heroCar from "../assets/hero-car.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Zak's Auto" },
      {
        name: "description",
        content:
          "Learn about Zak's Auto, a premium car showroom built on trust, honest pricing, and a passion for great vehicles.",
      },
      {
        property: "og:title",
        content: "About — Zak's Auto",
      },
      {
        property: "og:description",
        content:
          "Learn about Zak's Auto, a premium car showroom built on trust, honest pricing, and a passion for great vehicles.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Our story
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            A passion for performance and prestige.
          </h1>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Zack's Auto was founded in 2023 with a singular mission: curate only the finest
            supercars, luxury SUVs, and sports vehicles in Morocco with unmatched transparency.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We don't do pressure or inflated prices. Every vehicle on our floor is handpicked,
            120-point certified, and presented with complete history and bespoke specifications.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">3+</p>
              <p className="text-sm text-muted-foreground">years in business</p>
            </div>
            <div className="rounded-xl bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">
                100%
              </p>
              <p className="text-sm text-muted-foreground">client satisfaction</p>
            </div>
            <div className="rounded-xl bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">
                350+
              </p>
              <p className="text-sm text-muted-foreground">vehicles delivered</p>
            </div>
            <div className="rounded-xl bg-card p-5">
              <p className="font-display text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">VIP concierge support</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl">
          <img
            src={heroCar}
            alt="The Zak's Auto showroom interior with a premium vehicle under warm spotlights"
            className="h-full w-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          What our customers say
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="text-sm text-primary">★★★★★</div>
              <blockquote className="mt-4 leading-relaxed text-foreground text-balance">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-5">
                <p className="font-medium text-foreground">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Visit the showroom
        </Link>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Tbarkellah 3la l'équipe Zack's Auto ! J'ai pris l'Urus S avec la ligne Akrapovič, état clinique et reprise de mon ancien véhicule réglée en 2 heures. Service VIP au Maroc.",
    author: "Mehdi Bennani",
    detail: "Lamborghini URUS S Akrapovič • Casablanca",
  },
  {
    quote:
      "Le G63 AMG China Blue est tout simplement exceptionnel. Kilométrage réel certifié, transparence totale et livraison rapide à Tanger. Chapeau Zack's Auto !",
    author: "Mohamed El Marnissi",
    detail: "Mercedes-Benz G63 AMG • Tanger",
  },
  {
    quote:
      "Reprise de mon ancienne voiture et acquisition du Jeep 4xe Dedro sans aucune prise de tête. Ils acceptent tous les modes de paiement et la paperasse est réglée en 24h.",
    author: "Youssef Tazi",
    detail: "Jeep Wrangler Sahara 4xe • Rabat",
  },
  {
    quote:
      "Tiguan R-Line 2026 WW Maroc livrée à Marrakech en état neuf sous garantie. Meilleur rapport qualité/prix du marché et accueil très chaleureux au showroom.",
    author: "Amine Berrada",
    detail: "Volkswagen Tiguan R-Line • Marrakech",
  },
  {
    quote:
      "Une vraie référence pour les passionnés de supercars et sportives au Maroc. La R1 Stage-2 Akrapovič est une bombe, achat en toute confiance.",
    author: "Hamza Chraibi",
    detail: "Yamaha YZF-R1 Stage-2 • Fès",
  },
  {
    quote:
      "Qualité de service digne des plus grands showrooms internationaux. Prix direct sans intermédiaire et disponibilité de l'équipe 24/7 sur WhatsApp.",
    author: "Karim Alami",
    detail: "Volkswagen T-Roc R-Line • Casablanca",
  },
];

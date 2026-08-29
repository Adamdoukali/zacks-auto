import { createFileRoute, Link } from "@tanstack/react-router";
import heroCar from "../assets/hero-car.jpg";
import logoImg from "../assets/logo.png";
import { useInventoryStore, useCompanySettings, type Vehicle } from "../lib/store";
import { Shield, Check, Award, ArrowRight, Gauge, Zap, Fuel, Car as CarIcon, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zack's Auto — Exclusive Supercars & Luxury Dealership" },
      {
        name: "description",
        content:
          "Curated showroom of premium inspected supercars in Morocco. Transparent pricing, reprise exchange, and flexible payments.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { vehicles } = useInventoryStore();
  const { settings } = useCompanySettings();

  // Show all stock on landing page
  const featuredList = vehicles;

  return (
    <>
      {/* Hero Section with Dark Ambient Background Image & Scaled Showcase */}
      <section className="relative overflow-hidden bg-background py-14 md:py-20 lg:py-28">
        {/* Full-bleed Dark Showroom Image in the Background */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <img
            src={heroCar}
            alt="Zack's Auto Showroom Background"
            className="size-full object-cover opacity-25 filter blur-[1px] scale-105"
            fetchPriority="high"
          />
          {/* Deep Dark Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />
        </div>

        {/* Subtle Background Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -top-10 right-0 size-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="size-3.5" /> Est. 2023 — 3 Years in Business
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-foreground text-balance">
                Drive something
                <span className="text-primary"> worth</span> arriving in.
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-muted-foreground">
                Morocco's curated showroom for exclusive supercars, performance coupes, and luxury SUVs.
                Certified low kilometers, instant reprise exchange, and all payment methods accepted.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/showroom"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20"
                >
                  <CarIcon className="size-4" /> Browse all {vehicles.length} vehicles
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-secondary hover:border-primary/40"
                >
                  Book Private Visit
                </Link>
              </div>

              {/* Quick Specs Highlight Bar */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-border/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-display text-xl font-bold text-primary">650 HP</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Porsche 911 Turbo S</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-primary">666 HP</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Lamborghini Urus S</p>
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-primary">585 HP</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">G63 AMG Biturbo</p>
                </div>
              </div>
            </div>

            {/* Right Column: Proportional Showcase with Background Watermark Logo */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Glowing Dealership Logo Watermark behind the Car */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 -top-8 scale-125 z-0">
                <img
                  src={logoImg}
                  alt="Zack's Auto Watermark Logo"
                  className="w-full max-w-md object-contain filter drop-shadow-[0_0_40px_rgba(255,222,0,0.4)]"
                />
              </div>

              {/* Framed Vehicle Card - scaled to fit perfectly */}
              <div className="relative z-10 w-full max-w-lg rounded-3xl border border-primary/30 bg-card/80 p-3 shadow-2xl backdrop-blur-md hover:border-primary/60 transition-all duration-500 group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-black/60">
                  <img
                    src={heroCar}
                    alt="2024 Porsche 911 Turbo S Cabriolet at Zack's Auto Showroom"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Tag */}
                  <div className="absolute top-3.5 left-3.5 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Featured Showcase
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">
                        Porsche 911 Turbo S Cabriolet
                      </p>
                      <p className="font-display text-lg font-bold">
                        Gentian Blue Metallic • 650 HP
                      </p>
                    </div>
                    <Link
                      to="/vehicle/$id"
                      params={{ id: "veh-porsche" }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-black/80 px-3 py-1.5 rounded-lg border border-primary/40 hover:bg-primary hover:text-black transition-colors"
                    >
                      View Car →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-card/20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
          {[
            { value: "3+", label: "Years in business" },
            { value: "350+", label: "Supercars delivered" },
            { value: "100%", label: "Client satisfaction" },
            { value: "100%", label: "Inspected & certified" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card/40 px-6 py-8 text-center md:text-left">
              <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Preview — All Stock */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              On the floor now
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">
              Current Available Fleet ({featuredList.length} Vehicles)
            </h2>
          </div>
          <Link
            to="/showroom"
            className="hidden text-sm font-semibold text-primary hover:underline md:flex items-center gap-1"
          >
            Showroom filters <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredList.map((car) => (
            <HomeCarCard key={car.id} car={car} currency={settings.currencySymbol} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/showroom"
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
          >
            View all vehicles
          </Link>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-card/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Why Choose Zack's Auto
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
                Exclusive cars, unbeatable deals & total flexibility.
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                At Zack's Auto, we provide great deals on high-end, exclusive sports and luxury
                vehicles with genuine low mileage. We simplify your purchase with universal payment
                methods and instant reprise exchange.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Exclusive & high-spec luxury cars with certified low mileage",
                  "Unbeatable market deals and 100% price transparency",
                  "Reprise & Vehicle Exchange: Trade-in your current car with instant appraisal",
                  "All payment methods accepted: Bank wire, checks, cash, crypto & financing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      ✓
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-sm">
                <p className="font-display text-3xl font-bold text-primary">Low KM</p>
                <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                  Exclusive Certified Stock
                </p>
              </div>
              <div className="rounded-2xl bg-primary p-6 text-center text-primary-foreground shadow-md">
                <p className="font-display text-3xl font-bold">Reprise</p>
                <p className="mt-1 text-xs text-primary-foreground/90 uppercase tracking-wider">
                  Exchange Any Car
                </p>
              </div>
              <div className="rounded-2xl bg-primary p-6 text-center text-primary-foreground shadow-md">
                <p className="font-display text-3xl font-bold">Any Pay</p>
                <p className="mt-1 text-xs text-primary-foreground/90 uppercase tracking-wider">
                  All Methods Accepted
                </p>
              </div>
              <div className="rounded-2xl bg-card border border-border p-6 text-center shadow-sm">
                <p className="font-display text-3xl font-bold text-primary">Great Deals</p>
                <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                  Direct Owner Pricing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Visit */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border px-6 py-16 text-center md:px-12">
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Private Viewings
            </p>
            <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl font-bold tracking-tight text-foreground text-balance">
              Book a private showroom appointment.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Experience the cars in person. Tell us what you're interested in and we'll have it
              ready on the floor.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
              >
                Schedule appointment
              </Link>
              <Link
                to="/showroom"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-secondary px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors"
              >
                <CarIcon className="size-4 mr-2 text-primary" /> View Showroom Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function HomeCarCard({ car, currency }: { car: Vehicle; currency: string }) {
  return (
    <Link
      to="/vehicle/$id"
      params={{ id: car.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 flex flex-col justify-between shadow-sm hover:shadow-xl block"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {car.images && car.images[0] ? (
          <img
            src={car.images[0]}
            alt={car.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="size-full flex items-center justify-center text-muted-foreground">
            <CarIcon className="size-10" />
          </div>
        )}

        {car.tag && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
            {car.tag}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {car.year} {car.name}
            </h3>
            <span className="font-display text-base font-bold text-primary">
              {currency}
              {car.price.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {car.brand} • {car.miles} • {car.transmission}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <span>{car.power}</span>
          <span>{car.fuel}</span>
          <span className="font-semibold text-primary group-hover:underline flex items-center gap-1">
            Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

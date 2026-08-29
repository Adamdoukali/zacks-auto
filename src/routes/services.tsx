import { createFileRoute, Link } from "@tanstack/react-router";
import { Wrench, HandCoins, Truck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Zak's Auto" },
      {
        name: "description",
        content:
          "Zak's Auto offers certified inspections, honest trade-ins, flexible financing, and in-house servicing for every vehicle.",
      },
      {
        property: "og:title",
        content: "Services — Zak's Auto",
      },
      {
        property: "og:description",
        content:
          "Zak's Auto offers certified inspections, honest trade-ins, flexible financing, and in-house servicing for every vehicle.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: ShieldCheck,
    title: "Exclusive Low-Mileage Stock",
    description:
      "Every vehicle on our floor is an exclusive, high-spec edition with certified low kilometers, pristine mechanical health, and comprehensive 120-point inspection.",
  },
  {
    icon: HandCoins,
    title: "Reprise & Vehicle Exchange",
    description:
      "We accept trade-in and reprise on any vehicle. Bring your car to our showroom for an immediate, fair market appraisal against any vehicle in stock.",
  },
  {
    icon: Truck,
    title: "All Payment Methods Accepted",
    description:
      "Total payment flexibility. We accept bank wire transfers, certified bank checks, cash, cryptocurrency, and tailored vehicle financing plans.",
  },
  {
    icon: Wrench,
    title: "Great Deals & Fast Delivery",
    description:
      "Direct owner pricing with no hidden intermediary commissions. Enjoy fast 24-hour document handover and nationwide doorstep delivery across Morocco.",
  },
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          What we do
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Services
        </h1>
        <p className="mt-4 text-muted-foreground">
          From the first handshake to long after you drive away, we're here to
          make owning a premium car simple and stress-free.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary/40"
          >
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <service.icon className="size-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
              {service.title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl bg-charcoal px-6 py-12 text-center md:px-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Ready to talk numbers?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Whether you're trading, financing, or just curious, we'll give you a
          straight answer with no pressure.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}

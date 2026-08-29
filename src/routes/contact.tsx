import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Zak's Auto" },
      {
        name: "description",
        content:
          "Book a visit or get in touch with Zak's Auto. We're open Monday to Saturday, 9am to 7pm.",
      },
      {
        property: "og:title",
        content: "Contact — Zak's Auto",
      },
      {
        property: "og:description",
        content:
          "Book a visit or get in touch with Zak's Auto. We're open Monday to Saturday, 9am to 7pm.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Get in touch
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Book a private showroom visit.
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
            Tell us what you're looking for and we'll have a car and a coffee
            ready. No appointment pressure, no sales script.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Showroom</p>
                <p className="text-sm text-muted-foreground">
                  1420 Foundry Lane, Dockside
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-sm text-muted-foreground">(555) 018-2200</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  hello@zaksauto.example
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Hours</p>
                <p className="text-sm text-muted-foreground">
                  Mon–Sat: 9am — 7pm
                </p>
                <p className="text-sm text-muted-foreground">Sun: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="size-7" />
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
                Request received
              </h2>
              <p className="mt-2 text-muted-foreground">
                Thanks for reaching out. We'll be in touch within 24 hours to
                confirm your visit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="interest"
                  className="text-sm font-medium text-foreground"
                >
                  Interested in
                </label>
                <select
                  id="interest"
                  name="interest"
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option>General enquiry</option>
                  <option>Vertex GT</option>
                  <option>Corvo S</option>
                  <option>Regent L</option>
                  <option>Lumen Crossover</option>
                  <option>Astra Sport</option>
                  <option>Trade-in / finance</option>
                  <option>Service</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tell us what you're looking for..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Request a visit
              </button>
              <p className="text-center text-xs text-muted-foreground">
                This is a demo form. No data is sent anywhere.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

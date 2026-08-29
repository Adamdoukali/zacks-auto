import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Clock, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useCompanySettings } from "../lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Private Viewing — Zack's Auto" },
      {
        name: "description",
        content:
          "Book a private viewing or get in touch with Zack's Auto. Open Monday to Saturday with 24/7 WhatsApp VIP concierge.",
      },
      {
        property: "og:title",
        content: "Contact & Private Viewing — Zack's Auto",
      },
      {
        property: "og:description",
        content:
          "Book a private viewing or get in touch with Zack's Auto. Open Monday to Saturday with 24/7 WhatsApp VIP concierge.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { settings } = useCompanySettings();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const cleanPhoneForWhatsApp = (settings.phone || "+212668737862").replace(/[^0-9]/g, "");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* Left Info Column */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Private Concierge
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance">
              Get in touch with Zack's Auto.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Looking for a specific supercar or scheduling a private viewing? Our team is available
              to assist with sales, vehicle appraisals, and custom import inquiries.
            </p>
          </div>

          {/* Contact Details (Phone, Email, Hours) */}
          <div className="space-y-5 rounded-3xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-sm">
            {/* Phone & Direct Call */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone & Direct Line
                </p>
                <a
                  href={`tel:${settings.phone || "+212668737862"}`}
                  className="mt-0.5 block font-display text-lg font-bold text-foreground hover:text-primary transition-colors"
                >
                  {settings.phone || "+212 6 68 73 78 62"}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <a
                  href={`mailto:${settings.email || "contact@zacksauto.ma"}`}
                  className="mt-0.5 block font-display text-lg font-bold text-foreground hover:text-primary transition-colors"
                >
                  {settings.email || "contact@zacksauto.ma"}
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Showroom Opening Hours
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  Monday – Saturday: 9:00 AM — 8:00 PM
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sunday: Private VIP Appointments Only
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Quick Button */}
            <div className="pt-3 border-t border-border/60">
              <a
                href={`https://wa.me/${cleanPhoneForWhatsApp}?text=Hello%20Zack%27s%20Auto,%20I%20would%20like%20to%20inquire%20about%20your%20available%20vehicles.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white transition-colors shadow-lg"
              >
                <MessageCircle className="size-4" /> Chat Directly on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Right Interactive Form */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Message Received
              </h2>
              <p className="max-w-sm mx-auto text-sm text-muted-foreground leading-relaxed">
                Thank you for contacting Zack's Auto. Our concierge team will connect with you via
                WhatsApp or phone shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 inline-flex text-xs font-semibold text-primary hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Mehdi Bennani"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="interest" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Vehicle of Interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option>Porsche 911 Turbo S Cabriolet (2024)</option>
                  <option>Lamborghini URUS S Akrapovič (2024)</option>
                  <option>Mercedes-Benz G63 AMG China Blue (2022)</option>
                  <option>Jeep Wrangler Sahara 4xe Dedro (2021/2026)</option>
                  <option>Volkswagen Tiguan R-Line WW Maroc (2026)</option>
                  <option>Volkswagen T-Roc R-Line Lapiz Blue (2024)</option>
                  <option>Yamaha YZF-R1 Stage-2 Akrapovič (2016)</option>
                  <option>Reprise & Vehicle Exchange Appraisal</option>
                  <option>General VIP Concierge Inquiry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Message / Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Describe what you are looking for or specify your trade-in vehicle..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.01] shadow-lg"
              >
                <Send className="size-4" /> Send Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

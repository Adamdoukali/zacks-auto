import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import { Shield, Sparkles, Phone, Mail, MapPin, Car, Menu, X, Sun, Moon } from "lucide-react";
import appCss from "../styles.css?url";
import { useCompanySettings } from "../lib/store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Application error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page encountered an issue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Zak's Auto — Premium Car Showroom & Dealership" },
      {
        name: "description",
        content:
          "Curated showroom of premium vehicles. In-house inspections, transparent pricing, and comprehensive customer service.",
      },
      { property: "og:title", content: "Zak's Auto — Premium Car Showroom" },
      {
        property: "og:description",
        content:
          "Curated showroom of premium vehicles. In-house inspections, transparent pricing, and comprehensive customer service.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { settings, updateSettings } = useCompanySettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = settings.theme === "dark" ? "light" : "dark";
    updateSettings({ theme: newTheme });
    if (newTheme === "light") {
      document.documentElement.classList.add("theme-light");
    } else {
      document.documentElement.classList.remove("theme-light");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Dealership Logo / Name */}
        <Link to="/" className="flex items-center gap-3 group">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.companyName}
              className="h-10 sm:h-12 w-auto object-contain max-w-[180px] drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          ) : (
            <>
              <div className="size-10 grid place-items-center rounded-lg border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary group-hover:scale-105 transition-transform">
                {settings.companyName ? settings.companyName.charAt(0) : "Z"}
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm font-semibold tracking-[0.15em] text-foreground uppercase group-hover:text-primary transition-colors">
                  {settings.companyName || "ZACK'S AUTO"}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {settings.tagline || "Premium Showroom"}
                </div>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/showroom"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Showroom
          </Link>
          <Link
            to="/services"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Services
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="/contact"
            activeProps={{ className: "text-primary font-semibold" }}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/contact"
            className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 shadow-md shadow-primary/20"
          >
            Book Visit
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link
            to="/showroom"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-foreground py-1"
          >
            Showroom
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-foreground py-1"
          >
            Services
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-foreground py-1"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-foreground py-1"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { settings } = useCompanySettings();

  return (
    <footer className="border-t border-border bg-card/30 print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName}
                  className="h-12 w-auto object-contain max-w-[180px]"
                />
              ) : (
                <>
                  <div className="size-10 grid place-items-center rounded-lg border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
                    {settings.companyName ? settings.companyName.charAt(0) : "Z"}
                  </div>
                  <div className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {settings.companyName || "ZACK'S AUTO"}
                  </div>
                </>
              )}
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.tagline ||
                "A curated showroom of premium vehicles. Every car inspected, detailed, and ready to drive."}
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              Showroom
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/showroom" className="transition-colors hover:text-primary">
                  Available Vehicles
                </Link>
              </li>
              <li>
                <Link to="/services" className="transition-colors hover:text-primary">
                  Services & Warranty
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  About Our Dealership
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.companyName || "Zack's Auto"}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/contact" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

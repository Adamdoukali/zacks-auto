import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Share2,
  Gauge,
  Zap,
  Fuel,
  Settings2,
} from "lucide-react";
import { useInventoryStore, useCompanySettings, type Vehicle } from "../lib/store";

export const Route = createFileRoute("/vehicle/$id")({
  head: () => ({
    meta: [
      { title: "Vehicle Details — Zack's Auto" },
      {
        name: "description",
        content: "View full vehicle specifications, high resolution gallery, and history report.",
      },
    ],
  }),
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { id } = useParams({ from: "/vehicle/$id" });
  const { vehicles } = useInventoryStore();
  const { settings } = useCompanySettings();

  const vehicle = vehicles.find((v) => v.id === id) || vehicles[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vehicle) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Car className="size-16 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground">Vehicle Not Found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          The requested vehicle may have been sold or moved.
        </p>
        <Link
          to="/showroom"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Return to Showroom
        </Link>
      </div>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const cleanPhoneForWhatsApp = (settings.phone || "+212668737862").replace(/[^0-9]/g, "");

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 pb-6">
          <Link
            to="/showroom"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to Showroom
          </Link>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                vehicle.status === "Available"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : vehicle.status === "Reserved"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {vehicle.status}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/60 border border-border shadow-xl group">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]}
                  alt={vehicle.name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                  <Car className="size-20" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImageIndex
                        ? "border-primary scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Specifications & Action Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                  {vehicle.brand} • {vehicle.year}
                </p>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {vehicle.name}
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {vehicle.model}
                </p>
                <div className="mt-4 font-display text-3xl font-bold text-primary">
                  {settings.currencySymbol}
                  {vehicle.price.toLocaleString()}
                </div>
              </div>

              {vehicle.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              )}

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 bg-background/70 p-4 rounded-2xl border border-border text-xs">
                <div className="flex items-center gap-2.5">
                  <Gauge className="size-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Mileage</span>
                    <span className="font-semibold text-foreground">{vehicle.miles}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="size-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Power</span>
                    <span className="font-semibold text-foreground">{vehicle.power}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Fuel className="size-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Fuel Type</span>
                    <span className="font-semibold text-foreground">{vehicle.fuel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Settings2 className="size-4 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Transmission</span>
                    <span className="font-semibold text-foreground">{vehicle.transmission}</span>
                  </div>
                </div>
              </div>

              {/* Key Features List */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Equipments & Options
                  </h3>
                  <div className="space-y-1.5">
                    {vehicle.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp}?text=Hello%20Zack%27s%20Auto,%20I%20am%20interested%20in%20the%20${encodeURIComponent(
                    vehicle.name
                  )}%20(${encodeURIComponent(vehicle.model)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3.5 text-xs font-bold text-white transition-colors shadow-lg"
                >
                  <MessageCircle className="size-4" /> WhatsApp Us About This Vehicle
                </a>

                <a
                  href={`tel:${settings.phone}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="size-4 text-primary" /> Call Dealership: {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

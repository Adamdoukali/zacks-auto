import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Filter,
  Car,
  Fuel,
  Gauge,
  Zap,
  CheckCircle2,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Phone,
  Sparkles,
} from "lucide-react";
import { useInventoryStore, useCompanySettings, type Vehicle } from "../lib/store";

export const Route = createFileRoute("/showroom")({
  head: () => ({
    meta: [
      { title: "Curated Showroom — Available Vehicles" },
      {
        name: "description",
        content:
          "Explore our curated showroom of premium inspected vehicles. Transparent pricing and comprehensive service history.",
      },
      {
        property: "og:title",
        content: "Curated Showroom — Available Vehicles",
      },
      {
        property: "og:description",
        content:
          "Explore our curated showroom of premium inspected vehicles. Transparent pricing and comprehensive service history.",
      },
    ],
  }),
  component: ShowroomPage,
});

function ShowroomPage() {
  const { vehicles } = useInventoryStore();
  const { settings } = useCompanySettings();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(150000);

  // Selected vehicle for details modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchFuel = selectedFuel === "all" || v.fuel === selectedFuel;
    const matchStatus = selectedStatus === "all" || v.status === selectedStatus;
    const matchTrans =
      selectedTransmission === "all" || v.transmission === selectedTransmission;
    const matchPrice = (v.price || 0) <= maxPrice;

    return matchSearch && matchFuel && matchStatus && matchTrans && matchPrice;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Curated Inventory
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The Showroom
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Every vehicle on our floor undergoes a 120-point mechanical inspection,
            paint-depth analysis, and full cosmetic detailing before handover.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search make, model, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Powertrains</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <select
                value={selectedTransmission}
                onChange={(e) => setSelectedTransmission(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Paddle-shift">Paddle-shift</option>
                <option value="Dual-clutch">Dual-clutch</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs text-foreground outline-none focus:border-primary transition-colors"
              >
                <option value="all">All Availability</option>
                <option value="Available">Available Now</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold Archive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filteredVehicles.length}</strong>{" "}
              vehicles matching criteria
            </span>
            <div className="flex items-center gap-2">
              <span>Max Price:</span>
              <span className="font-semibold text-primary">
                {settings.currencySymbol}
                {maxPrice.toLocaleString()}
              </span>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="accent-primary cursor-pointer w-28"
              />
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((car) => (
            <Link
              key={car.id}
              to="/vehicle/$id"
              params={{ id: car.id }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl block"
            >
              {/* Photo Area */}
              <div className="relative h-56 w-full bg-muted overflow-hidden">
                {car.images && car.images[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.name}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground">
                    <Car className="size-10" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow ${
                      car.status === "Available"
                        ? "bg-emerald-500 text-white"
                        : car.status === "Reserved"
                        ? "bg-amber-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>

                {/* Tag Badge */}
                {car.tag && (
                  <div className="absolute top-3.5 right-3.5 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                    {car.tag}
                  </div>
                )}

                {/* Price in Bottom Corner */}
                <div className="absolute bottom-3 right-3 text-right">
                  <span className="font-display text-xl font-bold text-white drop-shadow-md">
                    {settings.currencySymbol}
                    {car.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {car.year} {car.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {car.brand} {car.model}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-background/50 p-3 rounded-xl border border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="size-3.5 text-primary" />
                      <span>{car.miles}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="size-3.5 text-primary" />
                      <span>{car.power}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="size-3.5 text-primary" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="size-3.5 text-primary" />
                      <span>{car.transmission}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <span className="text-xs font-semibold text-primary group-hover:underline">
                    View full details & gallery →
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVehicle(car);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="mt-16 text-center py-16 bg-card rounded-2xl border border-border">
            <Car className="size-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-base font-bold text-foreground">No vehicles found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your price range or powertrain filter.
            </p>
          </div>
        )}
      </div>

      {/* Vehicle Full Details Modal with Gallery */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          currency={settings.currencySymbol}
          dealershipPhone={settings.phone}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
}

// Vehicle Detail Gallery Modal
function VehicleDetailModal({
  vehicle,
  currency,
  dealershipPhone,
  onClose,
}: {
  vehicle: Vehicle;
  currency: string;
  dealershipPhone: string;
  onClose: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [];

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-card/80">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                vehicle.status === "Available"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {vehicle.status}
            </span>
            <h2 className="font-display text-lg font-bold text-foreground">
              {vehicle.year} {vehicle.name} — {vehicle.brand} {vehicle.model}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Gallery Carousel Column */}
          <div className="lg:col-span-7 p-6 bg-black/40 flex flex-col justify-between space-y-4">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-black/60 group">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]}
                  alt={`${vehicle.name} - slide ${activeImageIndex + 1}`}
                  className="size-full object-contain"
                />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                  <Car className="size-16" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative size-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
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

          {/* Vehicle Specs & Action Column */}
          <div className="lg:col-span-5 p-6 space-y-6 flex flex-col justify-between bg-card">
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Vehicle Price
                </span>
                <div className="font-display text-3xl font-bold text-primary">
                  {currency}
                  {vehicle.price.toLocaleString()}
                </div>
              </div>

              {vehicle.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {vehicle.description}
                </p>
              )}

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-background/80 p-3.5 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground">Mileage:</span>
                  <div className="font-semibold text-foreground">{vehicle.miles}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Power:</span>
                  <div className="font-semibold text-foreground">{vehicle.power}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fuel:</span>
                  <div className="font-semibold text-foreground">{vehicle.fuel}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Transmission:</span>
                  <div className="font-semibold text-foreground">{vehicle.transmission}</div>
                </div>
                {vehicle.color && (
                  <div>
                    <span className="text-muted-foreground">Exterior:</span>
                    <div className="font-semibold text-foreground">{vehicle.color}</div>
                  </div>
                )}
                {vehicle.interior && (
                  <div>
                    <span className="text-muted-foreground">Interior:</span>
                    <div className="font-semibold text-foreground">{vehicle.interior}</div>
                  </div>
                )}
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">
                    Included Features
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vehicle.features.map((feat, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-secondary text-foreground flex items-center gap-1"
                      >
                        <CheckCircle2 className="size-3 text-primary" /> {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-4 border-t border-border">
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Calendar className="size-4" /> Book a Private Test Drive
              </Link>
              <a
                href={`tel:${dealershipPhone}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
              >
                <Phone className="size-3.5" /> Call Dealership: {dealershipPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

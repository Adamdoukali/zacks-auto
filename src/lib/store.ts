import { useState, useEffect, useCallback } from "react";
import carPorsche from "../assets/car-porsche.jpg";
import carUrus from "../assets/car-urus.jpg";
import carUrusMatte from "../assets/car-urus-matte.jpg";
import carG63 from "../assets/car-g63.jpg";
import carJeepWhite from "../assets/car-jeep-white.jpg";
import carTiguanGrey from "../assets/car-tiguan-grey.jpg";
import carVwBlue from "../assets/car-vw-blue.jpg";
import carYamahaR1 from "../assets/car-yamaha-r1.jpg";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  miles: string;
  transmission: "Automatic" | "Manual" | "Paddle-shift" | "Dual-clutch";
  power: string;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "Plug-in Hybrid";
  status: "Available" | "Reserved" | "Sold";
  tag: "Featured" | "New arrival" | "Low mileage" | "Special Offer" | null;
  description: string;
  vin?: string;
  color?: string;
  interior?: string;
  features?: string[];
  images: string[];
  createdAt: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  idNumber?: string;
  driverLicense?: string;
  registeredDate: string;
  status: "Active" | "Lead" | "VIP" | "Inactive";
  notes?: string;
  totalSpent: number;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  clientId: string;
  clientName: string;
  amount: number;
  paymentMethod: "Credit Card" | "Bank Transfer" | "Cash" | "Crypto" | "Financing";
  paymentDate: string;
  status: "Completed" | "Pending" | "Refunded";
  reference: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  vehicleId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  paymentStatus: "Draft" | "Sent" | "Paid" | "Partially Paid" | "Overdue";
  paymentTerms: string;
  notes?: string;
  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  taxId: string;
  bankName: string;
  bankAccount: string;
  bankIban: string;
  bankSwift: string;
  currencySymbol: string;
  defaultTaxRate: number;
  invoicePrefix: string;
  theme: "dark" | "light";
}

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: "Zack's Auto",
  tagline: "Curated Luxury & Performance Vehicles",
  logoUrl: "/logo.png",
  email: "contact@zacksauto.com",
  phone: "+212 6 68 73 78 62",
  address: "Tangier / Casablanca, Morocco",
  website: "www.instagram.com/zacks__auto",
  taxId: "TAX-MA-88492019",
  bankName: "Attijariwafa Bank / BMCE",
  bankAccount: "9874 5632 1045",
  bankIban: "MA64 007 780 0001234567890123 45",
  bankSwift: "BCMAMAMC",
  currencySymbol: "MAD ",
  defaultTaxRate: 0,
  invoicePrefix: "INV-2026",
  theme: "dark",
};

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "veh-porsche",
    name: "Porsche 911 Turbo S Cabriolet",
    brand: "Porsche",
    model: "911 Turbo S Cabriolet (Type 992)",
    year: 2024,
    price: 2890000,
    miles: "12,000 km",
    transmission: "Dual-clutch",
    power: "650 HP",
    fuel: "Petrol",
    status: "Available",
    tag: "Featured",
    description: "Porsche 911 Turbo S Cabriolet 992. Bleu Gentiane Métallisé avec intérieur cuir bicolore Craie & Noir. Pack Sport Chrono, freins céramique PCCB étriers jaunes et système d'échappement sport.",
    vin: "WP0ZZZ99ZPS192834",
    color: "Gentian Blue Metallic (Bleu Gentiane)",
    interior: "Cuir Craie & Noir Bicolore Exclusive",
    features: [
      "Moteur Flat-6 3.8L Biturbo 650 HP",
      "Pack Sport Chrono avec Sélecteur de Mode",
      "Freins Carbone Céramique Porsche (PCCB)",
      "Système d'Échappement Sport avec Sorties Noir Brillant",
      "Jantes 911 Turbo S Exclusive Design 20/21 Pouces",
      "Système Audio Burmester High-End Surround",
      "Projecteurs LED Matrix Teintés avec PDLS Plus"
    ],
    images: [carPorsche],
    createdAt: "2026-08-29T11:00:00Z",
  },
  {
    id: "veh-urus",
    name: "Lamborghini URUS S",
    brand: "Lamborghini",
    model: "URUS S - Akrapovič Unique Specs",
    year: 2024,
    price: 3450000,
    miles: "20,000 km",
    transmission: "Paddle-shift",
    power: "666 HP",
    fuel: "Petrol",
    status: "Available",
    tag: "Featured",
    description: "Lamborghini URUS S - Akrapovič. Unique specs, Model fin 2024 importée neuf. Exhaust Akrapovič Titanium, Freins Carbone Céramique, Full body PPF protection.",
    vin: "ZPBUA1ZL7PLA01928",
    color: "Verde Gea Matte / Army Green",
    interior: "Bicolor Sportivo Leather Orange Contrast",
    features: [
      "Ligne Complète Akrapovič Titanium",
      "Freins Carbone Céramique & Étriers Orange",
      "Full PPF Protection Carrosserie",
      "Jantes 23 Pouces Taigete Diamond Noir",
      "Système Audio Bang & Olufsen 3D Advanced",
      "Toit Panoramique Ouvrant",
      "Plaques d'Immatriculation Zack's Auto"
    ],
    images: [carUrus, carUrusMatte],
    createdAt: "2026-08-29T10:00:00Z",
  },
  {
    id: "veh-g63",
    name: "Mercedes-Benz G-Class G63 AMG",
    brand: "Mercedes-Benz",
    model: "G-Class G63 AMG V8 Biturbo",
    year: 2022,
    price: 2650000,
    miles: "60,000 km",
    transmission: "Paddle-shift",
    power: "585 HP",
    fuel: "Petrol",
    status: "Available",
    tag: "New arrival",
    description: "Mercedes-Benz G-Class G63 AMG. Model 2022 importée neuf. 60.000 km réels. Teinte exclusive China Blue Manufaktur avec étriers rouges et jantes forgées 22 pouces.",
    vin: "W1N9820491823901B",
    color: "China Blue (Baby Blue Gloss)",
    interior: "Cuir Nappa Noir & Rouge Exclusive",
    features: [
      "Moteur V8 4.0L Biturbo 585 HP",
      "Couleur Exclusive China Blue Manufaktur",
      "Étriers de Frein Rouges AMG",
      "Jantes Forgées 22 Pouces Noir Brillant",
      "Pack Night AMG 2 & Calandre Panamericana",
      "Volant AMG Performance Carbone",
      "Système Audio Burmester Surround 3D"
    ],
    images: [carG63],
    createdAt: "2026-08-28T12:00:00Z",
  },
  {
    id: "veh-jeep",
    name: "Jeep Wrangler Sahara 4xe Dedro",
    brand: "Jeep",
    model: "Sahara 4xe Dedro Off-Road Edition",
    year: 2021,
    price: 680000,
    miles: "80,000 km",
    transmission: "Automatic",
    power: "375 HP",
    fuel: "Plug-in Hybrid",
    status: "Available",
    tag: "Special Offer",
    description: "Jeep Wrangler Sahara 4xe Hybrid 375Hp. Model 2021 dédouanée 2026 US import. 80.000 km. Équipée du pare-chocs acier tout-terrain DEDRO avec anneaux de remorquage, jantes 20 pouces noir et toit Sky One-Touch.",
    vin: "1C4JJXR67MW819203",
    color: "Bright White Clearcoat",
    interior: "Cuir Noir Premium & Surpiqûres Bleues 4xe",
    features: [
      "Motorisation 4xe Hybride Rechargeable 375 HP",
      "Pare-Chocs Tout-Terrain Acier DEDRO",
      "Jantes 20 Pouces Gloss Black avec Accents 4xe",
      "Pneumatiques Tout-Terrain Renforcés",
      "Toit Sky One-Touch Power Top Électrique",
      "Écran Tactile Uconnect 8.4 avec Apple CarPlay & Android Auto",
      "Phares Full LED Signature"
    ],
    images: [carJeepWhite],
    createdAt: "2026-08-27T14:30:00Z",
  },
  {
    id: "veh-tiguan",
    name: "Volkswagen Tiguan R-Line",
    brand: "Volkswagen",
    model: "Tiguan R-Line 2026 WW Maroc",
    year: 2026,
    price: 495000,
    miles: "18,000 km",
    transmission: "Dual-clutch",
    power: "200 HP",
    fuel: "Diesel",
    status: "Available",
    tag: "Low mileage",
    description: "Volkswagen Tiguan R-Line. Model 2026 WW Maroc, 18.000 km d'origine. Calandre lumineuse LED Lightbar, jantes sport noir brillant, état neuf sous garantie constructeur.",
    vin: "WVGZZZ5NZMW192834",
    color: "Urano Grey Metallic / Black Edition",
    interior: "Pack R-Line Alcantara & Cuir",
    features: [
      "Pack R-Line Intérieur & Extérieur Black Style",
      "Calandre avec Bandeau Lumineux LED Avant",
      "Digital Cockpit Pro Haute Résolution",
      "Toit Ouvrant Panoramique",
      "Projecteurs IQ.LIGHT Matrix LED",
      "Jantes Sport 19 Pouces Noir Brillant"
    ],
    images: [carTiguanGrey],
    createdAt: "2026-08-26T09:15:00Z",
  },
  {
    id: "veh-troc",
    name: "Volkswagen T-Roc R-Line",
    brand: "Volkswagen",
    model: "T-Roc R-Line Lapiz Blue",
    year: 2024,
    price: 385000,
    miles: "24,000 km",
    transmission: "Dual-clutch",
    power: "190 HP",
    fuel: "Petrol",
    status: "Available",
    tag: "New arrival",
    description: "Volkswagen T-Roc R-Line. Teinte métallisée Lapiz Blue avec toit noir bi-ton. Jantes 19 pouces Misano diamantées, phares IQ.LIGHT et volant sport R.",
    vin: "WVGZZZA1ZPW102948",
    color: "Lapiz Blue Metallic / Toit Noir",
    interior: "Sellerie R-Line Sportive",
    features: [
      "Teinte Sport Lapiz Blue Metallic",
      "Toit Noir Panoramique Contrasté",
      "Jantes Alliage 19 Pouces Bicolores",
      "Volant Sport R-Line avec Palettes",
      "Caméra de Recul & Radars 360",
      "Modes de Conduite Eco / Normal / Sport"
    ],
    images: [carVwBlue],
    createdAt: "2026-08-25T11:00:00Z",
  },
  {
    id: "veh-yamaha",
    name: "Yamaha YZF-R1 Stage-2",
    brand: "Yamaha",
    model: "YZF-R1 Stage-2 Akrapovič",
    year: 2016,
    price: 195000,
    miles: "35,000 km",
    transmission: "Manual",
    power: "210 HP",
    fuel: "Petrol",
    status: "Available",
    tag: "Featured",
    description: "Yamaha R1-YZF Stage-2. Model fin 2016 dédouanée 2019, 35.000 km. Ligne complète Akrapovič titane, cartographie Stage-2 avec Pops & Bang, full accessoires carbone, pneus Pirelli Diablo Rosso 4 Corsa neufs, kit chaîne renforcé gold.",
    vin: "JYARN32E000192847",
    color: "Midnight Black / Red Racing Graphics",
    interior: "Selle Confort & Capot Monoplace",
    features: [
      "Ligne Complète Akrapovič Titane",
      "Cartographie Stage-2 Pops & Bang",
      "Pneus Pirelli Diablo Rosso 4 Corsa",
      "Protections Moteur GB Racing",
      "Kit Chaîne Gold Renforcé",
      "Filtre à Air K&N & Bougies Neuves",
      "Conduits Refroidissement Freins Carbone",
      "Béquille d'Atelier Racing Incluse"
    ],
    images: [carYamahaR1],
    createdAt: "2026-08-25T16:45:00Z",
  },
];

const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    fullName: "Mehdi Bennani",
    email: "mehdi.bennani@groupe-maroc.ma",
    phone: "+212 6 61 23 45 67",
    address: "Boulevard d'Anfa, Résidence Les Palmiers, Casablanca",
    idNumber: "CIN-BK894210",
    driverLicense: "PERMIS-MA-092819",
    registeredDate: "2026-01-20",
    status: "VIP",
    notes: "Client fidèle de Zack's Auto. Collectionneur de supercars. Achat Urus S avec ligne Akrapovič.",
    totalSpent: 3450000,
  },
  {
    id: "cli-2",
    fullName: "Mohamed El Marnissi",
    email: "m.elmarnissi@tanger-holding.com",
    phone: "+212 6 63 98 76 54",
    address: "Malabata Bay, Villa 14, Tanger",
    idNumber: "CIN-KB448201",
    driverLicense: "PERMIS-MA-104928",
    registeredDate: "2026-02-05",
    status: "VIP",
    notes: "Acquisition Mercedes-Benz G63 AMG China Blue. Reprise effectuée.",
    totalSpent: 2650000,
  },
  {
    id: "cli-3",
    fullName: "Youssef Tazi",
    email: "youssef.tazi@invest-rabat.ma",
    phone: "+212 6 60 12 34 56",
    address: "Souissi, Avenue Mohammed VI, Rabat",
    idNumber: "CIN-A774920",
    driverLicense: "PERMIS-MA-201948",
    registeredDate: "2026-02-12",
    status: "Active",
    notes: "Achat Jeep Wrangler Sahara 4xe Dedro Off-Road.",
    totalSpent: 680000,
  },
  {
    id: "cli-4",
    fullName: "Amine Berrada",
    email: "a.berrada@marrakech-riad.com",
    phone: "+212 6 65 43 21 09",
    address: "L'Hivernage, Rue Haroun Errachid, Marrakech",
    idNumber: "CIN-EE389201",
    driverLicense: "PERMIS-MA-392014",
    registeredDate: "2026-02-18",
    status: "Active",
    notes: "Achat Volkswagen Tiguan R-Line 2026 WW Maroc.",
    totalSpent: 495000,
  },
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    invoiceId: "inv-1",
    clientId: "cli-1",
    clientName: "Mehdi Bennani",
    amount: 3450000,
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-02-02",
    status: "Completed",
    reference: "VIR-ATTIJARI-884920",
    notes: "Règlement complet pour commande Lamborghini Urus S.",
  },
  {
    id: "pay-2",
    invoiceId: "inv-2",
    clientId: "cli-2",
    clientName: "Mohamed El Marnissi",
    amount: 2650000,
    paymentMethod: "Bank Transfer",
    paymentDate: "2026-02-10",
    status: "Completed",
    reference: "VIR-BMCE-992014",
    notes: "Règlement Mercedes-Benz G63 AMG China Blue après reprise.",
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0001",
    issueDate: "2026-02-01",
    dueDate: "2026-02-15",
    clientId: "cli-1",
    clientName: "Mehdi Bennani",
    clientEmail: "mehdi.bennani@groupe-maroc.ma",
    clientPhone: "+212 6 61 23 45 67",
    clientAddress: "Boulevard d'Anfa, Résidence Les Palmiers, Casablanca",
    items: [
      {
        id: "item-1",
        description: "2024 Lamborghini URUS S - Akrapovič Unique Specs (VIN: ZPBUA1ZL7PLA01928)",
        quantity: 1,
        unitPrice: 3450000,
        total: 3450000,
        vehicleId: "veh-urus",
      },
    ],
    subtotal: 3450000,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 3450000,
    amountPaid: 3450000,
    paymentStatus: "Paid",
    paymentTerms: "Paiement par virement bancaire ou chèque certifié.",
    notes: "Véhicule livré avec carnet d'entretien complet, double de clés et certificat de garantie Zack's Auto.",
    createdAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0002",
    issueDate: "2026-02-08",
    dueDate: "2026-02-22",
    clientId: "cli-2",
    clientName: "Mohamed El Marnissi",
    clientEmail: "m.elmarnissi@tanger-holding.com",
    clientPhone: "+212 6 63 98 76 54",
    clientAddress: "Malabata Bay, Villa 14, Tanger",
    items: [
      {
        id: "item-2",
        description: "2022 Mercedes-Benz G-Class G63 AMG China Blue (VIN: W1N9820491823901B)",
        quantity: 1,
        unitPrice: 2650000,
        total: 2650000,
        vehicleId: "veh-g63",
      },
    ],
    subtotal: 2650000,
    taxRate: 0,
    taxAmount: 0,
    discount: 0,
    totalAmount: 2650000,
    amountPaid: 2650000,
    paymentStatus: "Paid",
    paymentTerms: "Paiement virement bancaire + reprise véhicule.",
    notes: "Facture acquittée. Carte grise et certificat de dédouanement remis au client.",
    createdAt: "2026-02-08T11:30:00Z",
  },
];

// LocalStorage Keys - bumped to v8 for instant live sync
const KEYS = {
  VEHICLES: "zaks_custom_inventory_v8",
  CLIENTS: "zaks_custom_clients_v8",
  PAYMENTS: "zaks_custom_payments_v8",
  INVOICES: "zaks_custom_invoices_v8",
  SETTINGS: "zaks_custom_settings_v8",
};

// Generic storage helper
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("zaks_store_update", { detail: { key } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// React Custom Hook for Vehicles Inventory
export function useInventoryStore() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    getStoredItem(KEYS.VEHICLES, INITIAL_VEHICLES)
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === KEYS.VEHICLES) {
        setVehicles(getStoredItem(KEYS.VEHICLES, INITIAL_VEHICLES));
      }
    };
    window.addEventListener("zaks_store_update", handler);
    return () => window.removeEventListener("zaks_store_update", handler);
  }, []);

  const addVehicle = useCallback((newVeh: Omit<Vehicle, "id" | "createdAt">) => {
    const vehicle: Vehicle = {
      ...newVeh,
      id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setVehicles((prev) => {
      const updated = [vehicle, ...prev];
      setStoredItem(KEYS.VEHICLES, updated);
      return updated;
    });
    return vehicle;
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => {
      const updated = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
      setStoredItem(KEYS.VEHICLES, updated);
      return updated;
    });
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => {
      const updated = prev.filter((v) => v.id !== id);
      setStoredItem(KEYS.VEHICLES, updated);
      return updated;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setStoredItem(KEYS.VEHICLES, INITIAL_VEHICLES);
    setVehicles(INITIAL_VEHICLES);
  }, []);

  return { vehicles, addVehicle, updateVehicle, deleteVehicle, resetToDefault };
}

// React Custom Hook for Clients CRM
export function useClientsStore() {
  const [clients, setClients] = useState<Client[]>(() =>
    getStoredItem(KEYS.CLIENTS, INITIAL_CLIENTS)
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === KEYS.CLIENTS) {
        setClients(getStoredItem(KEYS.CLIENTS, INITIAL_CLIENTS));
      }
    };
    window.addEventListener("zaks_store_update", handler);
    return () => window.removeEventListener("zaks_store_update", handler);
  }, []);

  const addClient = useCallback((newCli: Omit<Client, "id" | "registeredDate" | "totalSpent">) => {
    const client: Client = {
      ...newCli,
      id: `cli-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      registeredDate: new Date().toISOString().split("T")[0],
      totalSpent: 0,
    };
    setClients((prev) => {
      const updated = [client, ...prev];
      setStoredItem(KEYS.CLIENTS, updated);
      return updated;
    });
    return client;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      setStoredItem(KEYS.CLIENTS, updated);
      return updated;
    });
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setStoredItem(KEYS.CLIENTS, updated);
      return updated;
    });
  }, []);

  return { clients, addClient, updateClient, deleteClient };
}

// React Custom Hook for Payments
export function usePaymentsStore() {
  const [payments, setPayments] = useState<Payment[]>(() =>
    getStoredItem(KEYS.PAYMENTS, INITIAL_PAYMENTS)
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === KEYS.PAYMENTS) {
        setPayments(getStoredItem(KEYS.PAYMENTS, INITIAL_PAYMENTS));
      }
    };
    window.addEventListener("zaks_store_update", handler);
    return () => window.removeEventListener("zaks_store_update", handler);
  }, []);

  const addPayment = useCallback((newPay: Omit<Payment, "id">) => {
    const payment: Payment = {
      ...newPay,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setPayments((prev) => {
      const updated = [payment, ...prev];
      setStoredItem(KEYS.PAYMENTS, updated);
      return updated;
    });
    return payment;
  }, []);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      setStoredItem(KEYS.PAYMENTS, updated);
      return updated;
    });
  }, []);

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      setStoredItem(KEYS.PAYMENTS, updated);
      return updated;
    });
  }, []);

  return { payments, addPayment, updatePayment, deletePayment };
}

// React Custom Hook for Invoices
export function useInvoicesStore() {
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    getStoredItem(KEYS.INVOICES, INITIAL_INVOICES)
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === KEYS.INVOICES) {
        setInvoices(getStoredItem(KEYS.INVOICES, INITIAL_INVOICES));
      }
    };
    window.addEventListener("zaks_store_update", handler);
    return () => window.removeEventListener("zaks_store_update", handler);
  }, []);

  const addInvoice = useCallback(
    (newInv: Omit<Invoice, "id" | "createdAt" | "invoiceNumber"> & { invoiceNumber?: string }) => {
      const count = getStoredItem<Invoice[]>(KEYS.INVOICES, INITIAL_INVOICES).length + 1;
      const invoiceNumber =
        newInv.invoiceNumber || `INV-2026-${String(count).padStart(4, "0")}`;
      const invoice: Invoice = {
        ...newInv,
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        invoiceNumber,
        createdAt: new Date().toISOString(),
      };
      setInvoices((prev) => {
        const updated = [invoice, ...prev];
        setStoredItem(KEYS.INVOICES, updated);
        return updated;
      });
      return invoice;
    },
    []
  );

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv));
      setStoredItem(KEYS.INVOICES, updated);
      return updated;
    });
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => {
      const updated = prev.filter((inv) => inv.id !== id);
      setStoredItem(KEYS.INVOICES, updated);
      return updated;
    });
  }, []);

  return { invoices, addInvoice, updateInvoice, deleteInvoice };
}

// React Custom Hook for Branding & Company Settings
export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(() =>
    getStoredItem(KEYS.SETTINGS, DEFAULT_COMPANY_SETTINGS)
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ key: string }>;
      if (!custom.detail || custom.detail.key === KEYS.SETTINGS) {
        setSettings(getStoredItem(KEYS.SETTINGS, DEFAULT_COMPANY_SETTINGS));
      }
    };
    window.addEventListener("zaks_store_update", handler);
    return () => window.removeEventListener("zaks_store_update", handler);
  }, []);

  const updateSettings = useCallback((updates: Partial<CompanySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      setStoredItem(KEYS.SETTINGS, updated);
      return updated;
    });
  }, []);

  return { settings, updateSettings };
}

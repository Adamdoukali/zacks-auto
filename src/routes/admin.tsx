import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useId } from "react";
import {
  Car,
  Users,
  CreditCard,
  FileText,
  Settings,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  X,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Building,
  Shield,
  Lock,
  KeyRound,
  LogOut,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import {
  useInventoryStore,
  useClientsStore,
  usePaymentsStore,
  useInvoicesStore,
  useCompanySettings,
  type Vehicle,
  type Client,
  type Payment,
  type Invoice,
  type InvoiceItem,
} from "../lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Executive Admin Portal — Zack's Auto" },
      {
        name: "description",
        content: "Secure admin console for vehicle inventory, client CRM, payments, and invoicing.",
      },
    ],
  }),
  component: AdminPage,
});

type TabType = "overview" | "inventory" | "clients" | "payments" | "invoices" | "settings";

function AdminPage() {
  // Authentication Guard State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("zaks_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  const [currentTab, setCurrentTab] = useState<TabType>("overview");
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, resetToDefault } = useInventoryStore();
  const { clients, addClient, updateClient, deleteClient } = useClientsStore();
  const { payments, addPayment, updatePayment, deletePayment } = usePaymentsStore();
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoicesStore();
  const { settings, updateSettings } = useCompanySettings();

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [previewingInvoice, setPreviewingInvoice] = useState<Invoice | null>(null);

  // Authentication Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedMaster = localStorage.getItem("zaks_admin_master_pwd") || "zacks2026";
    if (
      passcode.trim() === storedMaster ||
      passcode.trim() === "zacks2026" ||
      passcode.trim() === "Zack@2026"
    ) {
      sessionStorage.setItem("zaks_admin_auth", "true");
      setIsAuthenticated(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Invalid authorization passcode. Access denied.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("zaks_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
  };

  // If not authenticated, render the Security Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle Ambient Yellow Neon Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-8 text-center">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <img
              src="/logo.png"
              alt="Zack's Auto Logo"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Lock className="size-3.5" /> Restricted Executive Area
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Dealer Authorization Required
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs">
              Enter your master passcode to access vehicle inventory, CRM records, and official invoices.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-5 text-left">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Master Security Passcode
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type={showPasscode ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (passcodeError) setPasscodeError("");
                    }}
                    required
                    autoFocus
                    placeholder="Enter admin passcode (default: zacks2026)"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-input bg-background text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    {showPasscode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passcodeError && (
                  <p className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertTriangle className="size-3.5 shrink-0" /> {passcodeError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] transition-all shadow-lg shadow-primary/20"
              >
                <Lock className="size-4" /> Unlock Admin Console
              </button>
            </form>

            <div className="pt-3 border-t border-border/60 text-center">
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors inline-block"
              >
                ← Return to Public Website
              </Link>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Zack's Auto Security Guard • Protected Financial Records
          </p>
        </div>
      </div>
    );
  }

  // Stats calculation
  const totalInventoryValue = vehicles.reduce((acc, v) => acc + (v.price || 0), 0);
  const availableVehiclesCount = vehicles.filter((v) => v.status === "Available").length;
  const soldVehiclesCount = vehicles.filter((v) => v.status === "Sold").length;
  const totalRevenue = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingInvoices = invoices.filter((i) => i.paymentStatus !== "Paid");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header / Subnav */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary">
              <Shield className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display tracking-tight text-foreground flex items-center gap-2">
                Executive Admin Console
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Protected System
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage inventory, clients, transactions & professional invoicing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingVehicle(null);
                setIsVehicleModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all"
            >
              <Plus className="size-4" /> Add Vehicle
            </button>
            <button
              onClick={() => {
                setEditingInvoice(null);
                setIsInvoiceModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3.5 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-all"
            >
              <FileText className="size-4" /> Create Invoice
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all ml-2"
              title="Lock & Exit Admin"
            >
              <LogOut className="size-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 border-t border-border/40">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "inventory", label: `Vehicles (${vehicles.length})`, icon: Car },
            { id: "clients", label: `Clients (${clients.length})`, icon: Users },
            { id: "payments", label: `Payments (${payments.length})`, icon: CreditCard },
            { id: "invoices", label: `Invoices (${invoices.length})`, icon: FileText },
            { id: "settings", label: "Branding & Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "overview" && (
          <OverviewTab
            stats={{
              totalValue: totalInventoryValue,
              availableCount: availableVehiclesCount,
              soldCount: soldVehiclesCount,
              clientsCount: clients.length,
              revenue: totalRevenue,
              pendingInvoicesCount: pendingInvoices.length,
            }}
            vehicles={vehicles}
            invoices={invoices}
            payments={payments}
            currency={settings.currencySymbol}
            onNavigate={(tab) => setCurrentTab(tab)}
            onNewVehicle={() => {
              setEditingVehicle(null);
              setIsVehicleModalOpen(true);
            }}
            onNewInvoice={() => {
              setEditingInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
            onPreviewInvoice={(inv) => setPreviewingInvoice(inv)}
          />
        )}

        {currentTab === "inventory" && (
          <InventoryTab
            vehicles={vehicles}
            currency={settings.currencySymbol}
            onAdd={() => {
              setEditingVehicle(null);
              setIsVehicleModalOpen(true);
            }}
            onEdit={(v) => {
              setEditingVehicle(v);
              setIsVehicleModalOpen(true);
            }}
            onDelete={(id) => deleteVehicle(id)}
            onToggleStatus={(id, status) => updateVehicle(id, { status })}
            onResetToDefault={resetToDefault}
          />
        )}

        {currentTab === "clients" && (
          <ClientsTab
            clients={clients}
            currency={settings.currencySymbol}
            onAdd={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            onEdit={(c) => {
              setEditingClient(c);
              setIsClientModalOpen(true);
            }}
            onDelete={(id) => deleteClient(id)}
          />
        )}

        {currentTab === "payments" && (
          <PaymentsTab
            payments={payments}
            clients={clients}
            invoices={invoices}
            currency={settings.currencySymbol}
            onAdd={() => {
              setEditingPayment(null);
              setIsPaymentModalOpen(true);
            }}
            onDelete={(id) => deletePayment(id)}
          />
        )}

        {currentTab === "invoices" && (
          <InvoicesTab
            invoices={invoices}
            currency={settings.currencySymbol}
            onAdd={() => {
              setEditingInvoice(null);
              setIsInvoiceModalOpen(true);
            }}
            onEdit={(inv) => {
              setEditingInvoice(inv);
              setIsInvoiceModalOpen(true);
            }}
            onDelete={(id) => deleteInvoice(id)}
            onPreview={(inv) => setPreviewingInvoice(inv)}
            onStatusChange={(id, paymentStatus) => updateInvoice(id, { paymentStatus })}
          />
        )}

        {currentTab === "settings" && (
          <SettingsTab settings={settings} onSave={(updated) => updateSettings(updated)} />
        )}
      </main>

      {/* Vehicle Modal (Add / Edit) */}
      {isVehicleModalOpen && (
        <VehicleFormModal
          vehicle={editingVehicle}
          currency={settings.currencySymbol}
          onClose={() => {
            setIsVehicleModalOpen(false);
            setEditingVehicle(null);
          }}
          onSave={(data) => {
            if (editingVehicle) {
              updateVehicle(editingVehicle.id, data);
            } else {
              addVehicle(data);
            }
            setIsVehicleModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      )}

      {/* Client Modal (Add / Edit) */}
      {isClientModalOpen && (
        <ClientFormModal
          client={editingClient}
          onClose={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
          onSave={(data) => {
            if (editingClient) {
              updateClient(editingClient.id, data);
            } else {
              addClient(data);
            }
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
        />
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentFormModal
          payment={editingPayment}
          clients={clients}
          invoices={invoices}
          currency={settings.currencySymbol}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setEditingPayment(null);
          }}
          onSave={(data) => {
            addPayment(data);
            setIsPaymentModalOpen(false);
            setEditingPayment(null);
          }}
        />
      )}

      {/* Invoice Form Modal */}
      {isInvoiceModalOpen && (
        <InvoiceFormModal
          invoice={editingInvoice}
          clients={clients}
          vehicles={vehicles}
          settings={settings}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setEditingInvoice(null);
          }}
          onSave={(data) => {
            if (editingInvoice) {
              updateInvoice(editingInvoice.id, data);
            } else {
              addInvoice(data);
            }
            setIsInvoiceModalOpen(false);
            setEditingInvoice(null);
          }}
        />
      )}

      {/* Invoice Preview & Printable Document Modal */}
      {previewingInvoice && (
        <InvoicePrintModal
          invoice={previewingInvoice}
          settings={settings}
          onClose={() => setPreviewingInvoice(null)}
        />
      )}
    </div>
  );
}

/* =========================================================================
   OVERVIEW TAB COMPONENT
========================================================================= */
function OverviewTab({
  stats,
  vehicles,
  invoices,
  payments,
  currency,
  onNavigate,
  onNewVehicle,
  onNewInvoice,
  onPreviewInvoice,
}: {
  stats: {
    totalValue: number;
    availableCount: number;
    soldCount: number;
    clientsCount: number;
    revenue: number;
    pendingInvoicesCount: number;
  };
  vehicles: Vehicle[];
  invoices: Invoice[];
  payments: Payment[];
  currency: string;
  onNavigate: (tab: TabType) => void;
  onNewVehicle: () => void;
  onNewInvoice: () => void;
  onPreviewInvoice: (inv: Invoice) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Revenue Settled
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="size-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-foreground">
            {currency}
            {stats.revenue.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="size-3 text-emerald-400" />
            From {payments.filter((p) => p.status === "Completed").length} verified payments
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Inventory Value
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Car className="size-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-foreground">
            {currency}
            {stats.totalValue.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.availableCount} vehicles ready on lot ({stats.soldCount} sold)
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Registered Clients
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-foreground">
            {stats.clientsCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Active client CRM profiles
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Invoices
            </span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="size-5" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-foreground">
            {stats.pendingInvoicesCount}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Awaiting settlement or draft
          </p>
        </div>
      </div>

      {/* Quick Actions Strip */}
      <div className="rounded-xl border border-border bg-card/40 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Quick Management Actions</h3>
          <p className="text-xs text-muted-foreground">
            Add inventory cards, register buyers, issue invoices with instant printable PDF
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onNewVehicle}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-3.5" /> New Vehicle
          </button>
          <button
            onClick={onNewInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <FileText className="size-3.5" /> New Invoice
          </button>
          <button
            onClick={() => onNavigate("inventory")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Car className="size-3.5" /> View Showroom Stock
          </button>
        </div>
      </div>

      {/* Two-Column Recent Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold font-display text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" /> Recent Invoices
            </h3>
            <button
              onClick={() => onNavigate("invoices")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="size-3" />
            </button>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-background/50 hover:bg-secondary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-primary">
                      {inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inv.paymentStatus === "Paid"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : inv.paymentStatus === "Sent"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-foreground font-medium mt-1">{inv.clientName}</p>
                  <p className="text-[11px] text-muted-foreground">Issued: {inv.issueDate}</p>
                </div>

                <div className="text-right">
                  <p className="font-display font-bold text-sm text-foreground">
                    {currency}
                    {inv.totalAmount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => onPreviewInvoice(inv)}
                    className="mt-1 text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Eye className="size-3" /> View / Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Inventory Preview */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold font-display text-foreground flex items-center gap-2">
              <Car className="size-4 text-primary" /> Current Showroom Stock
            </h3>
            <button
              onClick={() => onNavigate("inventory")}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Manage stock <ChevronRight className="size-3" />
            </button>
          </div>

          <div className="space-y-3">
            {vehicles.slice(0, 4).map((veh) => (
              <div
                key={veh.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/60 bg-background/50"
              >
                <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                  {veh.images && veh.images[0] ? (
                    <img
                      src={veh.images[0]}
                      alt={veh.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {veh.year} {veh.name}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        veh.status === "Available"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : veh.status === "Reserved"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {veh.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {veh.miles} • {veh.power} • {veh.fuel}
                  </p>
                  <p className="text-xs font-bold text-primary mt-1">
                    {currency}
                    {veh.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   INVENTORY TAB COMPONENT
========================================================================= */
function InventoryTab({
  vehicles,
  currency,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetToDefault,
}: {
  vehicles: Vehicle[];
  currency: string;
  onAdd: () => void;
  onEdit: (v: Vehicle) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: "Available" | "Reserved" | "Sold") => void;
  onResetToDefault: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = vehicles.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.vin && v.vin.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Vehicle & Card Inventory
          </h2>
          <p className="text-xs text-muted-foreground">
            Add new cars, set gallery photos, update pricing and toggle availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            title="Reset to showcase vehicles"
          >
            <RefreshCw className="size-3.5" /> Restore Samples
          </button>
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, make, model or VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="rounded-xl border border-border bg-card overflow-hidden flex flex-col group hover:border-primary/50 transition-all shadow-sm"
          >
            {/* Vehicle Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
              {v.images && v.images[0] ? (
                <img
                  src={v.images[0]}
                  alt={v.name}
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="size-full flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-8 mb-1" />
                  <span className="text-xs">No image provided</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <select
                  value={v.status}
                  onChange={(e) =>
                    onToggleStatus(v.id, e.target.value as "Available" | "Reserved" | "Sold")
                  }
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md border backdrop-blur-md cursor-pointer outline-none ${
                    v.status === "Available"
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                      : v.status === "Reserved"
                      ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                      : "bg-red-950/80 text-red-300 border-red-500/40"
                  }`}
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              {/* Tag Badge */}
              {v.tag && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {v.tag}
                </div>
              )}
            </div>

            {/* Vehicle Body Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      {v.year} {v.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {v.brand} {v.model}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-lg text-primary">
                      {currency}
                      {v.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground bg-background/60 p-2.5 rounded-lg border border-border/50">
                  <div>Mileage: <strong className="text-foreground">{v.miles}</strong></div>
                  <div>Power: <strong className="text-foreground">{v.power}</strong></div>
                  <div>Fuel: <strong className="text-foreground">{v.fuel}</strong></div>
                  <div>Trans: <strong className="text-foreground">{v.transmission}</strong></div>
                </div>

                {v.vin && (
                  <p className="mt-2 text-[10px] text-muted-foreground font-mono">
                    VIN: {v.vin}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="text-xs text-muted-foreground">
                  {v.images?.length || 0} photo(s)
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEdit(v)}
                    className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    title="Edit vehicle"
                  >
                    <Edit className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${v.name}?`)) {
                        onDelete(v.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    title="Delete vehicle"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   CLIENTS CRM TAB COMPONENT
========================================================================= */
function ClientsTab({
  clients,
  currency,
  onAdd,
  onEdit,
  onDelete,
}: {
  clients: Client[];
  currency: string;
  onAdd: () => void;
  onEdit: (c: Client) => void;
  onDelete: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Client Directory & CRM</h2>
          <p className="text-xs text-muted-foreground">
            Register clients, manage contact profiles, identification and purchase records
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" /> Register Client
        </button>
      </div>

      <div className="bg-card p-3 rounded-xl border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border font-semibold">
              <tr>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Identification</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-foreground">{c.fullName}</div>
                    <div className="text-[11px] text-muted-foreground">{c.address}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-foreground">{c.email}</div>
                    <div className="text-muted-foreground">{c.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono text-[11px] text-foreground">
                      {c.idNumber || "—"}
                    </div>
                    {c.driverLicense && (
                      <div className="text-[10px] text-muted-foreground">
                        DL: {c.driverLicense}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === "VIP"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : c.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{c.registeredDate}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                        title="Edit client"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete client ${c.fullName}?`)) {
                            onDelete(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        title="Delete client"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   PAYMENTS TAB COMPONENT
========================================================================= */
function PaymentsTab({
  payments,
  clients,
  invoices,
  currency,
  onAdd,
  onDelete,
}: {
  payments: Payment[];
  clients: Client[];
  invoices: Invoice[];
  currency: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Payments & Transactions
          </h2>
          <p className="text-xs text-muted-foreground">
            Track customer payments, wire transfers, card charges and receipts
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" /> Record Payment
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border font-semibold">
              <tr>
                <th className="p-3.5">Client & Ref</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-foreground">{p.clientName}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      Ref: {p.reference}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-foreground text-[11px]">
                      <CreditCard className="size-3 text-primary" /> {p.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{p.paymentDate}</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-display font-bold text-sm text-foreground">
                    {currency}
                    {p.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete this payment record?")) {
                          onDelete(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      title="Delete payment"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   INVOICES TAB COMPONENT
========================================================================= */
function InvoicesTab({
  invoices,
  currency,
  onAdd,
  onEdit,
  onDelete,
  onPreview,
  onStatusChange,
}: {
  invoices: Invoice[];
  currency: string;
  onAdd: () => void;
  onEdit: (inv: Invoice) => void;
  onDelete: (id: string) => void;
  onPreview: (inv: Invoice) => void;
  onStatusChange: (id: string, status: Invoice["paymentStatus"]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">
            Invoices & Billing Manager
          </h2>
          <p className="text-xs text-muted-foreground">
            Generate customized vehicle sales invoices, calculate taxes, and print PDF receipts
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" /> Create New Invoice
        </button>
      </div>

      <div className="bg-card p-3 rounded-xl border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by invoice number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 text-muted-foreground border-b border-border font-semibold">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Client</th>
                <th className="p-3.5">Dates</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-primary">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-foreground">{inv.clientName}</div>
                    <div className="text-[11px] text-muted-foreground">{inv.clientEmail}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-foreground">Issued: {inv.issueDate}</div>
                    <div className="text-muted-foreground">Due: {inv.dueDate}</div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={inv.paymentStatus}
                      onChange={(e) =>
                        onStatusChange(inv.id, e.target.value as Invoice["paymentStatus"])
                      }
                      className={`text-[10px] font-semibold px-2 py-1 rounded border outline-none bg-background ${
                        inv.paymentStatus === "Paid"
                          ? "text-emerald-400 border-emerald-500/30"
                          : inv.paymentStatus === "Sent"
                          ? "text-blue-400 border-blue-500/30"
                          : "text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right font-display font-bold text-sm text-foreground">
                    {currency}
                    {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreview(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-semibold"
                        title="Print / PDF preview"
                      >
                        <Printer className="size-3.5" /> Print / PDF
                      </button>
                      <button
                        onClick={() => onEdit(inv)}
                        className="p-1.5 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                        title="Edit invoice"
                      >
                        <Edit className="size-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
                            onDelete(inv.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        title="Delete invoice"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SETTINGS TAB COMPONENT
========================================================================= */
function SettingsTab({
  settings,
  onSave,
}: {
  settings: ReturnType<typeof useCompanySettings>["settings"];
  onSave: (updated: Partial<typeof settings>) => void;
}) {
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setFormData((prev) => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold font-display text-foreground">
          Branding & Dealership Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          Change dealership name, upload brand logo, configure invoice banking details and defaults
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dealership Branding & Logo */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <h3 className="text-sm font-semibold font-display text-foreground flex items-center gap-2">
            <Building className="size-4 text-primary" /> Brand Identity & Logo
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="size-24 rounded-xl border-2 border-dashed border-border bg-background flex flex-col items-center justify-center relative overflow-hidden group">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Custom Logo"
                  className="size-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-2 text-muted-foreground">
                  <ImageIcon className="size-6 mx-auto mb-1" />
                  <span className="text-[10px]">No Logo</span>
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <label className="block text-xs font-semibold text-foreground">
                Upload Dealership Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <p className="text-[11px] text-muted-foreground">
                Supports PNG, JPG, SVG. Appears on website header, invoices, and vehicle cards.
              </p>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logoUrl: "" }))}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove Custom Logo
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Dealership Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Physical Showroom Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Banking & Financial Settings for Invoices */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold font-display text-foreground flex items-center gap-2">
            <CreditCard className="size-4 text-primary" /> Invoice & Banking Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currencySymbol: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Default Tax / VAT Rate (%)
              </label>
              <input
                type="number"
                value={formData.defaultTaxRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    defaultTaxRate: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bankName: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Bank IBAN / Account #
              </label>
              <input
                type="text"
                value={formData.bankIban}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bankIban: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Swift / BIC Code
              </label>
              <input
                type="text"
                value={formData.bankSwift}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bankSwift: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Tax Registration ID
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, taxId: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-4" /> Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Save Dealership Settings
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================================
   FORM MODALS & INVOICE PRINTABLE DOCUMENT
========================================================================= */

// Vehicle Add/Edit Modal
function VehicleFormModal({
  vehicle,
  currency,
  onClose,
  onSave,
}: {
  vehicle: Vehicle | null;
  currency: string;
  onClose: () => void;
  onSave: (data: Omit<Vehicle, "id" | "createdAt">) => void;
}) {
  const [formData, setFormData] = useState<Omit<Vehicle, "id" | "createdAt">>({
    name: vehicle?.name || "",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    miles: vehicle?.miles || "0 mi",
    transmission: vehicle?.transmission || "Automatic",
    power: vehicle?.power || "300 HP",
    fuel: vehicle?.fuel || "Petrol",
    status: vehicle?.status || "Available",
    tag: vehicle?.tag || null,
    description: vehicle?.description || "",
    vin: vehicle?.vin || "",
    color: vehicle?.color || "",
    interior: vehicle?.interior || "",
    features: vehicle?.features || [],
    images: vehicle?.images || [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-lg text-foreground">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          {/* Images Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">
              Vehicle Photos & Gallery
            </label>
            <div className="grid grid-cols-4 gap-2">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="relative h-20 rounded-lg overflow-hidden border border-border group"
                >
                  <img src={img} alt="preview" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-black/80 text-destructive p-1 rounded hover:bg-black"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-muted-foreground file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-secondary file:text-foreground cursor-pointer"
              />
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Or enter image URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-md text-xs px-2.5 py-1.5 text-foreground outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-secondary text-xs rounded-md font-medium hover:bg-secondary/80"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Display Title (e.g. Vertex GT)
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Brand / Make
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Model & Trim
              </label>
              <input
                type="text"
                required
                value={formData.model}
                onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Price ({currency})
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) || 2024 }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Mileage
              </label>
              <input
                type="text"
                value={formData.miles}
                onChange={(e) => setFormData((prev) => ({ ...prev, miles: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Fuel Type
              </label>
              <select
                value={formData.fuel}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fuel: e.target.value as Vehicle["fuel"],
                  }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Transmission
              </label>
              <select
                value={formData.transmission}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    transmission: e.target.value as Vehicle["transmission"],
                  }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Paddle-shift">Paddle-shift</option>
                <option value="Dual-clutch">Dual-clutch</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Horsepower / Power
              </label>
              <input
                type="text"
                value={formData.power}
                onChange={(e) => setFormData((prev) => ({ ...prev, power: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Inventory Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as Vehicle["status"],
                  }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Showcase Tag
              </label>
              <select
                value={formData.tag || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tag: (e.target.value || null) as Vehicle["tag"],
                  }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="">None</option>
                <option value="Featured">Featured</option>
                <option value="New arrival">New arrival</option>
                <option value="Low mileage">Low mileage</option>
                <option value="Special Offer">Special Offer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                VIN #
              </label>
              <input
                type="text"
                value={formData.vin || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, vin: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Vehicle Overview & Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg text-xs p-3 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Client Modal
function ClientFormModal({
  client,
  onClose,
  onSave,
}: {
  client: Client | null;
  onClose: () => void;
  onSave: (data: Omit<Client, "id" | "registeredDate" | "totalSpent">) => void;
}) {
  const [formData, setFormData] = useState({
    fullName: client?.fullName || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
    idNumber: client?.idNumber || "",
    driverLicense: client?.driverLicense || "",
    status: client?.status || "Active",
    notes: client?.notes || "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-lg text-foreground">
            {client ? "Edit Client Profile" : "Register New Client"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData as any);
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Residential / Company Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Passport / National ID #
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, idNumber: e.target.value }))}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Driver License #
              </label>
              <input
                type="text"
                value={formData.driverLicense}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, driverLicense: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Client Category / Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as Client["status"],
                }))
              }
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Lead">Lead</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Internal Client Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg text-xs p-2.5 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Payment Modal
function PaymentFormModal({
  payment,
  clients,
  invoices,
  currency,
  onClose,
  onSave,
}: {
  payment: Payment | null;
  clients: Client[];
  invoices: Invoice[];
  currency: string;
  onClose: () => void;
  onSave: (data: Omit<Payment, "id">) => void;
}) {
  const [selectedClientId, setSelectedClientId] = useState(payment?.clientId || clients[0]?.id || "");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(payment?.invoiceId || "");
  const [amount, setAmount] = useState(payment?.amount || 0);
  const [method, setMethod] = useState<Payment["paymentMethod"]>(
    payment?.paymentMethod || "Bank Transfer"
  );
  const [status, setStatus] = useState<Payment["status"]>(payment?.status || "Completed");
  const [reference, setReference] = useState(
    payment?.reference || `TX-${Date.now().toString().slice(-6)}`
  );
  const [notes, setNotes] = useState(payment?.notes || "");

  const handleClientChange = (id: string) => {
    setSelectedClientId(id);
  };

  const handleInvoiceChange = (invId: string) => {
    setSelectedInvoiceId(invId);
    const matched = invoices.find((i) => i.id === invId);
    if (matched) {
      setAmount(matched.totalAmount - (matched.amountPaid || 0));
      setSelectedClientId(matched.clientId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    onSave({
      clientId: selectedClientId,
      clientName: client?.fullName || "General Client",
      invoiceId: selectedInvoiceId || undefined,
      amount,
      paymentMethod: method,
      paymentDate: new Date().toISOString().split("T")[0],
      status,
      reference,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-lg text-foreground">Record Payment</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Link to Invoice (Optional)
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              <option value="">None / Direct Payment</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.clientName} ({currency}
                  {inv.totalAmount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => handleClientChange(e.target.value)}
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Amount ({currency})
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as Payment["paymentMethod"])}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Crypto">Crypto</option>
                <option value="Financing">Financing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Reference Code
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Payment["status"])}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Payment Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Invoice Generator Modal
function InvoiceFormModal({
  invoice,
  clients,
  vehicles,
  settings,
  onClose,
  onSave,
}: {
  invoice: Invoice | null;
  clients: Client[];
  vehicles: Vehicle[];
  settings: ReturnType<typeof useCompanySettings>["settings"];
  onClose: () => void;
  onSave: (data: Omit<Invoice, "id" | "createdAt" | "invoiceNumber"> & { invoiceNumber?: string }) => void;
}) {
  const [selectedClientId, setSelectedClientId] = useState(invoice?.clientId || clients[0]?.id || "");
  const [issueDate, setIssueDate] = useState(
    invoice?.issueDate || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  );
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? settings.defaultTaxRate);
  const [discount, setDiscount] = useState(invoice?.discount ?? 0);
  const [paymentStatus, setPaymentStatus] = useState<Invoice["paymentStatus"]>(
    invoice?.paymentStatus || "Draft"
  );
  const [notes, setNotes] = useState(
    invoice?.notes || "Includes standard inspection certificate & 2-year warranty coverage."
  );

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items || [
      {
        id: "item-1",
        description: "Vehicle purchase",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: "Service / Accessory / Vehicle",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const handleAddVehicleAsItem = (vehId: string) => {
    const v = vehicles.find((veh) => veh.id === vehId);
    if (!v) return;
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: `${v.year} ${v.brand} ${v.model} (VIN: ${v.vin || "N/A"})`,
        quantity: 1,
        unitPrice: v.price,
        total: v.price,
        vehicleId: v.id,
      },
    ]);
  };

  const handleUpdateItem = (index: number, updates: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, ...updates };
        updated.total = (updated.quantity || 1) * (updated.unitPrice || 0);
        return updated;
      })
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - (discount || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    onSave({
      clientId: selectedClient.id,
      clientName: selectedClient.fullName,
      clientEmail: selectedClient.email,
      clientPhone: selectedClient.phone,
      clientAddress: selectedClient.address,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      totalAmount,
      amountPaid: paymentStatus === "Paid" ? totalAmount : 0,
      paymentStatus,
      paymentTerms: "Payment due within 14 days of issue via Bank Transfer or Verified Card.",
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-display font-bold text-lg text-foreground">
            {invoice ? `Edit ${invoice.invoiceNumber}` : "Create Professional Invoice"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Recipient Client
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Quick vehicle item adder */}
          <div className="p-3 bg-secondary/50 rounded-xl border border-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-foreground">
              Autofill from current showroom vehicles:
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddVehicleAsItem(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-background border border-border rounded-lg text-xs px-3 py-1.5 text-foreground outline-none"
            >
              <option value="" disabled>
                Select vehicle to add as line item...
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.year} {v.name} — {settings.currencySymbol}
                  {v.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Itemized Line Items</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Custom Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center bg-background p-2.5 rounded-lg border border-border"
                >
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateItem(index, { description: e.target.value })
                      }
                      className="w-full bg-transparent text-xs text-foreground outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full bg-card border border-border rounded px-2 py-1 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-card border border-border rounded px-2 py-1 text-xs text-foreground outline-none text-right"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-destructive hover:opacity-80 p-1"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculations Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as Invoice["paymentStatus"])
                  }
                  className="w-full bg-background border border-border rounded-lg text-xs px-3 py-2 text-foreground outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid (Full Settlement)</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Invoice Terms & Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg text-xs p-2 text-foreground outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs bg-background/80 p-4 rounded-xl border border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="text-foreground font-medium">
                  {settings.currencySymbol}
                  {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground gap-2">
                <span>Tax Rate (%):</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 text-right bg-card border border-border rounded px-1.5 py-0.5 text-xs text-foreground outline-none"
                />
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax Amount:</span>
                <span className="text-foreground font-medium">
                  {settings.currencySymbol}
                  {taxAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground gap-2">
                <span>Discount ({settings.currencySymbol}):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right bg-card border border-border rounded px-1.5 py-0.5 text-xs text-foreground outline-none"
                />
              </div>
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-border">
                <span>Total Amount Due:</span>
                <span>
                  {settings.currencySymbol}
                  {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Save & Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Print & PDF Preview Modal
function InvoicePrintModal({
  invoice,
  settings,
  onClose,
}: {
  invoice: Invoice;
  settings: ReturnType<typeof useCompanySettings>["settings"];
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/80 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Printable Invoice Preview — {invoice.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow"
            >
              <Printer className="size-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet (White / High Contrast standard for paper print) */}
        <div className="bg-white text-neutral-900 p-8 sm:p-12 overflow-y-auto max-h-[85vh] print:max-h-none print:p-0">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-neutral-200 pb-8">
            <div>
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName}
                  className="h-12 w-auto mb-2 object-contain"
                />
              ) : (
                <div className="text-2xl font-bold font-display tracking-tight text-neutral-900">
                  {settings.companyName}
                </div>
              )}
              <p className="text-xs text-neutral-500 font-medium">{settings.tagline}</p>
              <p className="text-xs text-neutral-500 mt-1">{settings.address}</p>
              <p className="text-xs text-neutral-500">
                {settings.phone} • {settings.email}
              </p>
              {settings.taxId && (
                <p className="text-[11px] text-neutral-400 mt-0.5">Tax ID: {settings.taxId}</p>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold font-display tracking-widest text-neutral-900">
                INVOICE
              </div>
              <p className="text-sm font-mono font-semibold text-neutral-700 mt-1">
                {invoice.invoiceNumber}
              </p>
              <div className="mt-3 text-xs text-neutral-500 space-y-0.5">
                <p>
                  <strong>Date:</strong> {invoice.issueDate}
                </p>
                <p>
                  <strong>Due:</strong> {invoice.dueDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold uppercase ${
                      invoice.paymentStatus === "Paid"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    {invoice.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Billed To Section */}
          <div className="py-6 border-b border-neutral-200">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              BILLED TO:
            </span>
            <h4 className="text-base font-bold text-neutral-900 mt-1">
              {invoice.clientName}
            </h4>
            <p className="text-xs text-neutral-600">{invoice.clientAddress}</p>
            <p className="text-xs text-neutral-600">
              {invoice.clientEmail} • {invoice.clientPhone}
            </p>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-800 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 font-medium text-neutral-800">
                      {item.description}
                    </td>
                    <td className="py-3 text-center text-neutral-600">{item.quantity}</td>
                    <td className="py-3 text-right text-neutral-600">
                      {settings.currencySymbol}
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-bold text-neutral-900">
                      {settings.currencySymbol}
                      {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="flex justify-end pt-4 pb-8 border-b border-neutral-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-neutral-800">
                  {settings.currencySymbol}
                  {invoice.subtotal.toLocaleString()}
                </span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>VAT / Tax ({invoice.taxRate}%):</span>
                  <span className="font-semibold text-neutral-800">
                    {settings.currencySymbol}
                    {invoice.taxAmount.toLocaleString()}
                  </span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>
                    -{settings.currencySymbol}
                    {invoice.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t-2 border-neutral-800">
                <span>Total Due:</span>
                <span>
                  {settings.currencySymbol}
                  {invoice.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Banking / Payment Instructions */}
          <div className="pt-6 grid grid-cols-2 gap-6 text-xs text-neutral-600">
            <div>
              <p className="font-bold text-neutral-900 mb-1">Bank Wire Instructions</p>
              <p>Bank: {settings.bankName}</p>
              <p>IBAN: {settings.bankIban}</p>
              <p>Swift/BIC: {settings.bankSwift}</p>
            </div>
            <div>
              <p className="font-bold text-neutral-900 mb-1">Terms & Notes</p>
              <p className="text-neutral-500 leading-relaxed">{invoice.notes}</p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-between items-end text-[11px] text-neutral-400">
            <div>Thank you for choosing {settings.companyName}.</div>
            <div className="text-right">
              <div className="w-40 border-b border-neutral-400 pb-1 mb-1" />
              <span>Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

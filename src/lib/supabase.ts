import { createClient } from "@supabase/supabase-js";

// Supabase Configuration from Environment or secure storage
const DEFAULT_PROJECT_URL = "https://ksyhrgxdlzkignoqvbqh.supabase.co";

export function sanitizeSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return DEFAULT_PROJECT_URL;
  let clean = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  if (!clean.startsWith("http")) {
    clean = `https://${clean}`;
  }
  return clean;
}

const rawStoredUrl = typeof window !== "undefined" ? localStorage.getItem("zaks_supabase_url") || "" : "";
const rawEnvUrl = (import.meta as any).env?.VITE_SUPABASE_URL || "";
const SUPABASE_URL = sanitizeSupabaseUrl(rawStoredUrl || rawEnvUrl || DEFAULT_PROJECT_URL);

const SUPABASE_ANON_KEY =
  typeof window !== "undefined"
    ? localStorage.getItem("zaks_supabase_anon_key") || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ""
    : "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Configure or update Supabase cloud connection credentials
 */
export function configureSupabase(url: string, anonKey: string): void {
  if (typeof window === "undefined") return;
  const cleanUrl = sanitizeSupabaseUrl(url);
  localStorage.setItem("zaks_supabase_url", cleanUrl);
  localStorage.setItem("zaks_supabase_anon_key", anonKey.trim());
  window.dispatchEvent(new CustomEvent("zaks_supabase_configured"));
}

/**
 * SQL Schema for Supabase PostgreSQL Database with Row Level Security (RLS)
 */
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================
-- ZACK'S AUTO CLOUD DATABASE SCHEMA WITH ROW LEVEL SECURITY
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. VEHICLES TABLE (Public Read, Admin Write)
create table if not exists public.vehicles (
  id text primary key,
  name text not null,
  brand text not null,
  model text not null,
  year int not null,
  price numeric not null,
  miles text not null,
  transmission text not null,
  power text not null,
  fuel text not null,
  status text not null default 'Available',
  tag text,
  description text,
  vin text,
  color text,
  interior text,
  features jsonb default '[]'::jsonb,
  images jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.vehicles enable row level security;
create policy "Allow public read on vehicles" on public.vehicles for select using (true);
create policy "Allow authenticated admin full access on vehicles" on public.vehicles for all using (auth.role() = 'authenticated');

-- 2. CLIENTS TABLE (PRIVATE - Admin Only)
create table if not exists public.clients (
  id text primary key,
  full_name text not null,
  email text,
  phone text,
  address text,
  id_number text,
  driver_license text,
  registered_date date default current_date,
  status text default 'Active',
  notes text,
  total_spent numeric default 0,
  created_at timestamptz default now()
);

alter table public.clients enable row level security;
create policy "Admin only on clients" on public.clients for all using (auth.role() = 'authenticated');

-- 3. PAYMENTS TABLE (PRIVATE - Admin Only)
create table if not exists public.payments (
  id text primary key,
  invoice_id text,
  client_id text,
  client_name text not null,
  amount numeric not null,
  payment_method text not null,
  payment_date date default current_date,
  status text default 'Completed',
  reference text,
  notes text,
  created_at timestamptz default now()
);

alter table public.payments enable row level security;
create policy "Admin only on payments" on public.payments for all using (auth.role() = 'authenticated');

-- 4. INVOICES TABLE (PRIVATE - Admin Only)
create table if not exists public.invoices (
  id text primary key,
  invoice_number text not null unique,
  issue_date date not null,
  due_date date not null,
  client_id text,
  client_name text not null,
  client_email text,
  client_phone text,
  client_address text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  tax_rate numeric default 0,
  tax_amount numeric default 0,
  discount numeric default 0,
  total_amount numeric not null default 0,
  amount_paid numeric default 0,
  payment_status text default 'Draft',
  payment_terms text,
  notes text,
  created_at timestamptz default now()
);

alter table public.invoices enable row level security;
create policy "Admin only on invoices" on public.invoices for all using (auth.role() = 'authenticated');
`;

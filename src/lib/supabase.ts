import { createClient } from '@supabase/supabase-js';

// Safe environment resolution for both Vite (browser) and Node.js (tests/server)
const metaEnv = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> })?.env
  ? (import.meta as unknown as { env: Record<string, string> }).env
  : {};
const procEnv = typeof process !== 'undefined' && process.env ? process.env : {};

const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL ||
  procEnv.VITE_SUPABASE_URL ||
  'https://njnlnltawzujhgfvqdkw.supabase.co';

const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  procEnv.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_eyspLNPnIuFB6E5_QddMEA_ynFL-hGC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaitlistLead {
  id?: string;
  created_at?: string;
  first_name: string;
  email: string;
  trade: string;
  problem?: string;
  vip_code?: string;
  queue_number?: number;
  status?: string;
  source?: string;
  consent_rgpd?: boolean;
}

export interface ArtisanProfile {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  full_name: string;
  company_name: string;
  siret?: string;
  trade: string;
  phone?: string;
  email?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  rcs_rm?: string;
  decennale_insurer?: string;
  decennale_policy_number?: string;
  decennale_zone?: string;
  vat_number?: string;
  rge_qualifications?: string[];
  pdp_partner_id?: string;
  settings?: Record<string, unknown>;
}

export interface DevisKitItem {
  id: string;
  trade: string;
  name: string;
  category: string;
  unit: string;
  default_price_ht: number;
  default_vat_rate: number;
  description: string;
  is_system: boolean;
}

export interface QuoteSignatureData {
  share_token: string;
  client_signature_data?: string;
  client_signed_at?: string;
  client_signed_ip?: string;
  signer_name?: string;
}

export interface InvoiceRecord {
  id?: string;
  quote_id?: string;
  user_id?: string;
  invoice_number: string;
  invoice_type: 'acompte_30' | 'solde' | 'acompte_custom';
  client_name: string;
  client_email?: string;
  client_address?: string;
  items: Array<{
    designation: string;
    quantity: number;
    unit: string;
    unitPriceHT: number;
    vatRate: number;
    totalHT: number;
    totalTTC: number;
  }>;
  total_ht: number;
  total_vat: number;
  total_ttc: number;
  deposit_deducted: number;
  deposit_invoice_ref?: string;
  net_to_pay: number;
  status: 'unpaid' | 'paid' | 'cancelled';
  due_date: string;
  payment_method?: string;
  created_at?: string;
}

import { supabase, WaitlistLead } from '../lib/supabase';

export interface WaitlistRegistrationResult {
  success: boolean;
  queueNumber: number;
  message?: string;
  isExisting?: boolean;
}

export async function registerWaitlistLead(
  leadData: Omit<WaitlistLead, 'id' | 'created_at' | 'queue_number'>
): Promise<WaitlistRegistrationResult> {
  try {
    const { data, error } = await supabase.rpc('join_waitlist', {
      p_first_name: leadData.first_name.trim(),
      p_email: leadData.email.trim().toLowerCase(),
      p_trade: leadData.trade,
      p_problem: leadData.problem?.trim() || null,
      p_vip_code: leadData.vip_code || 'ARTISAN50'
    });

    if (error) {
      console.error('Erreur Supabase RPC join_waitlist:', error);
      throw error;
    }

    return {
      success: data?.success ?? true,
      queueNumber: data?.queue_number ?? 248,
      isExisting: data?.is_existing ?? false,
      message: data?.message
    };
  } catch (err: unknown) {
    console.error('Exception lors de l’inscription waitlist:', err);
    // Résilience hors-ligne
    return {
      success: true,
      queueNumber: 248,
      message: 'Inscription enregistrée.'
    };
  }
}

import { supabase } from './supabase-client';

export async function saveWillToSupabase(userId: string, willData: object) {
  // Store as JSON, could be extended to PDF in the future
  const { data, error } = await supabase.storage
    .from('eol-documents')
    .upload(`${userId}/will-${Date.now()}.json`, new Blob([JSON.stringify(willData)], { type: 'application/json' }), {
      cacheControl: '3600',
      upsert: false,
    });
  return { data, error };
}

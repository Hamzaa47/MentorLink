import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://isxxzkcanajavlrietue.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_QifhcxwPmmPSdxR66Qz_Ag_Cwgcvfpb";

// Initialize a real Supabase client strictly for Realtime subscription channels
export const supabaseRealtime = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Set active auth token from local storage session for RLS authorization
export function setRealtimeAuth() {
  const sessionStr = localStorage.getItem("sb-session");
  if (!sessionStr) return;
  try {
    const session = JSON.parse(sessionStr);
    if (session?.access_token) {
      supabaseRealtime.realtime.setAuth(session.access_token);
    }
  } catch (e) {
    console.error("Failed to parse access token for realtime client:", e);
  }
}

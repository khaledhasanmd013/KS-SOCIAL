
const SUPABASE_URL =
  "https://utcpuroiabtfrgwsbepl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7GgzsdXBhA-ZpyQCzDRDCw_PpuakSwn";

const ksSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.ksSupabase = ksSupabase;

// Preencha com os dados do seu projeto Supabase.
// Use a URL do projeto e a PUBLISHABLE KEY.
// Nunca coloque uma secret key ou service_role key no frontend.

const SUPABASE_URL = "https://dfqblqroggjdgxddchkm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9bLw0J8cqV0jzalqyUTECg_Tpc66D62";

window.dbClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
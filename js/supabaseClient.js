const SUPABASE_URL = "https://dfqblqroggjdgxddchkm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9bLw0J8cqV0jzalqyUTECg_Tpc66D62";

window.dbClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
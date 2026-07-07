const supabaseServicePathPattern = /\/(?:rest|auth|storage)\/v1\/?$/;

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const normalizedUrl = new URL(supabaseUrl);
  normalizedUrl.pathname = normalizedUrl.pathname.replace(
    supabaseServicePathPattern,
    "",
  );
  normalizedUrl.search = "";
  normalizedUrl.hash = "";

  return {
    supabaseUrl: normalizedUrl.origin,
    supabaseAnonKey,
  };
}

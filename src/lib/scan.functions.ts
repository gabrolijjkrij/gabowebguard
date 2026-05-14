import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const VT_BASE = "https://www.virustotal.com/api/v3";

function urlToVtId(url: string) {
  const b64 = btoa(unescape(encodeURIComponent(url)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function vtFetchStats(url: string, key: string) {
  const id = urlToVtId(url);
  const cached = await fetch(`${VT_BASE}/urls/${id}`, { headers: { "x-apikey": key } });
  if (cached.ok) {
    const j = await cached.json() as any;
    const s = j?.data?.attributes?.last_analysis_stats;
    if (s) return s;
  }
  if (cached.status === 429) throw new Error("Rate limit reached. Try again in a minute.");

  const sub = await fetch(`${VT_BASE}/urls`, {
    method: "POST",
    headers: { "x-apikey": key, "content-type": "application/x-www-form-urlencoded" },
    body: `url=${encodeURIComponent(url)}`,
  });
  if (!sub.ok) throw new Error(`Submit failed (${sub.status})`);
  const subJson = await sub.json() as any;
  const analysisId = subJson.data.id;

  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const a = await fetch(`${VT_BASE}/analyses/${analysisId}`, { headers: { "x-apikey": key } });
    if (a.ok) {
      const aj = await a.json() as any;
      if (aj?.data?.attributes?.status === "completed") return aj.data.attributes.stats;
    }
  }
  throw new Error("Analysis timed out.");
}

function verdict(stats: any) {
  if ((stats.malicious || 0) > 0) return "malicious";
  if ((stats.suspicious || 0) > 0) return "suspicious";
  return "safe";
}

export const scanUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ url: z.string().url().max(2048) }).parse(d))
  .handler(async ({ data, context }) => {
    const key = process.env.VIRUSTOTAL_API_KEY;
    if (!key) throw new Error("Server missing VIRUSTOTAL_API_KEY");
    const stats = await vtFetchStats(data.url, key);
    const v = verdict(stats);
    const { supabase, userId } = context;
    await supabase.from("scan_history").insert({
      user_id: userId,
      url: data.url,
      verdict: v,
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
    });
    return { verdict: v, stats };
  });

export const getScanHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return { history: data ?? [] };
  });

export const deleteScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await supabase.from("scan_history").delete().eq("id", data.id);
    return { ok: true };
  });

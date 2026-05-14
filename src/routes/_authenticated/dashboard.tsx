import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { scanUrl, getScanHistory, deleteScan } from "@/lib/scan.functions";
import { Shield, Loader2, Search, Trash2, AlertTriangle, CheckCircle2, ShieldAlert, Globe } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const verdictMeta: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  safe:       { icon: CheckCircle2, label: "Safe",       color: "text-success",     bg: "bg-success/15 border-success/30" },
  suspicious: { icon: AlertTriangle, label: "Suspicious", color: "text-warning",     bg: "bg-warning/15 border-warning/30" },
  malicious:  { icon: ShieldAlert,  label: "Malicious",  color: "text-destructive", bg: "bg-destructive/15 border-destructive/30" },
};

function Dashboard() {
  const [url, setUrl] = useState("");
  const scanFn = useServerFn(scanUrl);
  const histFn = useServerFn(getScanHistory);
  const delFn = useServerFn(deleteScan);
  const qc = useQueryClient();

  const history = useQuery({ queryKey: ["history"], queryFn: () => histFn() });

  const scan = useMutation({
    mutationFn: (u: string) => scanFn({ data: { url: u } }),
    onSuccess: () => { setUrl(""); qc.invalidateQueries({ queryKey: ["history"] }); },
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["history"] }),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try { new URL(u); } catch { return; }
    scan.mutate(u);
  };

  const result = scan.data;
  const meta = result ? verdictMeta[result.verdict] : null;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <main className="relative mx-auto max-w-4xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold">Scanner</h1>
          <p className="mt-1 text-muted-foreground">Paste any URL to check it against 70+ security engines.</p>
        </motion.div>

        <form onSubmit={submit} className="mt-8 glass rounded-2xl p-2 flex items-center gap-2 glow-primary">
          <Globe className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
          <input
            value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-transparent px-2 py-3 outline-none placeholder:text-muted-foreground"
            disabled={scan.isPending}
          />
          <button type="submit" disabled={scan.isPending || !url.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-primary font-semibold disabled:opacity-50 hover:scale-[1.03] transition-transform">
            {scan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Scan
          </button>
        </form>

        <AnimatePresence mode="wait">
          {scan.isPending && (
            <motion.div key="loading" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-6 glass rounded-2xl p-8 text-center">
              <div className="relative inline-block text-primary">
                <Shield className="h-12 w-12 animate-pulse" />
              </div>
              <div className="mt-3 text-muted-foreground">Querying threat intelligence...</div>
            </motion.div>
          )}

          {scan.error && (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mt-6 glass rounded-2xl p-5 border-destructive/40 text-destructive">
              {(scan.error as Error).message}
            </motion.div>
          )}

          {result && meta && (
            <motion.div key={`r-${result.verdict}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className={`mt-6 glass rounded-2xl p-6 border ${meta.bg}`}>
              <div className="flex items-center gap-4">
                <motion.div initial={{ rotate: -20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                  className={`h-14 w-14 rounded-2xl grid place-items-center ${meta.bg} ${meta.color}`}>
                  <meta.icon className="h-7 w-7" />
                </motion.div>
                <div>
                  <div className={`text-2xl font-bold ${meta.color}`}>{meta.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.stats.malicious || 0} malicious · {result.stats.suspicious || 0} suspicious · {result.stats.harmless || 0} harmless
                  </div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {[
                  ["Malicious", result.stats.malicious || 0, "text-destructive"],
                  ["Suspicious", result.stats.suspicious || 0, "text-warning"],
                  ["Harmless", result.stats.harmless || 0, "text-success"],
                  ["Undetected", result.stats.undetected || 0, "text-muted-foreground"],
                ].map(([l, n, c]) => (
                  <div key={l as string} className="rounded-xl bg-white/5 p-3 text-center">
                    <div className={`text-2xl font-bold ${c}`}>{n as number}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l as string}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recent scans</h2>
          {history.isLoading && <div className="text-muted-foreground text-sm">Loading...</div>}
          {history.data?.history.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No scans yet. Try one above.</div>
          )}
          <div className="space-y-2">
            <AnimatePresence>
              {history.data?.history.map((s: any) => {
                const m = verdictMeta[s.verdict] ?? verdictMeta.safe;
                return (
                  <motion.div key={s.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    layout
                    className="glass rounded-xl px-4 py-3 flex items-center gap-3 group hover:border-primary/30 transition-colors">
                    <div className={`h-9 w-9 rounded-lg grid place-items-center ${m.bg} ${m.color} shrink-0`}>
                      <m.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate" title={s.url}>{s.url}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className={m.color}>{m.label}</span> · {s.malicious}M / {s.suspicious}S / {s.harmless}H · {new Date(s.created_at).toLocaleString()}
                      </div>
                    </div>
                    <button onClick={() => del.mutate(s.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

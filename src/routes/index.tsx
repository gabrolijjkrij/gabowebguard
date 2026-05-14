import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Zap, Globe, Lock, Download, Sparkles, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabo's WebGuard — Real-time URL Threat Scanner" },
      { name: "description", content: "Scan any website for malware, phishing, and threats in seconds. Free Chrome extension + cloud dashboard." },
      { property: "og:title", content: "Gabo's WebGuard — Scan any URL for threats" },
      { property: "og:description", content: "Free browser extension + cloud history. Powered by 70+ security engines." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Zap, title: "Instant Verdict", desc: "Safe, suspicious, or malicious — answered in seconds." },
  { icon: Globe, title: "70+ Engines", desc: "Cross-checks against the world's leading security vendors." },
  { icon: Lock, title: "Private by Default", desc: "Only you see your scan history. Encrypted, zero-tracking." },
  { icon: Sparkles, title: "Cloud Sync", desc: "Sign in to keep your scans across devices." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Real-time threat intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Know if a website <br/>
            <span className="gradient-text">is safe</span> — instantly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Gabo's WebGuard scans any URL against 70+ antivirus engines. Spot phishing, malware, and scams before you click.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/login" search={{ mode: "signup" }} className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-primary font-semibold glow-primary hover:scale-[1.04] transition-transform">
              Create free account <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#download" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:bg-white/10 font-medium transition-colors">
              <Download className="h-4 w-4" /> Get extension
            </a>
          </motion.div>

          {/* Floating shield mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.5 }}
            className="relative mx-auto mt-20 max-w-md animate-float"
          >
            <div className="relative glass rounded-2xl p-6 glow-primary">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Scanning</div>
                  <div className="text-sm font-medium truncate">https://example.com</div>
                </div>
              </div>
              <div className="rounded-xl bg-success/15 border border-success/30 p-4 text-success flex items-center gap-3">
                <Check className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Safe</div>
                  <div className="text-xs opacity-80">0 of 73 engines flagged this URL</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {[["0","Malicious","destructive"],["0","Suspicious","warning"],["73","Harmless","success"]].map(([n,l,c]) => (
                  <div key={l} className="rounded-lg bg-white/5 p-2.5">
                    <div className={`text-lg font-bold text-${c}`}>{n}</div>
                    <div className="text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold">Built for <span className="gradient-text">paranoid</span> people.</h2>
          <p className="mt-3 text-muted-foreground">Everything you need, nothing you don't.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="relative mx-auto max-w-4xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 text-center glow-primary relative overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">Install the Chrome extension</h2>
            <p className="mt-3 text-muted-foreground">One-click scan from your toolbar. Works in Chrome, Edge, Brave, Arc.</p>
            <button
              onClick={() => {
                fetch("/webguard-extension.zip").then((r) => r.blob()).then((b) => {
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(b); a.download = "webguard-extension.zip"; a.click();
                  URL.revokeObjectURL(a.href);
                }).catch((e) => alert(e.message));
              }}
              className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-xl gradient-primary font-semibold glow-primary hover:scale-[1.04] transition-transform"
            >
              <Download className="h-5 w-5" /> Download .zip
            </button>
            <ol className="mt-8 text-sm text-muted-foreground text-left max-w-md mx-auto space-y-1.5">
              <li>1. Unzip the downloaded file</li>
              <li>2. Open <code className="text-foreground">chrome://extensions</code></li>
              <li>3. Enable <strong>Developer mode</strong> (top-right)</li>
              <li>4. Click <strong>Load unpacked</strong> and select the folder</li>
            </ol>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gabo's WebGuard. Stay safe out there.
      </footer>
    </div>
  );
}

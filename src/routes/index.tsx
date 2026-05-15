import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabo's WebGuard — URL threat scanner" },
      { name: "description", content: "70+ engines. One verdict. Scan any URL before you click." },
      { property: "og:title", content: "Gabo's WebGuard" },
      { property: "og:description", content: "Real-time URL threat intelligence for the paranoid." },
    ],
  }),
  component: Landing,
});

const TYPED = [
  "$ webguard scan https://login-paypa1.cn/verify",
  "→ resolving DNS....................... 198.51.100.42",
  "→ querying 73 engines.................. ok",
  "→ correlating signatures............... ok",
  "",
  "  VERDICT  ▌ MALICIOUS",
  "  flagged  ▌ 41 / 73",
  "  family   ▌ phishing.paypal.clone",
  "  first    ▌ 2026-05-12 04:11 UTC",
];

const FEED = [
  { v: "MAL", u: "free-robux-generator.app", n: "38" },
  { v: "OK ", u: "github.com", n: "0" },
  { v: "SUS", u: "tracking.adnet-7.io", n: "9" },
  { v: "MAL", u: "secure-login-bnk.ru", n: "44" },
  { v: "OK ", u: "wikipedia.org", n: "0" },
  { v: "SUS", u: "cdn-update-flash.win", n: "12" },
  { v: "MAL", u: "metamask-restore.help", n: "51" },
  { v: "OK ", u: "stripe.com", n: "0" },
];

function Landing() {
  return (
    <div className="min-h-screen noise">
      <Header />
      <Hero />
      <Ticker />
      <Manifesto />
      <TerminalDemo />
      <Compare />
      <Download />
      <Foot />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-white/5">
      {/* big number watermark */}
      <motion.div style={{ y }} className="pointer-events-none absolute right-[-4vw] top-[8vh] font-mono-jb font-bold text-[28vw] leading-none text-white/[0.025] select-none">
        404
      </motion.div>
      {/* corner brackets */}
      <Brackets />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28">
        <div className="font-mono-jb text-[11px] uppercase tracking-[0.3em] text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>v1.0 · build 26.05</span>
          <span className="hidden md:inline">73 engines online</span>
          <span className="hidden md:inline">last sync — 14s ago</span>
          <span className="ml-auto text-success">● operational</span>
        </div>

        <div className="mt-14 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="font-display font-bold text-[14vw] md:text-[9vw] lg:text-[8.2vw] leading-[0.88]"
            >
              <span className="block">Don&apos;t click</span>
              <span className="block"><span className="font-serif-i font-normal text-accent/90">that</span> link.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              WebGuard cross-checks every URL against <span className="text-foreground">73 antivirus engines</span> in under a second. Phishing, malware, scams, drive-by — flagged before your browser even opens the page.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="lg:col-span-4 space-y-3"
          >
            <Link to="/login" search={{ mode: "signup" }}
              className="group block hairline bg-foreground text-background px-5 py-4 font-mono-jb text-sm uppercase tracking-wider hover:bg-accent transition-colors">
              <div className="flex items-center justify-between">
                <span>open dashboard</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <div className="text-[10px] mt-1 opacity-60 normal-case tracking-normal">free · no card · 30s setup</div>
            </Link>
            <a href="#install" className="group block hairline px-5 py-4 font-mono-jb text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-white/30 transition-colors">
              <div className="flex items-center justify-between">
                <span>./install-extension</span>
                <span>↓</span>
              </div>
              <div className="text-[10px] mt-1 opacity-60 normal-case tracking-normal">chrome · edge · brave · arc</div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Brackets() {
  const cls = "absolute h-5 w-5 border-foreground/30";
  return (
    <>
      <div className={`${cls} left-3 top-3 border-l border-t`} />
      <div className={`${cls} right-3 top-3 border-r border-t`} />
      <div className={`${cls} left-3 bottom-3 border-l border-b`} />
      <div className={`${cls} right-3 bottom-3 border-r border-b`} />
    </>
  );
}

function Ticker() {
  const items = [...FEED, ...FEED, ...FEED];
  return (
    <section className="border-b border-white/5 overflow-hidden bg-black/20">
      <div className="flex items-center">
        <div className="font-mono-jb text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-5 py-3 border-r border-white/5 shrink-0">
          live feed →
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex ticker-track whitespace-nowrap font-mono-jb text-xs py-3">
            {items.map((it, i) => (
              <span key={i} className="px-6 inline-flex items-center gap-3">
                <span className={
                  it.v === "MAL" ? "text-destructive" :
                  it.v === "SUS" ? "text-warning" : "text-success"
                }>[{it.v}]</span>
                <span className="text-muted-foreground">{it.u}</span>
                <span className="text-muted-foreground/60">— {it.n} flagged</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const lines = [
    { n: "01", t: "Your browser trusts everyone.", d: "TLS only proves a server is who it claims. Not that it isn&apos;t a scam." },
    { n: "02", t: "One engine misses. Seventy-three don&apos;t.", d: "We poll Kaspersky, BitDefender, ESET, Sophos, and 69 more — in parallel." },
    { n: "03", t: "No tracking, no resale.", d: "Your scan history is yours. Encrypted at rest, scoped by row-level security." },
    { n: "04", t: "Built for the paranoid.", d: "Click → verdict in &lt; 1.4s median. Slower than reading. Faster than regret." },
  ];
  return (
    <section className="relative border-b border-white/5 mx-auto max-w-7xl px-6 py-28">
      <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-12">// principles</div>
      <div className="grid md:grid-cols-2 gap-px bg-white/5">
        {lines.map((l, i) => (
          <motion.div
            key={l.n}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-background p-8 md:p-10 group hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-baseline gap-6">
              <span className="font-mono-jb text-sm text-muted-foreground/50">{l.n}</span>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-medium leading-tight" dangerouslySetInnerHTML={{ __html: l.t }} />
                <p className="mt-3 text-muted-foreground max-w-md" dangerouslySetInnerHTML={{ __html: l.d }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TerminalDemo() {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setShown([]); setDone(false);
        for (let i = 0; i < TYPED.length; i++) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, i === 0 ? 600 : 380));
          setShown((s) => [...s, TYPED[i]]);
        }
        setDone(true);
        await new Promise((r) => setTimeout(r, 4500));
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative border-b border-white/5 mx-auto max-w-7xl px-6 py-28">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">// how it works</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05]">
            One URL in.<br/>
            <span className="font-serif-i font-normal">One verdict</span> out.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            No dashboards to learn. No reports to read. Paste a link, get a single answer — and the receipts to back it.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 font-mono-jb text-xs">
            {[["73", "engines"], ["1.4s", "median"], ["0", "stored PII"]].map(([n, l]) => (
              <div key={l} className="hairline p-3">
                <div className="text-2xl font-bold text-foreground">{n}</div>
                <div className="text-muted-foreground uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 relative scanlines hairline bg-black/40 rounded-sm overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="ml-3 font-mono-jb text-[11px] text-muted-foreground">~/webguard — zsh</span>
          </div>
          <pre className="font-mono-jb text-[12px] md:text-[13px] leading-[1.7] p-5 md:p-7 text-foreground/90 min-h-[340px] whitespace-pre-wrap">
{shown.map((l, i) => {
  const isVerdict = l.includes("VERDICT");
  const isMal = l.includes("MALICIOUS");
  const cls = isMal ? "text-destructive font-bold" :
              isVerdict ? "text-foreground" :
              l.startsWith("$") ? "text-accent" :
              l.startsWith("→") ? "text-muted-foreground" : "text-foreground/80";
  return <div key={i} className={cls}>{l || "\u00A0"}</div>;
})}
{!done && <span className="caret text-accent">▍</span>}
          </pre>
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const rows = [
    ["URL pre-flight scan", true, false],
    ["73-engine consensus", true, false],
    ["Cloud-synced history", true, false],
    ["Zero tracking, zero ads", true, false],
    ["Sells your browsing data", false, true],
  ];
  return (
    <section className="border-b border-white/5 mx-auto max-w-7xl px-6 py-28">
      <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">// vs. the rest</div>
      <div className="hairline">
        <div className="grid grid-cols-3 font-mono-jb text-xs uppercase tracking-wider border-b border-white/10">
          <div className="p-4 text-muted-foreground">feature</div>
          <div className="p-4 border-l border-white/10 text-foreground">webguard</div>
          <div className="p-4 border-l border-white/10 text-muted-foreground">avg. extension</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-3 border-b border-white/5 last:border-b-0 text-sm">
            <div className="p-4">{r[0] as string}</div>
            <div className="p-4 border-l border-white/10 font-mono-jb">
              {r[1] ? <span className="text-success">✓ yes</span> : <span className="text-destructive">✗ no</span>}
            </div>
            <div className="p-4 border-l border-white/10 font-mono-jb text-muted-foreground">
              {r[2] ? <span className="text-destructive">✓ yes</span> : <span>✗ no</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Download() {
  const dl = () => {
    fetch("/webguard-extension.zip").then((r) => r.blob()).then((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = "webguard-extension.zip"; a.click();
      URL.revokeObjectURL(a.href);
    }).catch((e) => alert(e.message));
  };
  return (
    <section id="install" className="border-b border-white/5 mx-auto max-w-7xl px-6 py-28">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">// install</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.05]">
            Four steps.<br/>
            <span className="font-serif-i font-normal">Forty seconds.</span>
          </h2>
          <button
            onClick={dl}
            className="mt-8 group inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 font-mono-jb text-sm uppercase tracking-wider hover:bg-accent transition-colors"
          >
            <span>↓ webguard-extension.zip</span>
            <span className="opacity-60 normal-case tracking-normal">~38kb</span>
          </button>
        </div>
        <div className="lg:col-span-7 hairline">
          {[
            ["unzip", "tar -xf webguard-extension.zip"],
            ["open", "chrome://extensions"],
            ["enable", "developer mode (top right)"],
            ["load", "click 'load unpacked' → select folder"],
          ].map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[80px_1fr] border-b border-white/5 last:border-b-0">
              <div className="p-5 font-mono-jb text-sm text-muted-foreground border-r border-white/5">0{i+1}</div>
              <div className="p-5">
                <div className="font-mono-jb text-xs uppercase tracking-wider text-accent">{k}</div>
                <div className="mt-1 font-mono-jb text-sm">{v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Foot() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-10 font-mono-jb text-[11px] uppercase tracking-[0.2em] text-muted-foreground flex flex-wrap items-center justify-between gap-4">
      <div>© {new Date().getFullYear()} gabo / webguard</div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> all systems normal
      </div>
      <div>stay paranoid.</div>
    </footer>
  );
}

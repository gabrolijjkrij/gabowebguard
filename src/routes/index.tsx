import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabo's WebGuard — URL threat scanner" },
      { name: "description", content: "73 engines. One verdict. Scan any URL before you click." },
      { property: "og:title", content: "Gabo's WebGuard" },
      { property: "og:description", content: "Real-time URL threat intelligence for the paranoid." },
    ],
  }),
  component: Landing,
});

const FEED = [
  { v: "MAL", u: "free-robux-generator.app", n: 38 },
  { v: "OK", u: "github.com", n: 0 },
  { v: "SUS", u: "tracking.adnet-7.io", n: 9 },
  { v: "MAL", u: "secure-login-bnk.ru", n: 44 },
  { v: "OK", u: "wikipedia.org", n: 0 },
  { v: "SUS", u: "cdn-update-flash.win", n: 12 },
  { v: "MAL", u: "metamask-restore.help", n: 51 },
  { v: "OK", u: "stripe.com", n: 0 },
  { v: "MAL", u: "apple-id-locked.support", n: 47 },
  { v: "MAL", u: "netfllx-billing.cc", n: 39 },
  { v: "SUS", u: "downloader-fast-mp3.lol", n: 7 },
];

const WALL = [
  "login-paypa1.cn/verify", "free-v-bucks-now.tk", "secure-bnk-login.ru",
  "metamask-restore.help", "apple-id-locked.support", "fb-security-check.cf",
  "netfllx-billing.cc", "amaz0n-prime-renew.icu", "google-docs-share.win",
  "instagram-blue-tick.app", "discord-nitro-free.gg", "tiktok-coins-gen.live",
  "robux-generator-2026.app", "binance-2fa-reset.help", "whatsapp-pc-install.exe.zip",
  "office365-mail-quota.online", "linkedin-job-offer.click", "spotify-premium-crack.ml",
];

function Landing() {
  return (
    <div className="min-h-screen noise overflow-x-hidden">
      <Header />
      <Hero />
      <Ticker />
      <Wall />
      <BigQuote />
      <TerminalDemo />
      <Install />
      <Foot />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [url, setUrl] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = url.trim() || "https://example.com";
    window.location.href = `/login?mode=signup&u=${encodeURIComponent(target)}`;
  };

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-white/5">
      {/* decorative verticals */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div style={{ height: lineH }} className="absolute top-0 left-[8%] w-px bg-gradient-to-b from-accent/60 via-accent/10 to-transparent" />
        <motion.div style={{ height: lineH }} className="absolute top-0 right-[6%] w-px bg-gradient-to-b from-destructive/40 via-destructive/5 to-transparent" />
        <div className="absolute top-1/2 inset-x-0 h-px bg-white/[0.04]" />
        <motion.div style={{ y }} className="absolute -right-[8vw] top-[18vh] font-mono-jb font-bold text-[38vw] leading-none text-white/[0.02] select-none">
          ░▒▓
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-12 pb-28">
        <div className="flex items-center gap-4 font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
          <span>est. 2026</span>
          <span className="h-px w-8 bg-white/15" />
          <span>made in the dark</span>
          <span className="ml-auto flex items-center gap-2 text-accent">
            <span className="h-1 w-1 rounded-full bg-accent" />
            73 engines · live
          </span>
        </div>

        <div className="mt-20 grid lg:grid-cols-12 gap-x-10">
          {/* hero text + input */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-semibold text-[14vw] md:text-[8.4vw] leading-[0.9] tracking-[-0.045em] text-foreground"
            >
              The web is <br />
              <span className="font-serif-i italic font-normal text-destructive pr-3">hostile.</span>{" "}
              <span className="text-foreground/15">We make it legible.</span>
            </motion.h1>

            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative group max-w-2xl mt-16"
            >
              <div className="absolute -inset-1 bg-accent/10 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex bg-black/60 hairline focus-within:border-accent/70 transition-colors">
                <span className="flex items-center px-5 font-mono-jb text-accent/60 text-sm">$</span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="paste a url. we'll do the rest."
                  spellCheck={false}
                  className="flex-1 bg-transparent font-mono-jb text-sm md:text-base py-6 outline-none placeholder:text-muted-foreground/40 text-foreground"
                />
                <button
                  type="submit"
                  className="px-8 md:px-10 bg-foreground text-background font-mono-jb text-xs font-bold uppercase tracking-[0.18em] hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  scan →
                </button>
              </div>
            </motion.form>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono-jb text-[10px] uppercase tracking-[0.18em]">
              <span className="text-muted-foreground/40">try:</span>
              <button
                onClick={() => setUrl("login-paypa1.cn/verify")}
                className="text-destructive/80 hover:text-destructive border-b border-destructive/30 hover:border-destructive transition-colors"
              >
                login-paypa1.cn/verify
              </button>
              <button
                onClick={() => setUrl("github.com")}
                className="text-accent/80 hover:text-accent border-b border-accent/30 hover:border-accent transition-colors"
              >
                github.com
              </button>
            </div>
          </div>

          {/* sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 flex flex-col justify-end pt-16 lg:pt-0 lg:pl-10"
          >
            <div className="border-l border-white/10 pl-8">
              <div className="flex items-center gap-2 mb-7">
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span className="font-mono-jb text-[10px] tracking-[0.25em] uppercase text-accent">
                  73 engines · live
                </span>
              </div>
              <p className="text-sm md:text-[15px] leading-relaxed text-foreground/70">
                WebGuard reads{" "}
                <span className="font-serif-i italic text-lg text-foreground">every link</span>{" "}
                through 73 antivirus engines in under a second. Phishing, malware, and drive-bys are flagged before your browser even begins to render the first byte.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/login"
                  search={{ mode: "signup" }}
                  className="group flex items-center justify-between p-4 bg-accent/5 border border-accent/20 hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                >
                  <span className="font-mono-jb text-[10px] tracking-[0.2em] uppercase font-bold">free account</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
                <a
                  href="#install"
                  className="group flex items-center justify-between p-4 hairline text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
                >
                  <span className="font-mono-jb text-[10px] tracking-[0.2em] uppercase">extension</span>
                  <span className="text-base">↓</span>
                </a>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* bottom marker strip */}
        <div className="mt-24 pt-6 border-t border-white/[0.06] flex items-center justify-between font-mono-jb text-[9px] tracking-[0.4em] uppercase text-muted-foreground/40">
          <span>0x9FF2 // system_active</span>
          <span>node_04 · seoul</span>
          <span>latency 142ms</span>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const items = [...FEED, ...FEED, ...FEED];
  return (
    <section className="border-b border-white/5 overflow-hidden bg-black/30">
      <div className="flex items-center">
        <div className="font-mono-jb text-[10px] uppercase tracking-[0.25em] text-destructive px-5 py-3 border-r border-white/5 shrink-0 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" /> live
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex ticker-track whitespace-nowrap font-mono-jb text-xs py-3">
            {items.map((it, i) => (
              <span key={i} className="px-6 inline-flex items-center gap-3">
                <span className={
                  it.v === "MAL" ? "text-destructive" :
                  it.v === "SUS" ? "text-warning" : "text-success"
                }>[{it.v.padEnd(3, " ")}]</span>
                <span className="text-foreground/80">{it.u}</span>
                <span className="text-muted-foreground/50">— {it.n} flagged</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Wall() {
  return (
    <section className="relative border-b border-white/5 mx-auto max-w-[1400px] px-6 py-28">
      <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-destructive mb-2">// wall of shame</div>
      <h2 className="font-display text-4xl md:text-6xl font-bold leading-[0.95] mb-12">
        URLs we&apos;ve flagged <span className="font-serif-i italic font-normal">this hour.</span>
      </h2>
      <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono-jb">
        {WALL.map((u, i) => {
          const sizes = ["text-base", "text-xl", "text-2xl", "text-3xl", "text-lg"];
          const rot = (i % 5) - 2;
          return (
            <motion.span
              key={u}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              style={{ transform: `rotate(${rot * 0.4}deg)` }}
              className={`${sizes[i % sizes.length]} text-muted-foreground/70 line-through decoration-destructive/70 decoration-2 hover:text-foreground hover:decoration-destructive transition-colors cursor-default`}
            >
              {u}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-12 font-mono-jb text-xs text-muted-foreground/60">
        + 4,712,338 more this week.
      </div>
    </section>
  );
}

function BigQuote() {
  return (
    <section className="border-b border-white/5 mx-auto max-w-[1400px] px-6 py-32">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-2 font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          // why
        </div>
        <blockquote className="lg:col-span-10 font-display text-3xl md:text-5xl lg:text-6xl leading-[1.05] font-medium tracking-[-0.02em]">
          Your browser&apos;s padlock means the connection is encrypted.
          <span className="block mt-2 text-muted-foreground/50">Not that the page on the other end</span>
          <span className="font-serif-i italic font-normal"> isn&apos;t robbing you blind.</span>
        </blockquote>
      </div>
    </section>
  );
}

const TYPED = [
  "$ webguard scan https://login-paypa1.cn/verify",
  "→ resolving dns ........................ 198.51.100.42",
  "→ fanning out to 73 engines ............ ok",
  "→ correlating signatures ............... ok",
  "",
  "  verdict  ▌ MALICIOUS",
  "  flagged  ▌ 41 / 73",
  "  family   ▌ phishing.paypal.clone",
  "  first    ▌ 2026-05-12 04:11 UTC",
];

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
          await new Promise((r) => setTimeout(r, i === 0 ? 600 : 360));
          setShown((s) => [...s, TYPED[i]]);
        }
        setDone(true);
        await new Promise((r) => setTimeout(r, 5000));
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative border-b border-white/5 mx-auto max-w-[1400px] px-6 py-28">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">// receipts</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.0]">
            One link in.<br/>
            <span className="font-serif-i italic font-normal">A whole story</span> out.
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
            No dashboards to learn. No graphs to squint at. A single verdict and the receipts to back it — vendor names, signatures, first-seen timestamps.
          </p>
        </div>

        <div className="lg:col-span-7 relative scanlines hairline bg-black/50 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="ml-3 font-mono-jb text-[11px] text-muted-foreground">~/webguard — zsh</span>
          </div>
          <pre className="font-mono-jb text-[12px] md:text-[13px] leading-[1.7] p-5 md:p-7 text-foreground/90 min-h-[340px] whitespace-pre-wrap">
{shown.map((l, i) => {
  const isMal = l.includes("MALICIOUS");
  const isVerdict = l.trim().startsWith("verdict");
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

function Install() {
  const dl = () => {
    fetch("/webguard-extension.zip").then((r) => r.blob()).then((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = "webguard-extension.zip"; a.click();
      URL.revokeObjectURL(a.href);
    }).catch((e) => alert(e.message));
  };
  return (
    <section id="install" className="border-b border-white/5 mx-auto max-w-[1400px] px-6 py-28">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">// install</div>
          <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.9]">
            four steps.<br/>
            <span className="font-serif-i italic font-normal text-muted-foreground/70">forty seconds.</span>
          </h2>
          <button
            onClick={dl}
            className="mt-10 group inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 font-mono-jb text-sm uppercase tracking-wider hover:bg-accent transition-colors"
          >
            <span>↓ webguard-extension.zip</span>
          </button>
          <div className="mt-3 font-mono-jb text-[11px] text-muted-foreground/60">~38kb · chrome · edge · brave · arc</div>
        </div>
        <div className="lg:col-span-7 hairline">
          {[
            ["unzip", "tar -xf webguard-extension.zip"],
            ["open", "chrome://extensions"],
            ["enable", "developer mode (top right toggle)"],
            ["load", "click 'load unpacked' → select the folder"],
          ].map(([k, v], i) => (
            <div key={k} className="grid grid-cols-[80px_1fr] border-b border-white/5 last:border-b-0 group hover:bg-white/[0.02] transition-colors">
              <div className="p-5 font-mono-jb text-sm text-muted-foreground/50 border-r border-white/5">0{i+1}</div>
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
    <footer className="mx-auto max-w-[1400px] px-6 py-12">
      <div className="font-display text-[18vw] md:text-[12vw] leading-[0.85] font-bold tracking-[-0.04em] text-white/[0.04] select-none">
        stay paranoid.
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono-jb text-[11px] uppercase tracking-[0.2em] text-muted-foreground border-t border-white/5 pt-6">
        <div>© {new Date().getFullYear()} gabo / webguard</div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> all systems normal
        </div>
        <div>built for the suspicious</div>
      </div>
    </footer>
  );
}

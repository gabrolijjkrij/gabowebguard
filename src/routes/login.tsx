import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ mode: z.enum(["signin", "signup"]).optional() }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // fake live boot log
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard" },
        });
        if (error) throw error;
        setErr("Check your inbox to confirm your email, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally { setLoading(false); }
  };

  const google = async () => {
    setErr(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) { setErr((result.error as any).message ?? "Google sign-in failed"); return; }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden noise grid grid-cols-1 lg:grid-cols-2">
      {/* decorative verticals */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-[6%] w-px h-full bg-gradient-to-b from-accent/40 via-accent/5 to-transparent" />
        <div className="absolute top-0 right-[6%] w-px h-full bg-gradient-to-b from-destructive/30 via-destructive/5 to-transparent" />
      </div>

      {/* left: editorial panel */}
      <aside className="hidden lg:flex relative flex-col justify-between p-10 border-r border-white/[0.06] bg-black/40">
        <Link to="/" className="flex items-center gap-3 font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          ← gabo / webguard
        </Link>

        <div>
          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-accent mb-6">
            // {mode === "signup" ? "new operator" : "returning operator"}
          </div>
          <h1 className="font-display font-semibold text-6xl xl:text-7xl leading-[0.9] tracking-[-0.04em]">
            {mode === "signup" ? (
              <>
                Trust <span className="font-serif-i italic font-normal text-destructive">nothing.</span>
                <br />
                <span className="text-foreground/20">Verify everything.</span>
              </>
            ) : (
              <>
                Welcome <span className="font-serif-i italic font-normal text-accent">back</span>
                <br />
                <span className="text-foreground/20">to the dark.</span>
              </>
            )}
          </h1>
          <p className="mt-8 max-w-md text-foreground/60 leading-relaxed text-sm">
            One account syncs scan history across every browser, every device. Your data is yours — encrypted, never sold.
          </p>
        </div>

        <div className="font-mono-jb text-[10px] uppercase tracking-[0.35em] text-muted-foreground/40 space-y-1">
          <div>boot.seq[{String(tick).padStart(4, "0")}] // ok</div>
          <div>handshake // tls_1.3 // aes_256</div>
          <div>node_04 · seoul · latency 142ms</div>
        </div>
      </aside>

      {/* right: form */}
      <main className="relative flex items-center justify-center px-6 py-16 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* mobile brand */}
          <Link to="/" className="lg:hidden flex items-center gap-2 font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            ← gabo / webguard
          </Link>

          {/* mode tabs */}
          <div className="flex items-center gap-1 mb-10 font-mono-jb text-[10px] uppercase tracking-[0.25em] hairline p-1 w-fit">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-2 transition-colors ${
                  mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "sign · in" : "sign · up"}
              </button>
            ))}
          </div>

          <div className="font-mono-jb text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3 mb-3">
            <span className="h-px w-6 bg-white/15" />
            step 01 — authenticate
          </div>
          <h2 className="font-display font-semibold text-3xl md:text-4xl leading-[1] tracking-[-0.03em]">
            {mode === "signin" ? (
              <>access your <span className="font-serif-i italic font-normal">vault.</span></>
            ) : (
              <>claim your <span className="font-serif-i italic font-normal">handle.</span></>
            )}
          </h2>

          {/* google */}
          <button
            onClick={google}
            type="button"
            className="mt-8 w-full group flex items-center justify-between px-5 py-4 hairline bg-black/40 hover:bg-foreground hover:text-background transition-colors"
          >
            <span className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span className="font-mono-jb text-[11px] uppercase tracking-[0.2em] font-bold">continue with google</span>
            </span>
            <span className="font-mono-jb text-xs opacity-40 group-hover:opacity-100 transition-opacity">→</span>
          </button>

          <div className="my-8 flex items-center gap-4 font-mono-jb text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40">
            <div className="flex-1 h-px bg-white/[0.06]" />
            or w/ email
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block font-mono-jb text-[9px] uppercase tracking-[0.35em] text-muted-foreground/60 mb-2">
                email
              </label>
              <div className="flex hairline bg-black/40 focus-within:border-accent/60 transition-colors">
                <span className="px-4 py-3 font-mono-jb text-accent/60 text-sm self-center">@</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.io"
                  spellCheck={false}
                  className="flex-1 bg-transparent font-mono-jb text-sm py-3 pr-4 outline-none placeholder:text-muted-foreground/30"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono-jb text-[9px] uppercase tracking-[0.35em] text-muted-foreground/60 mb-2">
                passphrase <span className="opacity-50">// 6+ chars</span>
              </label>
              <div className="flex hairline bg-black/40 focus-within:border-accent/60 transition-colors">
                <span className="px-4 py-3 font-mono-jb text-accent/60 text-sm self-center">▌</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="flex-1 bg-transparent font-mono-jb text-sm py-3 pr-4 outline-none placeholder:text-muted-foreground/30 tracking-widest"
                />
              </div>
            </div>

            {err && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono-jb text-[11px] text-destructive border-l-2 border-destructive bg-destructive/5 px-3 py-2 leading-snug"
              >
                <span className="opacity-60">[err]</span> {err}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-foreground text-background font-mono-jb text-xs uppercase tracking-[0.25em] font-bold px-6 py-4 hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                  authenticating
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "→ sign in" : "→ create account"}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 font-mono-jb text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
            {mode === "signin" ? "no account?" : "already onboard?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-foreground border-b border-foreground/30 hover:border-foreground transition-colors"
            >
              {mode === "signin" ? "request access →" : "sign in instead →"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

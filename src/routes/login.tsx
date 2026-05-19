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

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen relative overflow-hidden noise grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* one quiet vertical, on desktop only */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* left: editorial panel */}
      <aside className="hidden lg:flex relative flex-col justify-between px-14 py-12 xl:px-20 xl:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-display font-medium tracking-tight">gabo</span>
          <span className="text-foreground/30">/</span>
          <span className="font-display tracking-tight">webguard</span>
        </Link>

        <div className="max-w-[34rem]">
          <p className="text-xs text-muted-foreground/70 mb-8 tracking-wide">
            {isSignup ? "A new account" : "Welcome back"}
          </p>
          <h1 className="font-serif-i italic font-normal text-[3.5rem] xl:text-[4.5rem] leading-[0.95] tracking-[-0.02em] text-foreground">
            {isSignup ? (
              <>
                Make the web<br />
                <span className="text-foreground/40">a little safer.</span>
              </>
            ) : (
              <>
                Good to see<br />
                <span className="text-foreground/40">you again.</span>
              </>
            )}
          </h1>
          <p className="mt-10 max-w-md text-base text-foreground/65 leading-[1.65]">
            One account, every browser. Your scan history stays encrypted and
            yours — we don&apos;t sell it, log it, or share it.
          </p>
        </div>

        <div className="text-xs text-muted-foreground/40 flex items-center gap-6">
          <span className="font-mono-jb tabular-nums">v0.{String(tick).padStart(2, "0")}</span>
          <span>Encrypted in transit · TLS 1.3</span>
        </div>
      </aside>

      {/* right: form */}
      <main className="relative flex items-center justify-center px-6 py-14 sm:px-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[26rem]"
        >
          {/* mobile brand */}
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground mb-12"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="font-display font-medium tracking-tight text-foreground">gabo</span>
            <span className="text-foreground/30">/</span>
            <span className="font-display tracking-tight">webguard</span>
          </Link>

          {/* heading */}
          <h2 className="font-display text-[2rem] sm:text-[2.25rem] leading-[1.05] tracking-[-0.03em] font-medium">
            {isSignup ? (
              <>Create your <span className="font-serif-i italic font-normal text-foreground/70">account</span></>
            ) : (
              <>Sign in to <span className="font-serif-i italic font-normal text-foreground/70">your vault</span></>
            )}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {isSignup
              ? "Takes about thirty seconds. No credit card."
              : "Use the method you signed up with."}
          </p>

          {/* google */}
          <button
            onClick={google}
            type="button"
            className="mt-10 w-full group flex items-center justify-center gap-3 px-5 py-3.5 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          <div className="my-7 flex items-center gap-4 text-xs text-muted-foreground/50">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span>or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.io"
                spellCheck={false}
                className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-[15px] outline-none placeholder:text-muted-foreground/40 focus:border-accent/60 focus:bg-white/[0.04] transition-colors"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <span className="text-xs text-muted-foreground/50">6+ characters</span>
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-[15px] outline-none placeholder:text-muted-foreground/40 focus:border-accent/60 focus:bg-white/[0.04] transition-colors tracking-widest"
              />
            </div>

            {err && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive border-l-2 border-destructive bg-destructive/5 px-3 py-2.5 leading-snug rounded-r-md"
              >
                {err}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background text-sm font-medium px-6 py-3.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  <span>Just a moment…</span>
                </>
              ) : (
                <span>{isSignup ? "Create account" : "Sign in"}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New here? "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "signin" : "signup")}
              className="text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground transition-colors"
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

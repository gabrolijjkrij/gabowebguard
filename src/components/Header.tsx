import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4 font-mono-jb text-[13px]">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-success shadow-[0_0_10px] shadow-success" />
          <span className="uppercase tracking-[0.2em] text-muted-foreground">gabo<span className="text-foreground">/</span>webguard</span>
        </Link>
        <nav className="flex items-center gap-1">
          {email ? (
            <>
              <Link to="/dashboard" className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${path === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>~/dashboard</Link>
              <span className="hidden sm:inline text-muted-foreground/60 px-2 truncate max-w-[180px]">{email}</span>
              <button onClick={logout} className="px-3 py-1.5 uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors">[logout]</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 uppercase tracking-wider text-muted-foreground hover:text-foreground">sign-in</Link>
              <Link to="/login" search={{ mode: "signup" }} className="px-3 py-1.5 uppercase tracking-wider bg-foreground text-background hover:bg-accent transition-colors">init →</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

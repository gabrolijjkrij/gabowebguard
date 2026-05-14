import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 rounded-xl gradient-primary grid place-items-center glow-primary group-hover:scale-110 transition-transform">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">Gabo's <span className="gradient-text">WebGuard</span></span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {email ? (
            <>
              <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition-colors ${path === "/dashboard" ? "bg-white/10" : "hover:bg-white/5"}`}>Dashboard</Link>
              <span className="hidden sm:inline text-muted-foreground px-2">{email}</span>
              <button onClick={logout} className="px-3 py-2 rounded-lg hover:bg-white/5 flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-white/5">Sign in</Link>
              <Link to="/login" search={{ mode: "signup" }} className="px-4 py-2 rounded-lg gradient-primary font-medium glow-primary hover:scale-[1.03] transition-transform">Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col p-5 border-r transition-all duration-500",
          collapsed ? "w-20" : "w-64"
        )}
        style={{
          background: "var(--panel)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Valentigo" width={48} height={48} />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-poppins font-semibold text-[var(--text)]">
                Valentigo
              </h2>
              <p className="text-sm text-[var(--muted)]">AI for estate agents</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          <NavItem href="/" label="Dashboard" />
          <NavItem href="/generator" label="Property Generator" />
          <NavItem href="/leads" label="Leads" />
          <NavItem href="/settings" label="Settings" />
        </nav>

        {/* Sidebar Bottom */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition"
          >
            {collapsed ? "›" : "‹ Collapse"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 transition-colors duration-500">
        <Header theme={theme} setTheme={setTheme} />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

/* -------------------------- */
/* Navigation Item */
function NavItem({ href, label }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        "block px-3 py-2 rounded-md text-sm transition-colors duration-300",
        isActive
          ? "bg-[var(--accent)] text-[#04202b]"
          : "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--accent)]"
      )}
    >
      {label}
    </Link>
  );
}

/* -------------------------- */
/* Header Component */
function Header({ theme, setTheme }) {
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email);
      }
    };
    fetchUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header
      className="flex items-center justify-between p-4 rounded-xl shadow-md transition-colors duration-500"
      style={{
        background: "var(--panel)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Overview & AI tools</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-md border border-transparent hover:border-[var(--accent)] transition"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon size={20} className="text-[var(--accent)]" />
          ) : (
            <Sun size={20} className="text-[var(--accent)]" />
          )}
        </button>

        {/* User Info */}
        <div className="text-sm text-[var(--muted)]">
          {userEmail || "Loading..."}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[#04202b] font-semibold">
          RC
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm bg-[rgba(255,255,255,0.06)] px-4 py-2 rounded-md hover:bg-[rgba(255,255,255,0.12)] transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

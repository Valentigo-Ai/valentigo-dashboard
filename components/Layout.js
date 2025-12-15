// components/Layout.js
import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  LayoutDashboard,
  Wand2,
  Users,
  Settings,
  LogOut,
  Search,
} from "lucide-react";

// ✅ New correct import for client-side Supabase
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Create client-side Supabase instance
  const supabase = createClientComponentClient();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // avoid hydration mismatch

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      {/* Sidebar */}
      <aside
        className={clsx(
          "flex flex-col p-5 border-r transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
        style={{
          background: "var(--panel)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3 mb-6 select-none">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Valentigo</h2>
              <p className="text-sm text-[var(--muted)]">AI for estate agents</p>
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <NavItem
            href="/"
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            collapsed={collapsed}
          />
          <NavItem
            href="/generator"
            label="Property Generator"
            icon={<Wand2 size={18} />}
            collapsed={collapsed}
          />
          <NavItem
            href="/leads"
            label="Leads"
            icon={<Users size={18} />}
            collapsed={collapsed}
          />
          <NavItem
            href="/settings"
            label="Settings"
            icon={<Settings size={18} />}
            collapsed={collapsed}
          />
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <button
            onClick={() => setCollapsed((s) => !s)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition"
          >
            {collapsed ? "›" : "‹ Collapse"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col transition-colors duration-500">
        <Header theme={theme} setTheme={setTheme} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

/* ------------------------------- NavItem -------------------------------- */
function NavItem({ href, label, icon, collapsed }) {
  const router = useRouter();
  const isActive = router.pathname === href;

  const base =
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-200";
  const activeClasses = "bg-[var(--accent)] text-[#04202b] shadow-sm";
  const inactiveClasses =
    "text-[var(--muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--accent)]";

  return (
    <Link
      href={href}
      className={clsx(base, isActive ? activeClasses : inactiveClasses)}
      title={label}
    >
      <span
        className={clsx(
          "flex items-center justify-center",
          collapsed ? "w-full" : "w-6"
        )}
      >
        {icon}
      </span>

      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

/* -------------------------------- Header -------------------------------- */
function Header({ theme, setTheme }) {
  const [userEmail, setUserEmail] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  // ✅ Create client-side Supabase instance *here too*
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserEmail(data.user.email);
    };
    fetchUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header
      className="flex items-center justify-between gap-6 p-5 rounded-xl shadow-sm"
      style={{
        background: "var(--panel)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold leading-tight">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Overview & AI tools</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-md border hover:border-[var(--accent)] transition"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="hidden md:flex items-center bg-[rgba(255,255,255,0.03)] rounded-md px-3 py-1 gap-2">
          <Search size={16} />
          <input
            className="bg-transparent outline-none text-sm"
            placeholder="Search listings, leads..."
          />
        </div>

        <div className="hidden lg:block text-sm text-[var(--muted)] truncate max-w-[260px]">
          {userEmail || "Loading..."}
        </div>

        <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center font-semibold">
          {userEmail ? userInitials(userEmail) : "U"}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition text-sm"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

/* ------------------------------ Helpers ------------------------------ */
function userInitials(email) {
  if (!email) return "U";
  const name = email.split("@")[0].replace(/[._\-\d]/g, " ");
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-vgbg text-white">
      <aside className={clsx("h-screen p-5", collapsed ? "w-20" : "w-64") + " bg-[#111317] border-r border-black/20"}>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Valentigo" width={48} height={48} />
          </div>
          <div className={collapsed ? "hidden" : ""}>
            <h2 className="text-xl font-poppins font-semibold" style={{color:"#dfe6ea"}}>Valentigo</h2>
            <div className="text-sm" style={{color:"#9aa6ad"}}>AI for estate agents</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          <NavItem href="/" label="Dashboard" />
          <NavItem href="/ai-tools" label="AI Tools" />
          <NavItem href="/leads" label="Leads" />
          <NavItem href="/settings" label="Settings" />
        </nav>

        <div className="mt-auto pt-6">
          <button onClick={() => setCollapsed(!collapsed)} className="text-sm text-vgmuted">
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Header />
        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, label }) {
  return (
    <Link href={href}>
      <a className="block px-3 py-2 rounded-md text-sm" style={{color:"#bfc8cf"}}>{label}</a>
    </Link>
  )
}

function Header(){
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm" style={{color:"#9aa6ad"}}>Overview & AI tools</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm" style={{color:"#9aa6ad"}}>info@valentigo.com</div>
        <div className="w-10 h-10 rounded-full bg-[#dfe6ea] flex items-center justify-center text-[#111317]">RC</div>
      </div>
    </header>
  )
}

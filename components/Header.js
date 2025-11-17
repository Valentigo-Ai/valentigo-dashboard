import ThemeToggle from './ThemeToggle'

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-400">Overview & AI tools</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="text-sm text-gray-400">info@valentigo.com</div>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-900">RC</div>
      </div>
    </header>
  )
}

export default Header

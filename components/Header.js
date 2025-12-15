import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="
      flex items-center justify-between 
      px-8 py-6
      border-b border-gray-200 dark:border-gray-800 
      bg-white dark:bg-[#0f0f0f]
      backdrop-blur-xl
    ">
      
      {/* Left Section — Logo + Title */}
      <div className="flex flex-col">
        <h1 className="
          text-2xl font-semibold 
          text-gray-900 dark:text-gray-100 tracking-tight
        ">
          Dashboard
        </h1>

        <p className="
          text-sm text-gray-500 dark:text-gray-400
          -mt-1
        ">
          Overview & AI tools
        </p>
      </div>

      {/* Right Section — Email + Theme toggle */}
      <div className="flex items-center gap-6">
        
        {/* Email */}
        <div className="
          text-sm text-gray-600 dark:text-gray-300
          font-medium
        ">
          info@valentigo.com
        </div>

        {/* Premium Divider */}
        <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700"></div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

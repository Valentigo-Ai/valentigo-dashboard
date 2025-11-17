import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabase'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/login')
      } else {
        setLoading(false)
      }
    }
    checkSession()

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  // 🚀 Modern shimmer loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f12] text-white">
        <div className="w-80 space-y-4">
          <div className="h-5 bg-gradient-to-r from-[#1a1d22] via-[#2b2f36] to-[#1a1d22] animate-[shimmer_2s_infinite] rounded"></div>
          <div className="h-5 bg-gradient-to-r from-[#1a1d22] via-[#2b2f36] to-[#1a1d22] animate-[shimmer_2s_infinite] rounded w-5/6"></div>
          <div className="h-5 bg-gradient-to-r from-[#1a1d22] via-[#2b2f36] to-[#1a1d22] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
        </div>

        <style jsx global>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .animate-[shimmer_2s_infinite] {
            background-size: 800px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    )
  }

  // 🌙 Smooth fade-in for dashboard
  return (
    <div className="animate-fade-in">
      {children}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from './supabaseClient'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/login')
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e1013] text-gray-300">
        <div className="w-3/4 md:w-1/2 space-y-4 animate-pulse">
          <div
            className="h-6 rounded w-1/3 bg-gradient-to-r from-[#0e76fd]/30 via-[#38bdf8]/40 to-[#0e76fd]/30 bg-[length:400%_100%] animate-[shimmer_1.8s_infinite]"
          ></div>
          <div
            className="h-4 rounded w-1/2 bg-gradient-to-r from-[#0e76fd]/20 via-[#38bdf8]/30 to-[#0e76fd]/20 bg-[length:400%_100%] animate-[shimmer_1.8s_infinite]"
          ></div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-gradient-to-r from-[#1a1d22] via-[#0e76fd]/10 to-[#1a1d22] bg-[length:400%_100%] animate-[shimmer_2s_infinite]"
              ></div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -400px 0;
            }
            100% {
              background-position: 400px 0;
            }
          }
        `}</style>
      </div>
    )
  }

  return children
}

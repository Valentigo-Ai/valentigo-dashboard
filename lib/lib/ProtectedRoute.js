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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111317] text-gray-400">
        <div className="w-3/4 md:w-1/2 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="h-32 bg-gray-800 rounded-lg"></div>
            <div className="h-32 bg-gray-800 rounded-lg"></div>
            <div className="h-32 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return children
}

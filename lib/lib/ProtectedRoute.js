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
    return <div className="text-center mt-10 text-gray-400">Loading dashboard...</div>
  }

  return children
}

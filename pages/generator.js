import { useUser } from '@supabase/auth-helpers-react'
import PropertyDescriptionGenerator from '../components/PropertyDescriptionGenerator'

export default function GeneratorPage() {
  const user = useUser()

  if (!user) {
    return <p className="p-8">Please log in to use this tool.</p>
  }

  return (
    <div className="p-8">
      <PropertyDescriptionGenerator />
    </div>
  )
}

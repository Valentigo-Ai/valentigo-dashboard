import { useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export default function PropertyDescriptionGenerator() {
  const user = useUser()
  const [form, setForm] = useState({
    propertyType: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    features: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    console.log("📤 Sending request to /api/generate-description", form)

    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      console.log("📥 Response status:", res.status)
      const data = await res.json()
      console.log("📄 Response JSON:", data)

      if (res.ok) {
        setResult(data.output)
      } else {
        setResult("❌ Error: " + (data.error || "Something went wrong"))
      }
    } catch (err) {
      console.error("⚠️ Fetch failed:", err)
      setResult("❌ Network or server error.")
    }

    setLoading(false)
  }

  if (!user) return <p>Please log in to use this tool.</p>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏠 Property Description Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="propertyType" placeholder="Property Type" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="bedrooms" placeholder="Bedrooms" onChange={handleChange} className="w-full p-2 rounded border" />
        <input name="bathrooms" placeholder="Bathrooms" onChange={handleChange} className="w-full p-2 rounded border" />
        <textarea name="features" placeholder="Key Features (comma separated)" onChange={handleChange} className="w-full p-2 rounded border" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Generating...' : 'Generate Description'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Generated Description:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}

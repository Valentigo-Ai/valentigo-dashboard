import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ keep secret
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password, secret } = req.body

  // Optional: only allow admin secret to create users
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) return res.status(400).json({ error: error.message })
  res.status(200).json({ success: true, user: data.user })
}

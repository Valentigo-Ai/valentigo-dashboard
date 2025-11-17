// pages/_app.js
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabase'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <SessionContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </ThemeProvider>
  )
}

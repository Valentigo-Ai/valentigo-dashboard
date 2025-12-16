"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // 1️⃣ Check existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        router.replace("/login");
        return;
      }

      setHydrated(true);
    };

    init();

    // 2️⃣ Listen for auth changes (Supabase v2 CORRECT way)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f12] text-white">
        Loading…
      </div>
    );
  }

  return children;
}

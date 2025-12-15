"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      // 1️⃣ Load existing session
      const { data: { session } } = await supabase.auth.getSession();

      if (!ignore) {
        setSession(session);

        if (!session) {
          router.replace("/login");
        }

        setHydrated(true);
      }

      // 2️⃣ Listen for login/logout
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          router.replace("/login");
        } else {
          setSession(session);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    };

    init();

    return () => {
      ignore = true;
    };
  }, [supabase, router]);

  // 3️⃣ Loading screen WHILE checking auth
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f12] text-white">
        <div className="w-80 space-y-4">
          <div className="h-5 shimmer rounded"></div>
          <div className="h-5 shimmer rounded w-5/6"></div>
          <div className="h-5 shimmer rounded w-3/4"></div>
        </div>

        <style jsx global>{`
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .shimmer {
            background: linear-gradient(
              to right,
              #1a1d22 0%,
              #2b2f36 50%,
              #1a1d22 100%
            );
            background-size: 800px 100%;
            animation: shimmer 2s infinite linear;
          }
        `}</style>
      </div>
    );
  }

  // 4️⃣ Authenticated content
  return <div className="fade-in">{children}</div>;
}

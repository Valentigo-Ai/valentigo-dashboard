"use client";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

let globalClient = null;

export function useSupabase() {
  const [client, setClient] = useState(globalClient);

  useEffect(() => {
    if (!globalClient) {
      globalClient = createBrowserSupabaseClient();
    }
    setClient(globalClient);
  }, []);

  return client;
}

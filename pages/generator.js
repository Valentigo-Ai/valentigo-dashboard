"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import PropertyDescriptionGenerator from "../components/PropertyDescriptionGenerator";

export default function GeneratorPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    loadUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  if (!user) {
    return <p className="p-8">Please log in to use this tool.</p>;
  }

  return (
    <div className="p-8">
      <PropertyDescriptionGenerator />
    </div>
  );
}

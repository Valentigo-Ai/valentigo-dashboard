import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

// Supabase client (browser-safe)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPassword() {
  const router = useRouter();
  const { token, type } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Validate recovery token from email link
  useEffect(() => {
    if (!router.isReady) return;

    if (!token || type !== "recovery") {
      setMessage("Invalid or expired reset link.");
      setLoading(false);
      return;
    }

    supabase.auth
      .exchangeCodeForSession(token)
      .then(({ error }) => {
        if (error) {
          setMessage("Reset link expired or already used.");
        }
        setLoading(false);
      });
  }, [router.isReady, token, type]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Validating reset link…</p>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Update password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

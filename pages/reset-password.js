import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPassword() {
  const router = useRouter();
  const { access_token, refresh_token, type } = router.query;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  // ✅ CRITICAL: exchange tokens for session
  useEffect(() => {
    if (!router.isReady) return;

    if (type !== "recovery" || !access_token || !refresh_token) {
      setMessage("Invalid or expired reset link.");
      return;
    }

    supabase.auth
      .setSession({
        access_token,
        refresh_token,
      })
      .then(({ error }) => {
        if (error) {
          setMessage("Reset link expired or already used.");
        } else {
          setReady(true);
        }
      });
  }, [router.isReady, access_token, refresh_token, type]);

  const handleReset = async () => {
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully!");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  if (!ready) return <p>{message || "Validating reset link..."}</p>;

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button onClick={handleReset}>Update password</button>

      {message && <p>{message}</p>}
    </div>
  );
}

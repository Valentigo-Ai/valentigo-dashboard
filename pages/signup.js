import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setMessage('Account created! Please check your email to confirm before logging in.');
      setLoading(false);
      return;
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-vgbg">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Valentigo" width={220} height={60} />
        </div>
        <form onSubmit={submit} className="card p-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
            Create a Valentigo account
          </h1>

          <label className="block mt-4" style={{ color: '#9aa6ad' }}>Email</label>
          <input
            type="email"
            className="mt-1 px-3 py-2 rounded-md border w-full bg-transparent text-gray-900"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label className="block mt-4" style={{ color: '#9aa6ad' }}>Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? 'text' : 'password'}
              className="px-3 py-2 rounded-md border w-full bg-transparent text-gray-900 pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <label className="block mt-4" style={{ color: '#9aa6ad' }}>Confirm Password</label>
          <div className="relative mt-1">
            <input
              type={showConfirm ? 'text' : 'password'}
              className="px-3 py-2 rounded-md border w-full bg-transparent text-gray-900 pr-10"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {message && (
            <p className="mt-4 text-sm text-red-500">{message}</p>
          )}

          <button className="mt-6 btn w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

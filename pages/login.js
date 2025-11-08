import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Login(){
  const [email,setEmail] = useState('');
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    localStorage.setItem('valentigo_user', JSON.stringify({email}));
    router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-vgbg">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Valentigo" width={220} height={60} />
        </div>
        <form onSubmit={submit} className="card p-8">
          <h1 className="text-2xl font-semibold" style={{color:"var(--accent)"}}>Welcome to Valentigo — AI Solutions for Estate Agents</h1>
          <label className="block mt-4" style={{color:"#9aa6ad"}}>Email</label>
          <input type="email" className="mt-1 px-3 py-2 rounded-md border w-full bg-transparent text-white" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="mt-6 btn w-full">Sign in</button>
        </form>
      </div>
    </div>
  )
}

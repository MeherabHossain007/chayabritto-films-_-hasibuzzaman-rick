'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // const res = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password }),
      // });

      // if (!res.ok) {
      //   const data = await res.json();
      //   throw new Error(data.error || 'Login failed');
      // }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-stone-950">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-800/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] 
          bg-gradient-radial from-primary-950/20 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
            bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-900/40 mb-6">
            <Camera size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl text-stone-100 mb-2">Chayabritto Films</h1>
          <p className="text-stone-500 text-sm tracking-wider uppercase">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-stone-900/60 backdrop-blur-xl border border-stone-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center">
              <Lock size={18} className="text-stone-400" />
            </div>
            <div>
              <h2 className="text-stone-200 font-medium text-sm">Secure Access</h2>
              <p className="text-stone-600 text-xs">Enter your admin password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-stone-400 uppercase tracking-[0.15em] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-stone-800/60 border border-stone-700/50 rounded-xl px-4 py-3.5
                  text-stone-200 text-sm placeholder:text-stone-600 
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 
                  transition-all"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-800/30">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3.5 rounded-xl font-medium text-sm tracking-wide uppercase 
                transition-all flex items-center justify-center gap-3
                bg-gradient-to-r from-primary-600 to-primary-500 text-white 
                hover:from-primary-500 hover:to-primary-400 
                shadow-lg shadow-primary-900/30 hover:shadow-primary-900/50
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-700 text-xs mt-6">
          © {new Date().getFullYear()} Chayabritto Films. All rights reserved.
        </p>
      </div>
    </div>
  );
}

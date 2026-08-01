"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to dashboard if already logged in
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Moderator Login</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xl mt-4 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

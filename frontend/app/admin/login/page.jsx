'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Menangkap error dari backend (misal: "username atau password salah")
        setErrorMsg(data.message || 'Gagal login. Cek kembali data Anda.');
        setIsLoading(false);
        return;
      }

      // 1. Simpan token JWT ke localStorage browser
      localStorage.setItem('admin_token', data.token);

      // 2. Arahkan admin ke halaman dashboard
      router.push('/admin/dashboard');

    } catch (error) {
      console.error("Error login:", error);
      setErrorMsg('Gagal terhubung ke server.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border-t-4 border-[#1A2D42]"
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 p-1 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-[#FBBF24] mb-4">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-[#1A2D42]">
            Login Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Panel Pengelola Pesantren Rahmatika
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center font-bold">
              {errorMsg}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#1A2D42] focus:border-[#1A2D42] focus:z-10 sm:text-sm"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#1A2D42] focus:border-[#1A2D42] focus:z-10 sm:text-sm"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-[#1A2D42] bg-[#FBBF24] hover:bg-[#FBBF24]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FBBF24] transition-all disabled:opacity-70"
            >
              {isLoading ? 'Memeriksa...' : 'Masuk ke Dashboard'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
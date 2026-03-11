'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Tambahan wajib untuk mendeteksi halaman saat ini

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 1. UBAH ARRAY MENU MENJADI OBJECT TEPAT SASARAN
  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Program Pendidikan", href: "/program" },
    { label: "Kontak", href: "/#kontak" }
  ];

  // FUNGSI SUPIR OTOMATIS: Untuk scroll mulus jika di halaman yang sama
  const handleScroll = (e, href) => {
    // Cek apakah link-nya mengandung tanda '#'
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      
      // Jika kita sedang berada di halaman Beranda ("/")
      if (pathname === '/') {
        e.preventDefault(); // Hentikan fungsi klik bawaan
        
        // TRIK JEDA: Tunggu 150 milidetik biar animasi menu HP selesai tertutup dulu
        setTimeout(() => {
          const elem = document.getElementById(targetId);
          if (elem) {
            // Geser layar ke elemen target dengan mulus
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update URL di browser tanpa me-reload halaman
            window.history.pushState(null, '', `#${targetId}`);
          }
        }, 150);
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link href="/" scroll={false} className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 p-1 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                <img src="/logo.png" alt="Logo PR" className="w-full h-full object-contain" />
            </div>
            {/* Teks Logo mengikuti warna Hitam logo aslinya */}
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#1A2D42] leading-tight">RAHMATIKA</span>
              <span className="text-xs text-gray-600 font-medium">AL-ATSARI</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            {/* 2. PEMANGGILAN ITEM DESKTOP DIUBAH */}
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href} 
                scroll={false} // <--- MANTAP! Ini yang bikin nggak lompat
                onClick={(e) => handleScroll(e, item.href)} // <-- Pasang fungsi scroll di sini
                // Warna teks abu-abu tua, saat hover berubah menjadi Emas
                className="text-gray-700 hover:text-[#FBBF24] font-medium transition-colors text-sm"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - Gunakan warna Biru Tua */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#1A2D42] focus:outline-none p-2 rounded-md hover:bg-gray-100">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-xl border-b border-gray-100"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {/* 3. PEMANGGILAN ITEM MOBILE DIUBAH */}
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href} 
                  scroll={false} // <--- TAMBAHAN DI SINI JUGA UNTUK HP
                  onClick={(e) => {
                    setIsOpen(false); // Tutup menu mobile
                    handleScroll(e, item.href); // <-- Pasang fungsi scroll di sini
                  }}
                  // Warna teks mobile menu abu-abu, hover menjadi Emas dengan background Biru Tua tipis
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-800 hover:text-[#FBBF24] hover:bg-[#1A2D42]/5 transition-all"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Tambahan Tombol PSB (Diubah jadi tag <a> karena URL eksternal) */}
              <a 
                href="https://pesantrenrahmatika.or.id/informasi-ppdb-tahun-pelajaran-2026-2027/" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-lg text-base font-bold bg-[#FBBF24] text-[#1A2D42] mt-4"
              >
                DAFTAR PSB
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
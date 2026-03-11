import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div 
      // Background Biru Tua mengikuti warna utama logo
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2D42]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="flex flex-col items-center p-4"
      >
        {/* Logo Pesantren Sekarang Menggunakan File Logo Asli */}
        <div className="w-32 h-32 md:w-48 md:h-48 mb-6 p-2 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-[#FBBF24]">
           <img 
            src="/logo.png" 
            alt="Logo Pesantren Rahmatika Al-Atsari" 
            className="w-full h-full object-contain"
           />
        </div>
        
        {/* Teks di bawah logo (Opsional, karena di logo sudah ada teks) */}
        {/* Kita gunakan warna Emas untuk menonjolkan nama */}
        <h1 className="text-[#FBBF24] text-xl md:text-2xl font-bold tracking-wider text-center uppercase">
          RAHMATIKA AL-ATSARI
        </h1>
        <p className="text-white text-sm md:text-base mt-2 font-light">Subang - Jawa Barat</p>
      </motion.div>
    </motion.div>
  );
}
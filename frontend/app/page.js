'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import Navbar from '@/components/Navbar';

// Import Swiper React components & styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [banners, setBanners] = useState([]);
  const [psbInfo, setPsbInfo] = useState(null);
  const [profile, setProfile] = useState(null);

useEffect(() => {
    // 1. Fungsi untuk menarik data dari backend (Tetap berjalan di latar belakang)
    const fetchPublicData = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      try {
        const [resBanners, resPsb, resProfile] = await Promise.all([
          fetch(`${API_URL}/banners`),
          fetch(`${API_URL}/psb`),
          fetch(`${API_URL}/profile`)
        ]);

        const dataBanners = await resBanners.json();
        const dataPsb = await resPsb.json();
        const dataProfile = await resProfile.json();

        if (dataBanners.status === 'success' && dataBanners.data) setBanners(dataBanners.data);
        if (dataPsb.status === 'success' && dataPsb.data) setPsbInfo(dataPsb.data);
        if (dataProfile.status === 'success' && dataProfile.data) setProfile(dataProfile.data);

      } catch (error) {
        console.error("Gagal mengambil data dari backend:", error);
      }
    };

    fetchPublicData();

    // 2. LOGIKA SMART SPLASH SCREEN MENGGUNAKAN SESSION STORAGE
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
      // Jika browser ingat user sudah lihat, matikan loading detik itu juga!
      setIsLoading(false);
    } else {
      // Jika belum pernah lihat (baru buka web), jalankan timer
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Simpan ingatan ke browser bahwa user sudah melewati loading
        sessionStorage.setItem('hasSeenSplash', 'true'); 
      }, 5000); // Sesuaikan dengan durasi animasimu

      return () => clearTimeout(timer);
    }
  }, []);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '');
  
  return (
    <main className="relative w-full min-h-screen bg-gray-50 overflow-hidden font-sans">
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="w-full">
          <Navbar />
          
          {/* --- HERO SECTION / BANNER SLIDER --- */}
          <section className="relative w-full h-[100vh] pt-20 bg-[#1A2D42]">
            {banners && banners.length > 0 ? (
              <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
              >
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id} className="relative w-full h-full">
                    {/* Gambar Banner dari Backend menggunakan URL Dinamis */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${BACKEND_URL}${banner.image_url})` }}
                    />
                    {/* Overlay Hitam Transparan agar teks tetap terbaca */}
                    <div className="absolute inset-0 bg-[#1A2D42]/60 mix-blend-multiply" />
                    
                    {/* Konten Teks Banner */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto z-10">
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg"
                      >
                        {banner.title}
                      </motion.h2>
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 text-xl text-[#FBBF24] font-medium drop-shadow-md"
                      >
                        {banner.subtitle}
                      </motion.p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              /* --- TAMPILAN DEFAULT JIKA BANNER KOSONG --- */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-[#1A2D42] to-blue-900 z-10">
                {/* Pola Islami Transparan (Opsional, efek visual saja) */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
                
                <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight z-10">
                  Selamat Datang di Web Resmi
                </h2>
                <p className="text-[#FBBF24] text-xl md:text-3xl font-bold mt-4 tracking-wide uppercase z-10">
                  Pesantren Rahmatika Al-Atsari
                </p>
                <p className="text-gray-300 mt-6 max-w-3xl text-lg font-light leading-relaxed z-10">
                  {profile ? profile.about : "Mewujudkan generasi bertauhid yang unggul dalam ilmu dan mulia dalam akhlak, berlandaskan Al-Qur'an dan As-Sunnah sesuai pemahaman Salafus Shalih."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-10 z-10">
                    <button className="px-8 py-3 bg-[#FBBF24] text-[#1A2D42] rounded-full font-bold shadow-lg hover:bg-[#FBBF24]/90 transition-all border-2 border-[#FBBF24]">
                        Profil Pesantren
                    </button>
                    <button className="px-8 py-3 bg-transparent text-white rounded-full font-bold shadow-lg hover:bg-white/10 transition-all border-2 border-white">
                        Hubungi Kami
                    </button>
                </div>
              </div>
            )}

            {/* --- ALERT INFO PSB (Melayang di bawah Hero) --- */}
            {psbInfo && psbInfo.is_open && (
              <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1/2 px-4">
                <div className="max-w-4xl mx-auto bg-[#FBBF24] text-[#1A2D42] p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between border-4 border-white">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📢</span>
                    <div>
                      <h3 className="font-extrabold text-lg">PENGUMUMAN PSB</h3>
                      <p className="font-medium text-sm">{psbInfo.announcement_text}</p>
                    </div>
                  </div>
                  <a 
                    href={psbInfo.registration_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-4 md:mt-0 px-6 py-2 bg-[#1A2D42] text-white rounded-lg font-bold hover:bg-[#1A2D42]/80 transition-all text-sm whitespace-nowrap"
                  >
                    Daftar Sekarang
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* Spacer untuk memberi ruang Alert PSB */}
          <div className="h-24 bg-gray-50 w-full"></div>

          {/* --- SECTION PROFIL PESANTREN --- */}
          {profile && (
            <section className="py-24 bg-white px-4 relative">
              <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-extrabold text-[#1A2D42] mb-4"
                  >
                    Mengenal Pesantren Rahmatika
                  </motion.h2>
                  <motion.div 
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="w-24 h-1 bg-[#FBBF24] mx-auto rounded-full"
                  ></motion.div>
                </div>

                {/* Teks Tentang Pesantren */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-4xl mx-auto text-center mb-20"
                >
                  <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                    {profile.about}
                  </p>
                </motion.div>

                {/* Grid Visi & Misi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Card Visi */}
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gray-50 p-8 md:p-10 rounded-3xl border-t-8 border-[#1A2D42] shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#1A2D42] text-[#FBBF24] rounded-2xl flex items-center justify-center text-3xl shadow-md">
                        🎯
                      </div>
                      <h3 className="text-3xl font-bold text-[#1A2D42]">Visi</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {profile.vision}
                    </p>
                  </motion.div>

                  {/* Card Misi */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gray-50 p-8 md:p-10 rounded-3xl border-t-8 border-[#FBBF24] shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#FBBF24] text-[#1A2D42] rounded-2xl flex items-center justify-center text-3xl shadow-md">
                        🚀
                      </div>
                      <h3 className="text-3xl font-bold text-[#1A2D42]">Misi</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {profile.mission}
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* --- SECTION KONTAK & LOKASI --- */}
          <section id="kontak" className="py-20 bg-gray-50 relative border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 mb-16">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A2D42] mb-4">Hubungi Kami</h2>
                <div className="w-24 h-1.5 bg-[#FBBF24] mx-auto rounded-full mb-6"></div>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">Punya pertanyaan seputar pendaftaran atau ingin konfirmasi transfer? Jangan ragu untuk menghubungi layanan informasi kami.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Info Kontak Umum */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-center space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A2D42] mb-6 flex items-center gap-2">📞 Layanan Informasi</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#FBBF24] transition-colors">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">📱</div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">WhatsApp Pesantren</p>
                          <p className="font-bold text-[#1A2D42] text-lg">0822 1970 2288</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#1A2D42] transition-colors">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">☎️</div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Telepon Kantor</p>
                          <p className="font-bold text-[#1A2D42] text-lg">0260 7481 974</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rekening Putra */}
                <div className="bg-gradient-to-br from-[#1A2D42] to-slate-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
                  <div>
                    <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-bold tracking-wider mb-6 inline-block">SANTRI PUTRA (IKHWAN)</span>
                    <p className="text-gray-300 text-sm mb-1">Bank Syariah Indonesia (BSI)</p>
                    <h4 className="text-3xl font-extrabold tracking-widest mb-2 font-mono drop-shadow-md">7100 6677 59</h4>
                    <p className="text-[#FBBF24] font-medium text-lg">a.n Pondok Pesantren Rahmatika</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-xs text-gray-400 mb-2">Konfirmasi Transfer via WhatsApp:</p>
                    <a href="https://wa.me/6282240519017" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm w-full justify-center shadow-lg">
                      Konfirmasi Ikhwan (0822 4051 9017)
                    </a>
                  </div>
                </div>

                {/* Rekening Putri */}
                <div className="bg-gradient-to-br from-[#FBBF24] to-amber-600 p-8 rounded-3xl shadow-xl text-[#1A2D42] relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl"></div>
                  <div>
                    <span className="px-4 py-1.5 bg-[#1A2D42]/10 rounded-full text-sm font-bold tracking-wider mb-6 inline-block">SANTRI PUTRI (AKHWAT)</span>
                    <p className="text-[#1A2D42]/80 text-sm mb-1 font-medium">Bank Syariah Indonesia (BSI)</p>
                    <h4 className="text-3xl font-extrabold tracking-widest mb-2 font-mono drop-shadow-md">7100 6677 67</h4>
                    <p className="font-bold text-lg">a.n Pondok Pesantren Rahmatika</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#1A2D42]/10">
                    <p className="text-xs text-[#1A2D42]/70 mb-2 font-bold">Konfirmasi Transfer via WhatsApp:</p>
                    <a href="https://wa.me/6282240519018" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#1A2D42] hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm w-full justify-center shadow-lg">
                      Konfirmasi Akhwat (0822 4051 9018)
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Peta Lokasi Full Width & Floating Card */}
            <div className="relative w-full h-[500px]">
              {/* iFrame Google Maps Asli dengan pencarian otomatis lokasi pesantren */}
              <iframe 
                src="https://maps.google.com/maps?q=Pondok+Pesantren+Rahmatika+Al-Atsari+Subang&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
              
              {/* Overlay Hitam transparan di tepi atas peta biar nyatu sama background */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>

              {/* Floating Address Card */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] md:max-w-md bg-white p-6 rounded-2xl shadow-2xl border-b-4 border-[#1A2D42] z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">📍</div>
                  <div>
                    <h3 className="font-extrabold text-[#1A2D42] text-lg mb-2">Lokasi Pesantren</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Jl. Raya Sagalaherang Desa Dayeuhkolot RT 05/02 Kecamatan Sagalaherang, Kabupaten Subang 41282
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
        </motion.div>
      )}
    </main>
  );
}
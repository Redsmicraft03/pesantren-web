'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar'; // Sesuaikan lokasi komponen Navbar-mu
import { BookOpen, GraduationCap, Award, Users, Shield, Target, Globe, BookMarked, Activity } from 'lucide-react';

export default function ProgramPendidikan() {
  // // Data Jenjang Pendidikan (Update Sesuai Data Asli)
  const academicPrograms = [
    {
      id: 'sd',
      title: 'SDITQ Al-Atsari',
      level: 'Tingkat Dasar',
      akreditasi: 'B (Baik)',
      description: 'Membangun pondasi tauhid, adab islami, dan kecintaan terhadap Al-Qur\'an sejak usia dini dalam lingkungan yang asri dan menyenangkan.',
      highlights: ['Hafalan Juz 30', 'Adab & Akhlak Harian', 'Calistung Menyenangkan', 'Pengenalan Bahasa Arab'],
      color: 'from-emerald-400 to-emerald-600',
      icon: BookOpen
    },
    {
      id: 'smp',
      title: 'SMP Terpadu Rahmatika',
      level: 'Tingkat Menengah Pertama',
      akreditasi: 'B (Baik)',
      description: 'Membentuk karakter santri yang mandiri, disiplin, dan memiliki dasar ilmu syar\'i yang kuat serta mampu berkomunikasi dasar berbahasa Arab.',
      highlights: ['Target Hafalan 6 Juz (1 Juz/Semester)', 'Hafalan Matan & Hadits', 'Praktek Dakwah', 'Bahasa Arab Aktif', 'Kemandirian Asrama'],
      color: 'from-blue-400 to-blue-600',
      icon: Users
    },
    {
      id: 'sma',
      title: 'SMA Terpadu Rahmatika',
      level: 'Tingkat Menengah Atas',
      akreditasi: 'B (Baik)',
      description: 'Mempersiapkan generasi pemimpin masa depan yang beraqidah lurus, siap melanjutkan ke jenjang perguruan tinggi atau ma\'had \'aly.',
      highlights: ['Target Hafalan 6 Juz (1 Juz/Semester)', 'Pendalaman Ilmu-ilmu Islam', 'Hafalan Matan & Hadits', 'Praktek Dakwah', 'Persiapan Universitas'],
      color: 'from-[#1A2D42] to-slate-800',
      icon: GraduationCap
    }
  ];

  // Data Ekstrakurikuler yang sudah dikelompokkan
  const extracurriculars = [
    {
      category: 'Olahraga & Fisik',
      icon: Activity,
      items: ['Futsal', 'Bola Basket', 'Volley Ball', 'Badminton', 'Tenis Meja']
    },
    {
      category: 'Beladiri & Ketangkasan',
      icon: Shield,
      items: ['Karate', 'Pramuka']
    },
    {
      category: 'Minat & Bakat Khusus',
      icon: Target,
      items: ['Jurnalistik', 'Kewirausahaan', 'PMR', 'Childhood Activity']
    },
    {
      category: 'Bahasa & Keislaman',
      icon: Globe,
      items: ['Tahsin & Tajwid Al-Quran', 'English Club', 'Arabic Club', 'Kemuslimahan']
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans selection:bg-[#FBBF24] selection:text-[#1A2D42]">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 bg-[#1A2D42] text-white overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white/20"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full border-[20px] border-[#FBBF24]/30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-4 py-1.5 rounded-full bg-[#FBBF24] text-[#1A2D42] font-bold text-sm tracking-widest uppercase mb-6 inline-block">
              Akademik & Pengembangan Diri
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Program Pendidikan <br/> <span className="text-[#FBBF24]">Pesantren Rahmatika</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Kami menyelenggarakan pendidikan terpadu dari tingkat dasar hingga menengah atas, dikombinasikan dengan program ekstrakurikuler untuk mencetak generasi Rabbani yang unggul.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- JENJANG PENDIDIKAN SECTION --- */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2D42]">Jenjang Pendidikan Formal</h2>
            <div className="w-20 h-1.5 bg-[#FBBF24] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {academicPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <motion.div 
                  key={program.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2, duration: 0.5 }} viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
                >
                  {/* Efek Garis Atas */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${program.color}`}></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${program.color} text-white shadow-lg`}>
                      <Icon size={32} />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                      Akreditasi {program.akreditasi}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#FBBF24] uppercase tracking-wider mb-1">{program.level}</p>
                  <h3 className="text-2xl font-extrabold text-[#1A2D42] mb-4">{program.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-8 h-24 overflow-hidden">
                    {program.description}
                  </p>

                  <div className="space-y-3">
                    <p className="font-bold text-sm text-[#1A2D42] border-b pb-2">Fokus Unggulan:</p>
                    <ul className="space-y-2">
                      {program.highlights.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- EKSTRAKURIKULER SECTION (BENTO GRID STYLE) --- */}
      <section className="py-20 bg-gray-50 relative border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A2D42] mb-4">Pengembangan Diri (Ekskul)</h2>
              <p className="text-gray-600 max-w-2xl text-lg">Wadah bagi santri untuk menyalurkan minat, mengasah bakat, dan melatih jiwa kepemimpinan di luar jam pelajaran kelas.</p>
            </div>
            <Award size={64} className="text-[#FBBF24] opacity-80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {extracurriculars.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1, duration: 0.4 }} viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-[#1A2D42] leading-tight">{category.category}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-50 hover:bg-[#FBBF24] hover:text-[#1A2D42] text-gray-600 text-sm font-medium rounded-lg border border-gray-200 transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
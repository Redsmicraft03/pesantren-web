'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Image as ImageIcon, Megaphone, FileText, LogOut, Menu, X, Trash2, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  // --- STATE UMUM ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE DASHBOARD STATS ---
  const [stats, setStats] = useState({ banners: 0, psbOpen: false, profileFilled: false });
  const [isLoadingStats, setIsLoadingStats] = useState(true); // <--- INI YANG TADI HILANG

  // --- STATE PSB ---
  const [psbIsOpen, setPsbIsOpen] = useState(false);
  const [psbAnnouncement, setPsbAnnouncement] = useState('');
  const [psbLink, setPsbLink] = useState('');
  const [isSavingPsb, setIsSavingPsb] = useState(false);
  const [psbMessage, setPsbMessage] = useState({ type: '', text: '' });

  // --- STATE PROFIL ---
  const [profileAbout, setProfileAbout] = useState('');
  const [profileVision, setProfileVision] = useState('');
  const [profileMission, setProfileMission] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // --- STATE BANNER ---
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [bannerImageBase64, setBannerImageBase64] = useState('');
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState({ type: '', text: '' });
  const [existingBanners, setExistingBanners] = useState([]);
  const [isLoadingExistingBanners, setIsLoadingExistingBanners] = useState(true);


  // ==========================================
  // 1. EFEK & LOAD DATA AWAL
  // ==========================================

  // Cek Keamanan Token (Yang tadi tertimpa)
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Load Statistik Dashboard
  useEffect(() => {
    const fetchDashboardStats = async () => {
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

        setStats({
          banners: dataBanners.data ? dataBanners.data.length : 0,
          psbOpen: dataPsb.data ? dataPsb.data.is_open : false,
          profileFilled: dataProfile.data ? (!!dataProfile.data.about && !!dataProfile.data.vision) : false
        });
      } catch (error) {
        console.error("Gagal mengambil statistik dashboard", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // Load Data Sesuai Tab Aktif
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    if (activeTab === 'psb') {
      fetch(`${API_URL}/psb`).then(res => res.json()).then(data => {
        if (data.status === 'success' && data.data) {
          setPsbIsOpen(data.data.is_open);
          setPsbAnnouncement(data.data.announcement_text);
          setPsbLink(data.data.registration_link);
        }
      });
    } else if (activeTab === 'profile') {
      fetch(`${API_URL}/profile`).then(res => res.json()).then(data => {
        if (data.status === 'success' && data.data) {
          setProfileAbout(data.data.about || '');
          setProfileVision(data.data.vision || '');
          setProfileMission(data.data.mission || '');
        }
      });
    } else if (activeTab === 'banners') {
      setIsLoadingExistingBanners(true);
      fetch(`${API_URL}/banners`).then(res => res.json()).then(data => {
        if (data.status === 'success' && data.data) setExistingBanners(data.data);
      }).finally(() => setIsLoadingExistingBanners(false));
    }
  }, [activeTab]);


  // ==========================================
  // 2. FUNGSI-FUNGSI AKSI
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const handleSavePsb = async (e) => {
    e.preventDefault();
    setIsSavingPsb(true);
    setPsbMessage({ type: '', text: '' });
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/psb`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ is_open: psbIsOpen, announcement_text: psbAnnouncement, registration_link: psbLink })
      });
      const data = await res.json();
      if (res.ok) setPsbMessage({ type: 'success', text: 'Info PSB berhasil diperbarui!' });
      else setPsbMessage({ type: 'error', text: data.message || 'Gagal menyimpan data.' });
    } catch (error) {
      setPsbMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally { setIsSavingPsb(false); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage({ type: '', text: '' });
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ about: profileAbout, vision: profileVision, mission: profileMission })
      });
      const data = await res.json();
      if (res.ok) setProfileMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      else setProfileMessage({ type: 'error', text: data.message || 'Gagal menyimpan profil.' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally { setIsSavingProfile(false); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setBannerImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerImageBase64) {
      setBannerMessage({ type: 'error', text: 'Mohon pilih gambar banner terlebih dahulu!' });
      return;
    }
    setIsSavingBanner(true);
    setBannerMessage({ type: '', text: '' });
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: bannerTitle, subtitle: bannerSubtitle, image_base64: bannerImageBase64 })
      });
      const data = await res.json();
      if (res.ok) {
        setBannerMessage({ type: 'success', text: 'Banner baru berhasil ditambahkan!' });
        setBannerTitle(''); setBannerSubtitle(''); setBannerImagePreview(null); setBannerImageBase64('');
        // Refresh daftar banner
        const resBanners = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        const dataBanners = await resBanners.json();
        if(dataBanners.status === 'success') setExistingBanners(dataBanners.data || []);
      } else setBannerMessage({ type: 'error', text: data.message || 'Gagal menyimpan banner.' });
    } catch (error) {
      setBannerMessage({ type: 'error', text: 'Terjadi kesalahan jaringan saat upload.' });
    } finally { setIsSavingBanner(false); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus banner ini?")) return;
    const token = localStorage.getItem('admin_token');
    const originalBanners = [...existingBanners]; 
    setExistingBanners(prev => prev.filter(banner => banner.id !== id));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/banners/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) alert('Banner berhasil dihapus.');
      else { setExistingBanners(originalBanners); alert(data.message || 'Gagal menghapus banner.'); }
    } catch (error) {
      console.error("Error deleting banner:", error);
      setExistingBanners(originalBanners); alert('Terjadi kesalahan jaringan.');
    }
  };


  // ==========================================
  // 3. TAMPILAN UI (JSX)
  // ==========================================
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil Pesantren', icon: FileText },
    { id: 'psb', label: 'Info PSB', icon: Megaphone },
    { id: 'banners', label: 'Kelola Banner', icon: ImageIcon },
  ];

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat Panel Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1A2D42] text-white rounded-md shadow-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ x: -250 }} animate={{ x: 0 }} exit={{ x: -250 }} className="fixed md:static w-64 h-screen bg-[#1A2D42] text-white z-40 flex flex-col shadow-2xl">
            <div className="flex items-center gap-3 p-6 border-b border-gray-700">
              <div className="w-10 h-10 bg-white rounded-full p-1">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="font-bold text-[#FBBF24] leading-tight">Admin Panel</h2>
                <p className="text-xs text-gray-300">Rahmatika Al-Atsari</p>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${activeTab === item.id ? 'bg-[#FBBF24] text-[#1A2D42] shadow-md' : 'text-gray-300 hover:bg-[#FBBF24]/10 hover:text-white'}`}>
                    <Icon size={20} /> {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-medium"><LogOut size={20} /> Keluar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 h-screen overflow-y-auto w-full">
        <header className="bg-white shadow-sm px-8 py-5 flex items-center justify-between ml-12 md:ml-0">
          <h1 className="text-2xl font-bold text-[#1A2D42] capitalize flex items-center gap-2">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
        </header>

        <main className="p-8">
          
          {/* TAB DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-3xl font-extrabold text-[#1A2D42] mb-2">Ahlan wa Sahlan, Admin!</h2>
                <p className="text-gray-600 mb-8 max-w-2xl">Selamat datang di pusat kendali website Pesantren Rahmatika Al-Atsari. Silakan pilih menu di samping untuk mulai memperbarui data website.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-xl border flex items-center gap-4 ${stats.profileFilled ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`p-4 rounded-full ${stats.profileFilled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}><FileText size={24}/></div>
                    <div><p className="text-sm text-gray-500">Profil</p><p className={`font-bold ${stats.profileFilled ? 'text-emerald-900' : 'text-red-900'}`}>{isLoadingStats ? '...' : (stats.profileFilled ? 'Lengkap' : 'Belum Lengkap')}</p></div>
                  </div>
                  <div className={`p-6 rounded-xl border flex items-center gap-4 ${stats.psbOpen ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`p-4 rounded-full ${stats.psbOpen ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'}`}><Megaphone size={24}/></div>
                    <div><p className="text-sm text-gray-500">Status PSB</p><p className={`font-bold ${stats.psbOpen ? 'text-amber-900' : 'text-gray-900'}`}>{isLoadingStats ? '...' : (stats.psbOpen ? 'Buka Pendaftaran' : 'Tutup')}</p></div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-full"><ImageIcon size={24}/></div>
                    <div><p className="text-sm text-gray-500">Banner Home</p><p className="font-bold text-[#1A2D42]">{isLoadingStats ? '...' : `${stats.banners} Gambar Aktif`}</p></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB PROFIL */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1A2D42] mb-6 border-b pb-4">Pengaturan Profil Pesantren</h2>
              {profileMessage.text && <div className={`p-4 mb-6 rounded-lg font-bold ${profileMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{profileMessage.text}</div>}
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div><label className="block font-bold text-gray-700 mb-2">Tentang Pesantren</label><textarea rows="4" required value={profileAbout} onChange={(e) => setProfileAbout(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white" /></div>
                <div><label className="block font-bold text-gray-700 mb-2">Visi</label><textarea rows="3" required value={profileVision} onChange={(e) => setProfileVision(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white" /></div>
                <div><label className="block font-bold text-gray-700 mb-2">Misi</label><textarea rows="5" required value={profileMission} onChange={(e) => setProfileMission(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white whitespace-pre-line" /></div>
                <button type="submit" disabled={isSavingProfile} className="w-full py-3 bg-[#1A2D42] text-white font-bold rounded-lg hover:bg-[#1A2D42]/90 disabled:opacity-70 mt-4">{isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}</button>
              </form>
            </motion.div>
          )}

          {/* TAB PSB */}
          {activeTab === 'psb' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1A2D42] mb-6 border-b pb-4">Pengaturan Info PSB</h2>
              {psbMessage.text && <div className={`p-4 mb-6 rounded-lg font-bold ${psbMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{psbMessage.text}</div>}
              <form onSubmit={handleSavePsb} className="space-y-6">
                <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div><h3 className="font-bold text-gray-800">Status Pendaftaran</h3><p className="text-sm text-gray-500">Tampilkan pengumuman PSB di web.</p></div>
                  <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" checked={psbIsOpen} onChange={(e) => setPsbIsOpen(e.target.checked)} /><div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FBBF24]"></div></label>
                </div>
                <div><label className="block font-bold text-gray-700 mb-2">Teks Pengumuman</label><textarea rows="3" required value={psbAnnouncement} onChange={(e) => setPsbAnnouncement(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white" /></div>
                <div><label className="block font-bold text-gray-700 mb-2">Link Pendaftaran</label><input type="url" required value={psbLink} onChange={(e) => setPsbLink(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white" /></div>
                <button type="submit" disabled={isSavingPsb} className="w-full py-3 bg-[#1A2D42] text-white font-bold rounded-lg hover:bg-[#1A2D42]/90 disabled:opacity-70">{isSavingPsb ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
              </form>
            </motion.div>
          )}

          {/* TAB BANNERS */}
          {activeTab === 'banners' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 max-w-6xl">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1A2D42] mb-6 border-b pb-4 flex items-center gap-2">✨ Tambah Banner Slider Baru</h2>
                {bannerMessage.text && <div className={`p-4 mb-6 rounded-lg font-bold ${bannerMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{bannerMessage.text}</div>}
                <form onSubmit={handleSaveBanner} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div><label className="block font-bold text-gray-700 mb-2">Judul Banner (Besar)</label><input type="text" required value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white"/></div>
                      <div><label className="block font-bold text-gray-700 mb-2">Sub-judul (Kecil)</label><textarea rows="4" required value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-gray-900 bg-white"></textarea></div>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-2">Gambar Banner</label>
                      <div className="flex items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative">
                        <label className="w-full h-full flex flex-col items-center justify-center">
                          {bannerImagePreview ? <img src={bannerImagePreview} alt="Preview" className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center text-gray-500"><ImageIcon size={48} className="mb-4 opacity-50" /><p className="font-bold">Klik pilih gambar</p></div>}
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" disabled={isSavingBanner} className="w-full py-4 bg-[#FBBF24] text-[#1A2D42] font-extrabold rounded-xl hover:bg-[#FBBF24]/90 disabled:opacity-70 shadow-lg">{isSavingBanner ? 'Sedang Memproses...' : 'Unggah & Simpan Banner'}</button>
                </form>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1A2D42] mb-6 border-b pb-4 flex items-center gap-2">📁 Daftar Banner Saat Ini</h2>
                {isLoadingExistingBanners ? <div className="flex justify-center text-gray-500 py-10"><Loader2 className="animate-spin mr-2" /> Memuat data...</div> : existingBanners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {existingBanners.map(banner => (
                      <motion.div layout key={banner.id} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative group">
                        <div className="w-full h-40 overflow-hidden relative">
                          <img src={`http://localhost:8081${banner.image_url}`} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => handleDeleteBanner(banner.id)} className="p-3 bg-red-600 text-white rounded-full"><Trash2 size={24} /></button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-[#1A2D42] bg-amber-100 text-amber-900 text-sm px-2 py-0.5 rounded-full inline-block">ID: {banner.id}</h4>
                          <p className="text-gray-900 font-bold mt-2 truncate">{banner.title}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : <div className="text-center py-10 text-gray-500">Belum ada banner aktif.</div>}
              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}
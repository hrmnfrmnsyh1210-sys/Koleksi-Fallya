/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useInView } from "motion/react";
import { ArrowRight, Feather, Search, X, MapPin, Youtube, Play, BookOpen, Compass, Map } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

function Counter({ end, label, duration = 2.5, colorClass = "text-blue-600" }: { end: number, label: string, duration?: number, colorClass?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-white transition-transform hover:-translate-y-1 duration-300">
      <span className={`text-5xl md:text-6xl font-bold mb-3 ${colorClass}`}>
        {count.toLocaleString('id-ID')}{end > 1000000 || end === 4500 ? '+' : ''}
      </span>
      <span className="text-xs font-bold tracking-widest uppercase text-slate-500 text-center">
        {label}
      </span>
    </div>
  );
}

const geoUrl = "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json";

const data = [
  { id: "ID-JA", value: 18500 },
  { id: "ID-SU", value: 12000 },
  { id: "ID-KA", value: 4500 },
  { id: "ID-SL", value: 3000 },
  { id: "ID-PA", value: 2000 },
  { id: "ID-NU", value: 1500 },
];

const colorScale = scaleQuantile<string>()
  .domain([1000, 20000])
  .range([
    "#E0F2FE", // sky-100
    "#BAE6FD", // sky-200
    "#7DD3FC", // sky-300
    "#38BDF8", // sky-400
    "#0EA5E9", // sky-500
    "#0284C7", // sky-600
    "#0369A1", // sky-700
  ]);

function LibraryMap() {
  const legendIntervals = [
    { label: "< 2.000", color: "#E0F2FE" },
    { label: "2.001 - 4.000", color: "#BAE6FD" },
    { label: "4.001 - 6.000", color: "#7DD3FC" },
    { label: "6.001 - 8.000", color: "#38BDF8" },
    { label: "8.001 - 10.000", color: "#0EA5E9" },
    { label: "10.001 - 12.000", color: "#0284C7" },
    { label: "12.001 - 14.000", color: "#0369A1" },
    { label: "> 14.000", color: "#075985" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-12 relative shadow-2xl shadow-sky-900/5 overflow-hidden border border-slate-100">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
          <Map className="w-6 h-6" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
          Sebaran Pustaka Nusantara
        </h3>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex-1 min-h-[400px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1200, center: [118, -2] }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const cur = data.find((s) => s.id === geo.id);
                  const mockValue = cur ? cur.value : Math.floor(Math.random() * 10000) + 1000;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(mockValue)}
                      stroke="#FFFFFF"
                      strokeWidth={1}
                      style={{
                        default: { outline: "none", transition: "all 250ms" },
                        hover: { fill: "#F59E0B", outline: "none", cursor: "pointer", transition: "all 250ms" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
        
        <div className="w-48 lg:w-48 lg:border-l border-slate-100 lg:pl-8 flex flex-col pt-4">
          <h4 className="text-sm font-bold tracking-wider text-slate-800 mb-4 uppercase">Total Koleksi</h4>
          <div className="space-y-4">
            {legendIntervals.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div 
                  className="h-4 w-4 rounded-full shadow-sm" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="text-sm font-medium text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-slate-100 pt-8 gap-6 relative z-10">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white transition-all text-slate-500 flex items-center justify-center font-bold cursor-pointer shadow-sm">f</div>
          <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-600 hover:text-white transition-all text-slate-500 flex items-center justify-center font-bold cursor-pointer shadow-sm">ig</div>
          <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white transition-all text-slate-500 flex items-center justify-center font-bold cursor-pointer shadow-sm">X</div>
          <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white transition-all text-slate-500 flex items-center justify-center font-bold cursor-pointer shadow-sm">tk</div>
        </div>
        <div>
          <div className="bg-white rounded-2xl p-4 flex flex-col inline-block shadow-lg border border-slate-100">
             <div className="font-bold text-[10px] uppercase text-slate-400 tracking-widest mb-3 text-center">Visitor Analytics</div>
             <div className="flex gap-6">
               <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                 <img src="https://flagcdn.com/20x15/id.png" alt="Indonesia" className="rounded-sm shadow-sm" />
                 1.2M
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                 <img src="https://flagcdn.com/20x15/us.png" alt="USA" className="rounded-sm shadow-sm" />
                 120
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const realVideos = [
  {
    id: "NJjhUbQzuMI",
    title: "Mozart at the Morgan | Collection in Focus",
    duration: "4:04",
    thumbnail: "https://i.ytimg.com/vi/NJjhUbQzuMI/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "LfPPfSVtnKE",
    title: "Wolfgang Amadeus Mozart: Treasures from the Mozarteum Foundation of Salzburg",
    duration: "3:12",
    thumbnail: "https://i.ytimg.com/vi/LfPPfSVtnKE/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "yy1OY-FnVJY",
    title: "Lecture | Francesca Cappelletti: Caravaggio in Focus",
    duration: "58:08",
    thumbnail: "https://i.ytimg.com/vi/yy1OY-FnVJY/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "_6ImWqiYoMA",
    title: "Instruments of Affection: Mozart's Violin in Concert with Sonnambula",
    duration: "1:07:22",
    thumbnail: "https://i.ytimg.com/vi/_6ImWqiYoMA/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "yJIK8IvSlQI",
    title: "Come Together: 3,000 Years of Stories and Storytelling",
    duration: "2:52",
    thumbnail: "https://i.ytimg.com/vi/yJIK8IvSlQI/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "onJnQ8b7Ews",
    title: "Symposium | A Draftsman of the First Order: Renoir’s Drawing Practice, Part II",
    duration: "1:44:27",
    thumbnail: "https://i.ytimg.com/vi/onJnQ8b7Ews/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "AUVmaQ74XUQ",
    title: "Now at the Morgan | Wolfgang Amadeus Mozart: Treasures from the Mozarteum Foundation of Salzburg",
    duration: "0:59",
    thumbnail: "https://i.ytimg.com/vi/AUVmaQ74XUQ/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "OCpmy578dwg",
    title: "\"Come Together: 3,000 Years of Stories and Storytelling\" now on view!",
    duration: "0:15",
    thumbnail: "https://i.ytimg.com/vi/OCpmy578dwg/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  },
  {
    id: "u5L6GYI8jp4",
    title: "Wolfgang Amadeus Mozart: Treasures from the Mozarteum comes to the Morgan!",
    duration: "0:30",
    thumbnail: "https://i.ytimg.com/vi/u5L6GYI8jp4/hqdefault.jpg",
    channel: "The Morgan Library & Museum"
  }
];

function YoutubePreview() {
  const [visibleVideos, setVisibleVideos] = useState(3);
  const totalMockVideos = realVideos.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 max-w-5xl mx-auto overflow-hidden shadow-2xl shadow-sky-900/5 relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-100 pb-8 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-red-600 to-pink-500 rounded-2xl flex items-center justify-center text-white font-serif italic text-4xl shadow-lg shadow-red-500/30 shrink-0 transform -rotate-3">
            M
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">The Morgan Library &amp; Museum</h2>
            <div className="text-slate-500 text-sm mt-2 flex gap-4 font-medium">
               <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600"><strong>471</strong> Videos</span>
               <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600"><strong>48K</strong> Subs</span>
               <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600"><strong>7.5M</strong> Views</span>
            </div>
          </div>
        </div>
        <a 
          href="https://www.youtube.com/channel/UC2scvd9X4GX5-qSYrNSsSIw" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-600/30"
        >
          <Youtube className="w-5 h-5" />
          Kunjungi Kanal
        </a>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-10">
         <h4 className="font-bold text-2xl text-slate-800 flex items-center gap-2">
            <Play className="w-6 h-6 text-red-500 fill-red-500" />
            Tayangan Pilihan
         </h4>
         <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Cari video..." 
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 mb-8">
        {realVideos.map((video, idx) => {
          if (idx >= visibleVideos) return null;
          return (
            <motion.a 
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={video.id} 
              className="group flex flex-col gap-4"
            >
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative shadow-md">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded font-medium backdrop-blur-md">
                  {video.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-600/50">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-slate-800 font-bold text-base line-clamp-2 leading-snug group-hover:text-red-600 transition-colors" title={video.title}>
                  {video.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1.5 font-medium flex items-center gap-1.5 line-clamp-1" title={video.channel}>
                  <span className="w-5 h-5 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center min-w-5 shrink-0 text-[10px] font-bold">
                    {video.channel.charAt(0).toUpperCase()}
                  </span>
                  {video.channel}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>

      {visibleVideos < totalMockVideos && (
        <div className="flex justify-center mt-6 relative z-10">
          <button 
            onClick={() => setVisibleVideos(prev => Math.min(prev + 3, totalMockVideos))}
            className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-red-600 hover:text-red-600 transition-all flex items-center gap-2"
          >
            Tampilkan Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const sections = [
    {
      id: "nasional",
      title: "Perpustakaan Nasional",
      subtitle: "Jantung Literasi Nusantara",
      description:
        "Perpustakaan Nasional adalah lembaga pemerintah yang berfungsi sebagai pusat pengelolaan koleksi pustaka suatu negara. Di Indonesia, lembaga ini dikenal sebagai Perpustakaan Nasional Republik Indonesia. Lembaga ini bertugas menghimpun, mengelola, melestarikan, dan menyediakan berbagai koleksi bahan pustaka sebagai warisan budaya bangsa serta sumber informasi bagi masyarakat.",
      image: "https://urbanvibes.id/wp-content/uploads/2025/01/perpustakaan-nasional.jpg",
      color: "from-blue-500 to-sky-400",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: "daerah",
      title: "Perpustakaan Daerah",
      subtitle: "Pelita Pengetahuan Khatulistiwa",
      description:
        "Perpustakaan Kalbar adalah perpustakaan tingkat provinsi yang berada di Kalimantan Barat dan berfungsi sebagai pusat layanan informasi serta pengembangan perpustakaan di daerah tersebut. Lembaga daerah yang bertugas mengelola, menyediakan, dan mengembangkan koleksi bahan pustaka untuk mendukung pendidikan, penelitian, serta meningkatkan literasi masyarakat di Kalimantan Barat.",
      image: "https://mu4.co.id/wp-content/uploads/2026/01/Perpustakaan-Pontianak.jpg",
      color: "from-emerald-500 to-teal-400",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      id: "universitas",
      title: "Perpustakaan Universitas",
      subtitle: "Kawah Candradimuka Akademisi",
      description:
        "Perpustakaan UNTAN adalah unit layanan akademik yang menyediakan, mengelola, dan memberikan akses terhadap berbagai sumber informasi ilmiah guna menunjang pendidikan, penelitian, dan pengabdian kepada masyarakat di Universitas Tanjungpura.",
      image: "https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Pontianak/o/1728379229371-WhatsApp_Image_2024-10-08_at_14.44.18/xmduxonnveb5u68.jpeg",
      color: "from-amber-500 to-orange-400",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-pink-200">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="w-1/3 hidden md:flex items-center gap-4">
             <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full shadow-md shadow-red-500/20">
               Nusantara
             </span>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Fallya</span>
            </span>
          </div>
          <div className="w-1/3 flex justify-end gap-8 text-sm font-bold tracking-wide text-slate-600">
            <a href="#nasional" className="hover:text-blue-500 transition-colors hidden sm:block">Pusat</a>
            <a href="#daerah" className="hover:text-emerald-500 transition-colors hidden sm:block">Provinsi</a>
            <a href="#universitas" className="hover:text-amber-500 transition-colors hidden sm:block">Kampus</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Colorful Gradients in background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-400/20 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] translate-y-1/3 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-pink-400/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full shadow-lg shadow-slate-200/50 border border-slate-100">
             <Compass className="w-5 h-5 text-pink-500" />
             <span className="text-sm font-bold tracking-wide text-slate-700">Wonders of Literacy</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Menjelajah <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">Mutiara</span>
            <br /> Ilmu Nusantara
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Ikuti perjalanan melintasi Perpustakaan Nasional, Daerah, hingga sudut-sudut Universitas. Temukan betapa membanggakannya pesona pustaka Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#nasional" 
              className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-slate-900/20"
            >
              Mulai Petualangan <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#map" 
              className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              Lihat Persebaran <MapPin className="w-5 h-5 text-emerald-500" />
            </a>
          </div>
        </motion.div>
      </header>

      {/* Statistics Section */}
      <section className="py-20 relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Counter end={164610} label="Total Perpustakaan" colorClass="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700" />
            <Counter end={4500} label="Koleksi Pustaka (Ribuan)" colorClass="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-700" />
            <Counter end={1240500} label="Total Pengunjung Web" colorClass="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-700" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-40">
        {sections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Text Area */}
            <div className="flex-1 space-y-8 w-full">
              <div className="inline-flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${section.bgColor}`}>
                  <BookOpen className={`w-6 h-6 ${section.iconColor}`} />
                </div>
                <span className={`font-bold text-sm tracking-wider uppercase ${section.iconColor}`}>
                  {section.subtitle}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                {section.title}
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {section.description}
              </p>
              <div className="pt-4">
                 <button className="px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2">
                   Jelajahi Lebih Lanjut <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${section.color} opacity-20 blur-2xl transform rotate-3`}></div>
              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-tl ${section.color} opacity-20 blur-2xl transform -rotate-3`}></div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 relative group overflow-hidden border border-white">
                <div className="aspect-[4/3] rounded-2xl relative overflow-hidden bg-slate-100">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </main>

      <section id="map" className="relative py-32 px-6 overflow-hidden">
         <div className="absolute inset-0 bg-slate-900 skew-y-3 origin-top-left -z-10"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
         
         <div className="max-w-7xl mx-auto space-y-32 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Peta Persebaran Literasi</h2>
              <p className="text-slate-300 max-w-2xl mx-auto text-lg">Visualisasi distribusi perpustakaan di seluruh penjuru kepulauan Indonesia.</p>
            </div>
            <LibraryMap />
            <div className="pt-20 border-t border-slate-800">
               <YoutubePreview />
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pb-12 pt-40 -mt-20 text-white relative z-0">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-pink-500 mb-8" />
          <h2 className="text-4xl font-bold mb-6">
            Lestarikan Literasi Bangsa
          </h2>
          <p className="text-slate-400 mb-12 max-w-lg mx-auto text-lg">
            Situs ini merayakan kehadiran budaya membaca di seluruh pesisir Indonesia. Pesona edukasi, Wonderful Indonesia.
          </p>
          <div className="flex justify-center gap-6 mb-12">
            <a href="#" className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors">f</a>
            <a href="#" className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors">ig</a>
            <a href="#" className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors">tw</a>
          </div>
          <div className="text-sm font-bold tracking-widest uppercase text-slate-500 border-t border-slate-800 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} Koleksi Fallya.</span>
            <span>Made with ❤️ in Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

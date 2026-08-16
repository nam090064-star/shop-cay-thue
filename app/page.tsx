"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

// DỮ LIỆU CÁC MỤC DỊCH VỤ / TÀI KHOẢN
const CATEGORIES = [
  {
    id: "cay-thue",
    title: "CÀY THUÊ BLOX-FRUITS",
    badge: "Sẵn Sàng",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    items: [
      { id: "ct-1", name: "Cày Level 1 -> 2550 (Max Level)", price: 50000 },
      { id: "ct-2", name: "Farm 10.000.000 Beli", price: 30000 },
      { id: "ct-3", name: "Săn Melee Godhuman", price: 120000 },
      { id: "ct-4", name: "Săn Cursed Dual Katana (CDK)", price: 100000 },
    ],
  },
  {
    id: "acc-tong-hop",
    title: "ACC BLOX-FRUITS TỔNG HỢP",
    badge: "Còn 23",
    badgeColor: "bg-sky-50 text-sky-600 border-sky-200",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=600&auto=format&fit=crop",
    items: [
      { id: "acc-1", name: "Acc Max Level + Tộc V4 Ngẫu Nhiên", price: 150000 },
      { id: "acc-2", name: "Acc Max Level + Full Gear V4 Tự Chọn", price: 250000 },
      { id: "acc-3", name: "Acc VIP CDK + Godhuman + Trái Vĩnh Viễn", price: 350000 },
    ],
  },
  {
    id: "combo-draco",
    title: "COMBO DRACO SIÊU VIP",
    badge: "Giảm 35%",
    badgeColor: "bg-rose-50 text-rose-600 border-rose-200",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
    items: [
      { id: "draco-1", name: "Combo Draco Tân Thủ: Level 1500 + Tam Kiếm + 5M Beli", price: 99000 },
      { id: "draco-2", name: "Combo Draco Bá Vương: Max Level + Tộc V4 + CDK", price: 180000 },
    ],
  },
  {
    id: "race-v4",
    title: "FULL RACE V4 THƯỜNG",
    badge: "Hot",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop",
    items: [
      { id: "v4-1", name: "Mở Khóa Tộc V4 (Chưa Gear)", price: 80000 },
      { id: "v4-2", name: "Up Full Gear Tộc V4 Thường", price: 150000 },
    ],
  },
];

// TOP NẠP THÁNG
const TOP_NAP = [
  { rank: 1, name: "huy****", amount: "1.710.000 đ", color: "text-amber-500 font-bold" },
  { rank: 2, name: "duy****", amount: "1.500.000 đ", color: "text-slate-400 font-bold" },
  { rank: 3, name: "Dun*****", amount: "1.170.000 đ", color: "text-amber-700 font-bold" },
  { rank: 4, name: "ngu**********", amount: "1.098.000 đ", color: "text-rose-500 font-bold" },
  { rank: 5, name: "Ima******", amount: "950.000 đ", color: "text-rose-500 font-bold" },
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Phát / Tạm dừng nhạc nền
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f6ff] text-slate-800 font-sans pb-16">
      {/* NHẠC NỀN */}
      <audio ref={audioRef} src="/nhacchill.mp3" loop preload="auto" />

      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 text-white p-2 rounded-xl font-black text-xl tracking-wider">
              SHOPSONB.COM
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Nút bật/tắt Nhạc Chill */}
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
                isPlaying
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <span>{isPlaying ? "🎵 Đang phát nhạc" : "🔇 Bật nhạc chill"}</span>
            </button>

            {/* Tài khoản */}
            <div className="bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-sky-700">
              <span className="w-6 h-6 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold">
                👤
              </span>
              <span>{session ? session.user.email : "Khách - 0 đ"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* BANNER HÀNG ĐẦU & TOP NẠP */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BANNER TRÁI */}
          <div className="lg:col-span-2 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl overflow-hidden shadow-md relative min-h-[260px] flex items-center justify-center p-6 text-center text-white border-4 border-white">
            <div>
              <h2 className="text-3xl font-black text-amber-400 drop-shadow-md mb-2 uppercase">
                SHOPEVIL & SHOPSONB.COM
              </h2>
              <p className="text-sm text-sky-200 max-w-md mx-auto">
                Shop Game Duyệt Đơn Siêu Tốc - Siêu Uy Tín #1 Blox Fruits
              </p>
            </div>
          </div>

          {/* TOP NẠP PHẢI */}
          <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="bg-sky-500 text-white font-black text-center py-3 text-sm tracking-wide uppercase flex items-center justify-center gap-2">
                🏆 TOP NẠP THÁNG 08/2026
              </div>
              <div className="p-4 space-y-3">
                {TOP_NAP.map((item) => (
                  <div key={item.rank} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-black flex items-center justify-center text-[10px]">
                        {item.rank}
                      </span>
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className={item.color}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 pt-0">
              <button className="w-full py-2 bg-sky-400 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition-all uppercase">
                👉 NẠP TIỀN NGAY 👈
              </button>
            </div>
          </div>
        </div>

        {/* THÔNG BÁO RUNNING */}
        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm mt-6 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-1">
            100% Tài khoản ROBLOX đều là account Global (quốc tế) ngoại trừ mục [ Acc BF Vip ]
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-sky-600">
            <span>ACC BLOXFRUIT VIP</span> • <span>ACC BLOXFRUIT TỔNG HỢP</span> • <span>CÀY THUÊ</span> • <span>PERM VĨNH VIỄN</span>
          </div>
        </div>

        {/* MỤC SẢN PHẨM / TÀI KHOẢN (GIAO DIỆN CHUẨN ANH CHỤP) */}
        <div className="mt-8">
          <div className="flex items-center justify-center mb-6">
            <span className="bg-white text-sky-600 border border-sky-200 font-black text-sm px-6 py-2 rounded-full shadow-sm">
              💻 CỬA HÀNG DỊCH VỤ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-sky-100 transition-all flex flex-col justify-between p-3"
              >
                <div>
                  {/* HÌNH ẢNH CÓ NÚT XEM */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 mb-3">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-sky-400/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur">
                        XEM
                      </span>
                    </div>
                  </div>

                  {/* TIÊU ĐỀ & BADGE */}
                  <div className="text-center px-2">
                    <h3 className="font-black text-slate-800 text-sm leading-snug mb-2 min-h-[40px] flex items-center justify-center">
                      {cat.title}
                    </h3>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${cat.badgeColor} mb-4`}>
                      {cat.badge}
                    </span>
                  </div>
                </div>

                {/* NÚT XEM TẤT CẢ (XANH CYAN CHUẨN HÌNH) */}
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedItemId(cat.items[0].id);
                  }}
                  className="w-full py-2.5 bg-[#40c4ff] hover:bg-[#00b0ff] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 uppercase"
                >
                  XEM TẤT CẢ <span className="text-xs">➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL MUA HÀNG KHI BẤM XEM TẤT CẢ */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>

              <h3 className="text-lg font-black text-slate-800 mb-4 uppercase">
                {selectedCategory.title}
              </h3>

              <div className="space-y-2 mb-6 max-h-[280px] overflow-y-auto pr-1">
                {selectedCategory.items.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      selectedItemId === item.id
                        ? "bg-sky-50 border-sky-400 text-sky-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="text-sky-600 font-black">
                      {item.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const item = selectedCategory.items.find((i: any) => i.id === selectedItemId);
                  alert(`Đã chọn mua: ${item?.name}`);
                  setSelectedCategory(null);
                }}
                className="w-full py-3 bg-[#40c4ff] hover:bg-[#00b0ff] text-white font-black rounded-xl shadow-md transition-all uppercase"
              >
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
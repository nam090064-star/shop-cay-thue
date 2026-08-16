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
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQO45TU5JEnlwnzDggYwOifSvWmta1W1xqG03t-4j5Zw&s=10",
    items: [
      { id: "ct-1", name: "Cày Level 1 -> 2550 (Max Level)", price: 50000 },
      { id: "ct-2", name: "Farm 10.000.000 Beli", price: 30000 },
      { id: "ct-3", name: "Săn Melee Godhuman", price: 120000 },
      { id: "ct-4", name: "Săn Cursed Dual Katana (CDK)", price: 100000 },
    ],
  },
  {
    id: "acc-tong-hop",
    title: "ACC BLOX FRUITS Random V4",
    badge: "Sẵn Sàng",
    badgeColor: "bg-sky-50 text-sky-600 border-sky-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSaXYiIaGiib_06_9V1aIqoHuGh-PokxmCDrCKJPWaDg&s=10",
    items: [
      { id: "acc-1", name: "Acc Max Level + Tộc V4 Ngẫu Nhiên", price: 150000 },
      { id: "acc-2", name: "Acc Max Level + Full Gear V4 Tự Chọn", price: 250000 },
      { id: "acc-3", name: "Acc VIP CDK + Godhuman + Trái Vĩnh Viễn", price: 350000 },
    ],
  },
  {
    id: "combo-draco",
    title: "COMBO DRACO SIÊU VIP",
    badge: "Giá Ưu Đãi",
    badgeColor: "bg-rose-50 text-rose-600 border-rose-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkOt5op8NbTeM89SSNJiJAhfNTE9Wle5rCXddf0NfuPw&s=10",
    items: [
      { id: "draco-1", name: "Combo Draco Tân Thủ: Level 1500 + Tam Kiếm + 5M Beli", price: 99000 },
      { id: "draco-2", name: "Combo Draco Bá Vương: Max Level + Tộc V4 + CDK", price: 180000 },
    ],
  },
  {
    id: "race-v4",
    title: "FULL RACE V4 THƯỜNG",
    badge: "Ưu Đãi",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQikKJNnW4h7fhv6dpYBqsM_nu5K-zBJMJrJ8qLNYXVg&s=10",
    items: [
      { id: "v4-1", name: "Mở Khóa Tộc V4 (Chưa Gear)", price: 80000 },
      { id: "v4-2", name: "Up Full Gear Tộc V4 Thường", price: 150000 },
    ],
  },
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  // State cho Form Cày Thuê
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState("");
  const [note, setNote] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleOrder = () => {
    const item = selectedCategory.items.find((i: any) => i.id === selectedItemId);
    if (!item) {
      alert("Vui lòng chọn gói dịch vụ!");
      return;
    }

    if (selectedCategory.id === "cay-thue") {
      if (!username || !password) {
        alert("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu Roblox!");
        return;
      }
      alert(`Đã đặt đơn cày thuê thành công!\nGói: ${item.name}\nTài khoản: ${username}`);
    } else {
      alert(`Đã chọn mua thành công: ${item.name}`);
    }
    
    setSelectedCategory(null);
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
              RobloxGiaRe.Com
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        <div className="w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl overflow-hidden shadow-md relative min-h-[220px] flex items-center justify-center p-6 text-center text-white border-4 border-white">
          <div>
            <h2 className="text-3xl font-black text-amber-400 drop-shadow-md mb-2 uppercase">
              Shop Game Duyệt Đơn Siêu Tốc - Siêu Uy Tín #1 Blox Fruits
            </h2>
            <p className="text-sm text-sky-200 max-w-md mx-auto">
              Shop Game Duyệt Đơn Siêu Tốc - Siêu Uy Tín #1 Blox Fruits
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm mt-6 text-xs text-slate-600 leading-relaxed">
          <p className="font-bold text-slate-800 mb-1">
            100% Tài khoản ROBLOX đều là account Global (Quốc Tế)
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-sky-600">
            <span>ACC BLOXFRUIT VIP</span> • <span>ACC BLOXFRUIT V4 Random</span> • <span>CÀY THUÊ</span> • 
          </div>
        </div>

        {/* MỤC SẢN PHẨM / TÀI KHOẢN */}
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

                  <div className="text-center px-2">
                    <h3 className="font-black text-slate-800 text-sm leading-snug mb-2 min-h-[40px] flex items-center justify-center">
                      {cat.title}
                    </h3>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${cat.badgeColor} mb-4`}>
                      {cat.badge}
                    </span>
                  </div>
                </div>

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

        {/* MODAL GIAO DIỆN ĐẶT HÀNG / CÀY THUÊ */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto my-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 z-10"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-center text-sky-600 mb-6 uppercase tracking-wide">
                Dịch Vụ - {selectedCategory.title}
              </h3>

              {/* CHỈ HIỆN FORM NÀY KHI CHỌN MỤC CÀY THUÊ */}
              {selectedCategory.id === "cay-thue" ? (
                <div className="space-y-6">
                  {/* BƯỚC 1: CHỌN GÓI DỊCH VỤ */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">Chọn Gói Dịch Vụ</h4>
                    </div>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      {selectedCategory.items.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - {item.price.toLocaleString()} VNĐ
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BƯỚC 2: THÔNG TIN TÀI KHOẢN */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">Thông Tin Tài Khoản</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tài Khoản</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">👤</span>
                          <input
                            type="text"
                            placeholder="Nhập tài khoản cần cày"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mật Khẩu</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔒</span>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu của tài khoản đó"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 text-xs"
                          >
                            {showPassword ? "👁️" : "🙈"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Cookie / 2FA</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔑</span>
                        <input
                          type="text"
                          placeholder="Có thể nhập chuỗi 2FA, link game pass hoặc cookie liên quan"
                          value={twoFactor}
                          onChange={(e) => setTwoFactor(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        ℹ️ Dữ liệu này không bắt buộc, có thể bỏ trống
                      </p>
                    </div>
                  </div>

                  {/* BƯỚC 3: GHI CHÚ & XÁC NHẬN */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">Ghi Chú & Xác Nhận</h4>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={500}
                        placeholder="Nhập ghi chú cho admin nếu có..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                      />
                      <span className="absolute right-3 bottom-2 text-[10px] text-slate-400">
                        {note.length} / 500
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* GIAO DIỆN CHỌN MUA ĐỐI VỚI CÁC MỤC KHÁC */
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
              )}

              {/* NÚT TẠO ĐƠN HÀNG */}
              <button
                onClick={handleOrder}
                className="w-full mt-6 py-3.5 bg-[#40c4ff] hover:bg-[#00b0ff] text-white font-black text-sm rounded-xl shadow-md transition-all uppercase tracking-wide"
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
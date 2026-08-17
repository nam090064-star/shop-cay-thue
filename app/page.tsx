"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DANH MỤC DỊCH VỤ
const CATEGORIES = [
  {
    id: "race-v4",
    title: "Gói Cày Thuê Full Tộc V4",
    badge: "Ưu Đãi",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQikKJNnW4h7fhv6dpYBqsM_nu5K-zBJMJrJ8qLNYXVg&s=10",
    items: [
      { id: "v4-1", name: "Up ALL Race Lên V4 Full Gear (Trừ Rồng) Bao Điểm F + Gạt Cần", price: 180000 },
    ],
  },
];

export default function Home() {
  // State quản lý tài khoản & số dư
  const [session, setSession] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // State quản lý Modal chọn gói
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State quản lý Modal Lịch sử
  const [historyTab, setHistoryTab] = useState<"orders" | "deposits" | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [depositsHistory, setDepositsHistory] = useState<any[]>([]);

  // Lấy dữ liệu phiên làm việc và số dư từ Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchBalance(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchBalance(session.user.id);
      else setBalance(0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchBalance = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setBalance(data.balance || 0);
    }
  };

  // Hàm xử lý Đăng xuất triệt để
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = "/";
      }
    }
  };

  // Hàm kiểm tra danh mục dịch vụ có cần nhập acc không
  const isServiceCategory = (catId: string) => {
    return catId !== "robux" && catId !== "giftcard";
  };

  // Mở Modal Lịch sử
  const openHistory = (tab: "orders" | "deposits") => {
    setHistoryTab(tab);
  };

  // Bật / Tắt Nhạc
  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  // HÀM XỬ LÝ ĐẶT HÀNG BẢO MẬT (GỌI API SERVER)
  const handleOrder = async () => {
    if (isSubmitting) return;

    if (!session?.user) {
      alert("Vui lòng đăng nhập tài khoản trước khi đặt hàng!");
      return;
    }

    const item = selectedCategory.items.find((i: any) => i.id === selectedItemId);
    if (!item) {
      alert("Vui lòng chọn gói dịch vụ!");
      return;
    }

    if (balance < item.price) {
      alert(`Số dư không đủ (${balance.toLocaleString()} VNĐ). Vui lòng nạp thêm tiền để đặt gói ${item.price.toLocaleString()} VNĐ!`);
      return;
    }

    const requireAccount = isServiceCategory(selectedCategory.id);
    if (requireAccount && (!username || !password)) {
      alert("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu Roblox!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Trừ tiền tài khoản trong Supabase
      const newBalance = balance - item.price;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", session.user.id);

      if (updateError) {
        alert("Không thể trừ tiền trong tài khoản. Vui lòng thử lại!");
        setIsSubmitting(false);
        return;
      }

      setBalance(newBalance);

      // 2. Gửi thông tin về Server API Route để ẩn Token Telegram
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryTitle: selectedCategory.title,
          itemName: item.name,
          price: item.price,
          email: session.user.email,
          balance: newBalance,
          username,
          password,
          twoFactor,
          note,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        alert("Đặt hàng thành công! Đơn hàng đã được ghi nhận.");
        setSelectedCategory(null);
        setUsername("");
        setPassword("");
        setTwoFactor("");
        setNote("");
      } else {
        alert("Đặt hàng thành công và đã trừ tiền, nhưng có lỗi khi gửi thông báo.");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng liên hệ Admin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-wider">
              RobloxGiaRe.Com
            </div>
          </div>

          {/* MENU BẤM VÀ TÀI KHOẢN */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => openHistory("orders")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
            >
              📋 Lịch Sử Đặt Hàng
            </button>

            <button
              type="button"
              onClick={() => openHistory("deposits")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200 cursor-pointer"
            >
              💳 Lịch Sử Nạp Tiền
            </button>

            <button
              type="button"
              onClick={toggleMusic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border cursor-pointer ${
                isPlaying
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <span>{isPlaying ? "🎵 Đang phát" : "🔇 Bật nhạc"}</span>
            </button>

            {/* HIỂN THỊ TÀI KHOẢN */}
            <div className="bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-sky-700">
              <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                👤
              </span>
              <span>
                {session?.user?.email || "Khách"} -{" "}
                <span className="text-emerald-600 font-extrabold">{balance.toLocaleString()} đ</span>
              </span>
            </div>

            {/* NÚT ĐĂNG XUẤT (LUÔN HIỆN CỐ ĐỊNH) */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-slate-800 mb-6 text-center uppercase tracking-wide">
          Danh Mục Dịch Vụ Cày Thuê
        </h1>

        {/* DANH SÁCH THẺ DỊCH VỤ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              <img src={cat.image} alt={cat.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-lg mb-2">{cat.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (cat.items.length > 0) setSelectedItemId(cat.items[0].id);
                  }}
                  className="w-full mt-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Xem Gói & Đặt Hàng
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL ĐẶT HÀNG */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {/* NÚT ĐÓNG MODAL */}
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
              >
                ✕
              </button>

              <h2 className="text-xl font-black text-slate-800 mb-4">{selectedCategory.title}</h2>

              {/* CHỌN GÓI */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-bold text-slate-700">Chọn Gói Dịch Vụ:</label>
                {selectedCategory.items.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                      selectedItemId === item.id
                        ? "border-sky-500 bg-sky-50/50"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                    <span className="font-extrabold text-emerald-600 text-sm">
                      {item.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                ))}
              </div>

              {/* FORM NHẬP ACC ROBLOX */}
              {isServiceCategory(selectedCategory.id) && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tài Khoản Roblox</label>
                    <input
                      type="text"
                      placeholder="Nhập tài khoản cần cày"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mật Khẩu</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mã 2FA / Cookie (Nếu có)</label>
                    <input
                      type="text"
                      placeholder="Nhập mã 2FA hoặc Cookie bảo mật"
                      value={twoFactor}
                      onChange={(e) => setTwoFactor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ghi Chú Cho Shop</label>
                    <textarea
                      placeholder="Nhập ghi chú thêm nếu có..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 h-20 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* NÚT XÁC NHẬN ĐẶT HÀNG (NẰM CHUẨN TRONG MODAL) */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleOrder}
                className={`w-full mt-6 py-3.5 text-white font-black text-sm rounded-xl shadow-md transition-all uppercase tracking-wide cursor-pointer ${
                  isSubmitting
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#40c4ff] hover:bg-[#00b0ff] active:scale-98"
                }`}
              >
                {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
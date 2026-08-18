"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User, Session } from "@supabase/supabase-js";
import NoticeModal from "./components/NoticeModal";

const CATEGORIES = [
  {
    id: "cay-thue",
    title: "CÀY THUÊ BLOX-FRUITS",
    badge: "Sẵn Sàng",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQO45TU5JEnlwnzDggYwOifSvWmta1W1xqG03t-4j5Zw&s=10",
    items: [
      { id: "ct-1", name: "Kéo Tim Levi Về Hydra", price: 35000 },
      { id: "ct-2", name: "Kéo Tim Levi Về Tiki", price: 30000 },
      { id: "ct-3", name: "Lấy Tộc Rồng (Bonus V3)", price: 30000 },
      { id: "ct-4", name: "Cày Trứng Rồng 1 Quả", price: 10000 },
      { id: "ct-5", name: "Lấy Kiếm Rồng", price: 35000 },
      { id: "ct-6", name: "Lấy Súng Rồng", price: 40000 },
      { id: "ct-7", name: "Up Full Gear V4 Tộc Đang Dùng", price: 35000 },
      { id: "ct-8", name: "Lấy Full Đai Rồng", price: 25000 },
      { id: "ct-9", name: "Gạt Cần (Điều kiện: Có mảnh và mũ)", price: 20000 },
      { id: "ct-10", name: "10M Beli", price: 10000 },
      { id: "ct-11", name: "10K Điểm F", price: 5000 },
      { id: "ct-12", name: "Lấy Fox Lamp", price: 35000 },
      { id: "ct-13", name: "Lấy Mỏ Neo", price: 30000 },
      { id: "ct-14", name: "Lấy Mảnh Gương", price: 20000 },
      { id: "ct-15", name: "Lấy Mũ Rip Indra", price: 20000 },
      { id: "ct-16", name: "Lấy Guitar Linh Hồn", price: 30000 },
      { id: "ct-17", name: "Lấy Song Kiếm CDK", price: 45000 },
      { id: "ct-18", name: "Lấy Tushita", price: 20000 },
      { id: "ct-19", name: "Lấy Yama", price: 20000 },
      { id: "ct-20", name: "Lấy Tam Kiếm ZORO Từ A - Z", price: 45000 },
      { id: "ct-21", name: "Mua 1 Cây Kiếm ZORO", price: 10000 },
      { id: "ct-22", name: "Lấy Tộc Cyborg (Bonus V3)", price: 35000 },
      { id: "ct-23", name: "Lấy Tộc Quỷ (Bonus V3)", price: 35000 },
      { id: "ct-24", name: "Lấy Haki Quan Sát V2", price: 45000 },
      { id: "ct-25", name: "Level 1 - MAX", price: 45000 },
      { id: "ct-26", name: "Level 1500 - MAX", price: 30000 },
      { id: "ct-27", name: "Level 700 - 1500", price: 20000 },
      { id: "ct-28", name: "Level 1 - 700", price: 10000 },
    ],
  },
  {
    id: "acc-tong-hop",
    title: "ACC BLOX FRUITS Random V4",
    badge: "Sẵn Sàng",
    badgeColor: "bg-sky-50 text-sky-600 border-sky-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM70JKMiGwF3sogwyhZ70TNqtWl1wdloQlq0t81bzMfQ&s",
    items: [
      { id: "acc-1", name: "Acc Max Lv + CDK + 1 Race V4 Ngẫu Nhiên", price: 45000 },
      { id: "acc-2", name: "Acc Max Lv + 1 Race V4 Ngẫu Nhiên", price: 30000 },
      { id: "acc-3", name: "Acc Max Lv + CDK + Guitar Linh Hồn + Full Race V4 (Trừ Rồng)", price: 130000 },
    ],
  },
  {
    id: "combo-draco",
    title: "Gói Cày DRACO Giá Rẻ",
    badge: "Giá Ưu Đãi",
    badgeColor: "bg-rose-50 text-rose-600 border-rose-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkOt5op8NbTeM89SSNJiJAhfNTE9Wle5rCXddf0NfuPw&s=10",
    items: [
      { id: "draco-1", name: "Lấy Súng Rồng + Kiếm Rồng + Tộc Rồng Up Full Gear", price: 180000 },
    ],
  },
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
  // Khởi tạo Supabase Client với @supabase/ssr
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State Quản Lý Lịch Sử Modal
  const [historyTab, setHistoryTab] = useState<"orders" | "deposits" | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<any[]>([]);
  const [depositsHistory, setDepositsHistory] = useState<any[]>([]);

  // State Form Cày Thuê
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState("");
  const [note, setNote] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // LẤY SỐ DƯ TÀI KHOẢN TỪ SUPABASE
  const fetchUserBalance = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (data && !error) {
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy số dư:", err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserBalance(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchUserBalance(session.user.id);
      else setBalance(0);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleLogout = async () => {
    try {
      // 1. Gọi đăng xuất từ Supabase
      await supabase.auth.signOut();

      // 2. Xóa sạch LocalStorage & SessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Xóa Cookie của Supabase (nếu có)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      alert("Đăng xuất thành công!");

      // 4. Chuyển hướng về trang chủ
      window.location.href = "/";
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      alert("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  const isServiceCategory = (catId: string) => {
    return ["cay-thue", "combo-draco", "race-v4"].includes(catId);
  };

  const openHistory = (tab: "orders" | "deposits") => {
    setHistoryTab(tab);
    if (tab === "orders") {
      setOrdersHistory([
        { id: "ORD-01", service: "Level 1500 - MAX", price: 30000, status: "Đang xử lý", date: "17/08/2026" },
      ]);
    } else {
      setDepositsHistory([
        { id: "DEP-01", amount: 50000, method: "Chuyển khoản / Thẻ nạp", status: "Thành công", date: "16/08/2026" },
      ]);
    }
  };

  // HÀM ĐẶT HÀNG QUA API ROUTE BẢO MẬT
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
      alert(`Số dư của bạn không đủ (${balance.toLocaleString()} VNĐ). Vui lòng nạp thêm tiền để thanh toán gói ${item.price.toLocaleString()} VNĐ!`);
      return;
    }

    const requireAccount = isServiceCategory(selectedCategory.id);
    if (requireAccount && (!username || !password)) {
      alert("Vui lòng nhập đầy đủ Tài khoản và Mật khẩu Roblox!");
      return;
    }

    setIsSubmitting(true);

    try {
      const newBalance = balance - item.price;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("id", session.user.id);

      if (updateError) {
        alert("Không thể thực hiện giao dịch. Vui lòng thử lại!");
        setIsSubmitting(false);
        return;
      }

      setBalance(newBalance);

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryTitle: selectedCategory.title,
          itemName: item.name,
          price: item.price,
          email: session?.user?.email,
          balance: newBalance,
          username,
          password,
          twoFactor,
          note,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        alert("Đặt hàng thành công! Đơn hàng đã được ghi nhận và đang tiến hành xử lý.");
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
      alert("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng liên hệ Admin!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f6ff] text-slate-800 font-sans pb-16">
      <NoticeModal />
      <audio ref={audioRef} src="/nhacchill.mp3" loop preload="auto" />

      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-50 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* LOGO SHOP */}
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-wider">
              RobloxGiaRe.Com
            </div>
          </div>

          {/* CÁC NÚT BẤM & TÀI KHOẢN */}
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

            {/* THÔNG TIN TÀI KHOẢN */}
            <div className="bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-sky-700">
              <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-[10px]">
                👤
              </span>
              <span>
                {session?.user?.email || "Khách"} -{" "}
                <span className="text-emerald-600 font-extrabold">{balance.toLocaleString()} đ</span>
              </span>
            </div>

            {/* NÚT ĐĂNG XUẤT */}
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

        {/* CỬA HÀNG DỊCH VỤ */}
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
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedItemId(cat.items[0].id);
                  }}
                  className="w-full py-2.5 bg-[#40c4ff] hover:bg-[#00b0ff] text-white font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 uppercase cursor-pointer"
                >
                  XEM TẤT CẢ <span className="text-xs">➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL LỊCH SỬ */}
        {historyTab && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-sky-100 relative">
              <button
                type="button"
                onClick={() => setHistoryTab(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-lg font-black text-sky-600 mb-4 uppercase">
                {historyTab === "orders" ? "📋 Lịch Sử Đặt Hàng" : "💳 Lịch Sử Nạp Tiền"}
              </h3>

              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {historyTab === "orders" ? (
                  ordersHistory.length > 0 ? (
                    ordersHistory.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{item.service}</p>
                          <p className="text-slate-400 text-[11px]">{item.date} • {item.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sky-600">{item.price.toLocaleString()} VNĐ</p>
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">Chưa có lịch sử đặt hàng nào.</p>
                  )
                ) : depositsHistory.length > 0 ? (
                  depositsHistory.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-800">{item.method}</p>
                        <p className="text-slate-400 text-[11px]">{item.date} • {item.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">+{item.amount.toLocaleString()} VNĐ</p>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Chưa có lịch sử nạp tiền nào.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL ĐẶT HÀNG */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto my-auto">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center hover:bg-slate-200 z-10 cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-xl font-black text-center text-sky-600 mb-6 uppercase tracking-wide">
                Dịch Vụ - {selectedCategory.title}
              </h3>

              <div className="space-y-6">
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

                {isServiceCategory(selectedCategory.id) && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">Thông Tin Tài Khoản</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tài Khoản</label>
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
                            className="absolute right-3 top-2.5 text-slate-400 text-xs cursor-pointer"
                          >
                            {showPassword ? "👁️" : "🙈"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <input
                          type="text"
                          placeholder="Nhập ghi chú thêm nếu có..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// KHO GÓI CÀY THUÊ
const CAY_THUE_SERVICES = [
  { id: "1", name: "Cày Level 1 - 2550 (Max Level)", price: 50000 },
  { id: "2", name: "Lấy Tộc V4 (Full Gear)", price: 150000 },
  { id: "3", name: "Săn Cursed Dual Katana (CDK)", price: 100000 },
  { id: "4", name: "Săn Melee Godhuman", price: 120000 },
  { id: "5", name: "Farm 10.000.000 Beli", price: 30000 },
];

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | "nap_tien" | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "caythue" | "shopacc">("all");
  const [isPlaying, setIsPlaying] = useState(false); 
  // State Form Cày Thuê
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [robloxUsername, setRobloxUsername] = useState("");
  const [robloxPassword, setRobloxPassword] = useState("");
  const [twoFactorOrCookie, setTwoFactorOrCookie] = useState("");
  const [note, setNote] = useState("");

  // State Auth & User
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("balance").eq("id", userId).single();
    if (data) setBalance(data.balance || 0);
  };

  const getFakeEmail = (uname: string) => `${uname.trim().toLowerCase()}@shop.com`;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: getFakeEmail(username),
        password: password,
        options: { data: { username: username } }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase.from("profiles").upsert([
          { id: data.user.id, username: username, balance: 0, role: "user" }
        ]);
        alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        setModalType("login");
      }
    } catch (err: any) {
      setError(err.message || "Tên tài khoản này đã được sử dụng!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: getFakeEmail(username),
        password: password,
      });

      if (signInError) throw signInError;

      alert("🎉 Đăng nhập thành công!");
      setModalType(null);
    } catch (err: any) {
      setError("Tên tài khoản hoặc mật khẩu không chính xác!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBalance(0);
    alert("Đã đăng xuất thành công!");
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để tạo đơn hàng!");
      setModalType("login");
      return;
    }
    if (!selectedServiceId) {
      alert("Vui lòng chọn 1 gói dịch vụ!");
      return;
    }

    const currentService = CAY_THUE_SERVICES.find((s) => s.id === selectedServiceId);
    alert(`🎉 Tạo đơn thành công!\n- Dịch vụ: ${currentService?.name}\n- Giá: ${currentService?.price.toLocaleString("vi-VN")}đ\nShop sẽ xử lý trong 24h!`);

    setRobloxUsername("");
    setRobloxPassword("");
    setTwoFactorOrCookie("");
    setNote("");
    setSelectedServiceId("");
  };

  const selectedService = CAY_THUE_SERVICES.find((s) => s.id === selectedServiceId);
  const toggleMusic = () => {
  const audio = document.getElementById("bg-audio") as HTMLAudioElement;
  if (audio) {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }
};
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* THẺ PHÁT NHẠC NỀN */}
      <audio id="bg-audio" loop src="/nhacchill.mp3" />

      {/* NÚT BẬT/TẮT NHẠC NỔI GÓC DƯỚI BÊN TRÁI */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-5 left-5 z-50 bg-white/90 backdrop-blur-sm border-2 border-sky-300 p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center gap-2 text-xs font-bold text-sky-600"
        title="Bật/Tắt Nhạc Nền"
      >
        {isPlaying ? "🎵 🔊 Đang phát nhạc" : "🎵 🔇 Bật nhạc nền"}
      </button>

      {/* HEADER */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("all")}>
            <div className="bg-gradient-to-r from-sky-400 to-blue-600 text-white font-black text-xl px-3 py-1 rounded-xl shadow-md tracking-wider">
              RobloxGiaRe.Com
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
            {user ? (
              <>
                <div className="bg-sky-50 border border-sky-200 px-3 py-1 rounded-xl text-sky-700 font-medium">
                  Ví: <b className="text-sky-600 font-extrabold">{balance.toLocaleString("vi-VN")}đ</b>
                </div>
                <button
                  onClick={() => setModalType("nap_tien")}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-xl font-bold transition shadow-sm"
                >
                  Nạp Tiền
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl font-semibold transition shadow-sm"
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setModalType("login"); setError(""); }}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-xl font-bold transition shadow-sm"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => { setModalType("register"); setError(""); }}
                  className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-4 py-1.5 rounded-xl font-bold transition"
                >
                  Đăng Ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BODY MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {activeTab !== "all" && (
          <button
            onClick={() => setActiveTab("all")}
            className="mb-4 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm"
          >
            &larr; Quay lại danh mục chính
          </button>
        )}

        {/* TRANG CHỦ DANH MỤC */}
        {activeTab === "all" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-sky-600 mb-2 uppercase tracking-wide">
                DANH MỤC DỊCH VỤ BLOX FRUITS
              </h2>
              <p className="text-slate-500 text-xs md:text-sm">Chọn dịch vụ bạn cần bên dưới</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD CÀY THUÊ */}
              <div 
                onClick={() => setActiveTab("caythue")}
                className="bg-sky-50/60 border-2 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.01] transition duration-300"
              >
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-sky-200 shadow-inner">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQO45TU5JEnlwnzDggYwOifSvWmta1W1xqG03t-4j5Zw&s=10" 
                    alt="Cày Thuê Blox Fruits" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-extrabold text-xl text-sky-600 mb-2 uppercase tracking-wide">
                  CÀY THUÊ BLOX-FRUITS
                </h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1 rounded-full mb-4 border border-emerald-300">
                  Cày Thuê Giá Rẻ
                </span>
                <button className="w-full py-3 bg-sky-400 hover:bg-sky-500 text-white font-black rounded-2xl text-base shadow-md transition">
                  XEM TẤT CẢ &rarr;
                </button>
              </div>

              {/* CARD SHOP ACC */}
              <div 
                onClick={() => setActiveTab("shopacc")}
                className="bg-sky-50/60 border-2 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:scale-[1.01] transition duration-300"
              >
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-sky-200 shadow-inner">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0Ly8DLwNKc5s7LR5ibSeVeXEX6qX0IC_3fZC1S7Pmg&s=10" 
                    alt="Acc Blox Fruits Tổng Hợp" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-extrabold text-xl text-sky-600 mb-2 uppercase tracking-wide">
                  ACC BLOX-FRUITS TỔNG HỢP
                </h3>
                <span className="bg-sky-100 text-rose-600 text-xs font-bold px-4 py-1 rounded-full mb-4 border border-sky-300">
                  Sẵn Sàng
                </span>
                <button className="w-full py-3 bg-sky-400 hover:bg-sky-500 text-white font-black rounded-2xl text-base shadow-md transition">
                  XEM TẤT CẢ &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

        {/* KHU VỰC FORM CÀY THUÊ */}
        {activeTab === "caythue" && (
          <div className="space-y-6">
            
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-sky-600 tracking-wide uppercase">
                Dịch Vụ - CÀY THUÊ BLOX-FRUITS
              </h1>
              <div className="w-16 h-1 bg-sky-400 mx-auto mt-2 rounded-full"></div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-6">
              
              {/* BƯỚC 1 */}
              <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-sky-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                    1
                  </span>
                  <h3 className="font-extrabold text-base text-slate-800">Chọn Gói Dịch Vụ</h3>
                </div>

                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-sky-500 text-slate-700 font-medium"
                >
                  <option value="">Tìm và chọn gói dịch vụ...</option>
                  {CAY_THUE_SERVICES.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {service.price.toLocaleString("vi-VN")} VNĐ
                    </option>
                  ))}
                </select>
              </div>

              {/* BƯỚC 2 */}
              <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-sky-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                    2
                  </span>
                  <h3 className="font-extrabold text-base text-slate-800">Thông Tin Tài Khoản</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Tài Khoản (*)</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Nhập tài khoản cần cày"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Mật Khẩu (*)</label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="Nhập mật khẩu của tài khoản đó"
                      value={robloxPassword}
                      onChange={(e) => setRobloxPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Cookie / 2FA</label>
                  <input
                    type="text"
                    placeholder="Có thể nhập chuỗi 2FA, link game pass hoặc cookie liên quan"
                    value={twoFactorOrCookie}
                    onChange={(e) => setTwoFactorOrCookie(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">ⓘ Dữ liệu này không bắt buộc, có thể bỏ trống</p>
                </div>
              </div>

              {/* BƯỚC 3 */}
              <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-sky-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                    3
                  </span>
                  <h3 className="font-extrabold text-base text-slate-800">Ghi Chú & Xác Nhận</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Ghi Chú</label>
                  <textarea
                    rows={3}
                    maxLength={500}
                    placeholder="Nhập ghi chú cho admin nếu có..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                  />
                  <div className="text-right text-[11px] text-slate-400 mt-1">
                    {note.length} / 500
                  </div>
                </div>

                <div className="pt-2 text-center">
                  {selectedService ? (
                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-2xl text-base shadow-md transition flex items-center justify-center gap-2 mx-auto"
                    >
                      🛒 Tạo Đơn Hàng ({selectedService.price.toLocaleString("vi-VN")} VNĐ)
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full md:w-auto px-8 py-3.5 bg-slate-200 text-slate-400 font-extrabold rounded-2xl text-base cursor-not-allowed mx-auto"
                    >
                      Vui lòng chọn gói dịch vụ
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        )}

        {/* ACC STORE */}
        {activeTab === "shopacc" && (
          <div className="bg-white border-2 border-dashed border-sky-200 p-8 rounded-3xl text-center text-slate-400">
            Kho Acc đang chuẩn bị cập nhật...
          </div>
        )}

      </main>

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {modalType === "login" && (
              <div>
                <h2 className="text-xl font-extrabold mb-4 text-center text-sky-600 uppercase">ĐĂNG NHẬP TÀI KHOẢN</h2>
                {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs mb-4">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tên tài khoản</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tên tài khoản"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition shadow-md"
                  >
                    {loading ? "Đang xử lý..." : "Đăng Nhập"}
                  </button>
                </form>
              </div>
            )}

            {modalType === "register" && (
              <div>
                <h2 className="text-xl font-extrabold mb-4 text-center text-sky-600 uppercase">ĐĂNG KÝ TÀI KHOẢN</h2>
                {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 p-2.5 rounded-xl text-xs mb-4">{error}</div>}
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tên tài khoản</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tên tài khoản"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition shadow-md mt-2"
                  >
                    {loading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                  </button>
                </form>
              </div>
            )}

            {modalType === "nap_tien" && (
              <div>
                <h2 className="text-lg font-extrabold mb-3 text-center text-sky-600 uppercase">NẠP TIỀN TỰ ĐỘNG</h2>
                <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-xs space-y-2 mb-4">
                  <p className="font-bold text-slate-700">📌 Ngân hàng: <b className="text-sky-600">MB BANK</b></p>
                  <p className="font-bold text-slate-700">📌 Số tài khoản: <b className="text-sky-600">0399999999</b></p>
                  <p className="font-bold text-slate-700">📌 Chủ tài khoản: <b>NGUYEN VAN A</b></p>
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Đóng Hộp Thoại
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
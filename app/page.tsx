"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// Dữ liệu mẫu Cày Thuê Blox Fruits
const CAY_THUE_DATA = [
  { id: 1, name: "Up Level Max (2550)", price: 50000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500" },
  { id: 2, name: "Cày Melee V2 (Godhuman)", price: 80000, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500" },
  { id: 3, name: "Farm Băng Tuyết (Snow Mountain)", price: 30000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500" },
  { id: 4, name: "Săn Tộc V4 (Full Gear)", price: 150000, image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500" },
];

// Dữ liệu mẫu Shop Acc Blox Fruits
const SHOP_ACC_DATA = [
  { id: 101, title: "Acc Max Level + MoChi V2", price: 120000, code: "ACC-01", desc: "Melee Godhuman, Kiếm CDK, Trái Mochi V2 Full Kỹ Năng", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500" },
  { id: 102, title: "Acc Race V4 Full Gear + Dragon", price: 250000, code: "ACC-02", desc: "Tộc V4 Thỏ/Tộc V4 Thiên Thần, Trái Rồng Permanent, 50M Beli", image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500" },
  { id: 103, title: "Acc Giá Rẻ Cho Học Sinh", price: 30000, code: "ACC-03", desc: "Level 1500+, Có Trái Leo/Magma, Đủ Đi Sea 3", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500" },
];

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | "order_caythue" | "buy_acc" | null>(null);
  const [activeTab, setActiveTab] = useState<"caythue" | "shopacc">("caythue");
  
  // Selected items for modal
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedAcc, setSelectedAcc] = useState<any>(null);

  // Form Cày thuê (Acc Roblox của khách)
  const [robloxUsername, setRobloxUsername] = useState("");
  const [robloxPassword, setRobloxPassword] = useState("");
  const [note, setNote] = useState("");

  // State Form Auth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State User
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getFakeEmail = (uname: string) => `${uname.trim().toLowerCase()}@shop.com`;

  // ĐĂNG KÝ
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fakeEmail = getFakeEmail(username);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
        options: { data: { username: username } }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase.from("profiles").upsert([
          { id: data.user.id, username: username, balance: 0, role: "user" }
        ]);
        alert("🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
        setModalType("login");
      }
    } catch (err: any) {
      setError(err.message || "Tên tài khoản này đã được sử dụng hoặc không hợp lệ!");
    } finally {
      setLoading(false);
    }
  };

  // ĐĂNG NHẬP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fakeEmail = getFakeEmail(username);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
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

  // ĐĂNG XUẤT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert("Đã đăng xuất thành công!");
  };

  // ĐẶT ĐƠN CÀY THUÊ
  const handleOrderCayThue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đặt dịch vụ!");
      setModalType("login");
      return;
    }
    alert(`🎉 Đặt đơn cày thuê "${selectedService?.name}" thành công! Shop sẽ tiến hành xử lý.`);
    setModalType(null);
    setRobloxUsername("");
    setRobloxPassword("");
    setNote("");
  };

  // MUA ACC
  const handleBuyAcc = (acc: any) => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua acc!");
      setModalType("login");
      return;
    }
    setSelectedAcc(acc);
    setModalType("buy_acc");
  };

  const confirmBuyAcc = () => {
    alert(`🎉 Đặt mua ${selectedAcc?.title} thành công! Vui lòng liên hệ Admin để nhận thông tin Nick.`);
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-xl text-amber-500 tracking-wider">SHOP BLOX FRUITS</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
            {user ? (
              <>
                <span className="text-slate-300">
                  Chào, <b className="text-amber-400">{user.user_metadata?.username || username}</b>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setModalType("login"); setError(""); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg font-semibold transition"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => { setModalType("register"); setError(""); }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-lg font-bold transition"
                >
                  Đăng Ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BANNER HERO */}
      <div className="bg-gradient-to-r from-amber-600/20 via-slate-900 to-blue-600/20 py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-amber-400 mb-3">DỊCH VỤ BLOX FRUITS UY TÍN #1</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Cày thuê Cực Tốc - Shop Acc Blox Fruits Giá Rẻ, Chất Lượng, Bảo Hành Đổi Trả 100%.
          </p>

          {/* TAB NÚT CHUYỂN MỤC */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setActiveTab("caythue")}
              className={`px-6 py-2.5 rounded-xl font-bold transition ${
                activeTab === "caythue"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              🔥 CÀY THUÊ BLOX FRUITS
            </button>
            <button
              onClick={() => setActiveTab("shopacc")}
              className={`px-6 py-2.5 rounded-xl font-bold transition ${
                activeTab === "shopacc"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              🛒 SHOP ACC BLOX FRUITS
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* PHẦN 1: DỊCH VỤ CÀY THUÊ */}
        {activeTab === "caythue" && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
              <span>⚡</span> DANH SÁCH DỊCH VỤ CÀY THUÊ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CAY_THUE_DATA.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition duration-300 flex flex-col">
                  <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-base mb-2 text-slate-100">{item.name}</h3>
                      <p className="text-amber-400 font-extrabold text-lg mb-4">
                        {item.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(item);
                        setModalType("order_caythue");
                      }}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition"
                    >
                      Thuê Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHẦN 2: SHOP ACC BLOX FRUITS */}
        {activeTab === "shopacc" && (
          <div>
            <h2 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
              <span>👑</span> DANH SÁCH ACC BLOX FRUITS VIP
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOP_ACC_DATA.map((acc) => (
                <div key={acc.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition duration-300 flex flex-col">
                  <div className="relative">
                    <img src={acc.image} alt={acc.title} className="h-48 w-full object-cover" />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      Mã: {acc.code}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-base mb-1 text-slate-100">{acc.title}</h3>
                      <p className="text-xs text-slate-400 mb-3">{acc.desc}</p>
                      <p className="text-emerald-400 font-extrabold text-xl mb-4">
                        {acc.price.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                    <button
                      onClick={() => handleBuyAcc(acc)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition"
                    >
                      Mua Ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL CỬA SỔ NỔI */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>

            {/* FORM ĐĂNG NHẬP */}
            {modalType === "login" && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-center text-blue-400">ĐĂNG NHẬP TÀI KHOẢN</h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-2.5 rounded-lg text-xs mb-4">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Tên tài khoản</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tên tài khoản"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg text-sm transition cursor-pointer"
                  >
                    {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                  </button>
                </form>
                <p className="text-xs text-center mt-4 text-slate-400">
                  Chưa có tài khoản?{" "}
                  <button onClick={() => { setModalType("register"); setError(""); }} className="text-amber-400 font-semibold hover:underline">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            )}

            {/* FORM ĐĂNG KÝ */}
            {modalType === "register" && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-center text-amber-400">ĐĂNG KÝ TÀI KHOẢN MỚI</h2>
                {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-2.5 rounded-lg text-xs mb-4">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Tên tài khoản</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tên tài khoản muốn tạo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Mật khẩu</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold rounded-lg text-sm text-slate-950 transition mt-2 cursor-pointer"
                  >
                    {loading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                  </button>
                </form>
                <p className="text-xs text-center mt-4 text-slate-400">
                  Đã có tài khoản?{" "}
                  <button onClick={() => { setModalType("login"); setError(""); }} className="text-blue-400 font-semibold hover:underline">
                    Đăng nhập
                  </button>
                </p>
              </div>
            )}

            {/* FORM ĐẶT ĐƠN CÀY THUÊ */}
            {modalType === "order_caythue" && selectedService && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-center text-amber-400">ĐẶT ĐƠN CÀY THUÊ</h2>
                <p className="text-xs text-center text-slate-400 mb-4">{selectedService.name} - <b className="text-amber-400">{selectedService.price.toLocaleString("vi-VN")} VNĐ</b></p>
                <form onSubmit={handleOrderCayThue} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Tên Tài Khoản Roblox</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tài khoản Roblox"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Mật Khẩu Roblox</label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập mật khẩu Roblox"
                      value={robloxPassword}
                      onChange={(e) => setRobloxPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-slate-300">Ghi chú cho Admin (Mã PIN 2FA, yêu cầu...)</label>
                    <textarea
                      placeholder="Ví dụ: Mã 2FA là 123456 hoặc cày buổi tối..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 h-20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition cursor-pointer"
                  >
                    Xác Nhận Đặt Đơn
                  </button>
                </form>
              </div>
            )}

            {/* MODAL MUA ACC */}
            {modalType === "buy_acc" && selectedAcc && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-center text-blue-400">XÁC NHẬN MUA TÀI KHOẢN</h2>
                <div className="bg-slate-800 p-3 rounded-lg mb-4 text-xs space-y-1">
                  <p>Mã Nick: <b className="text-amber-400">{selectedAcc.code}</b></p>
                  <p>Tên Acc: <b>{selectedAcc.title}</b></p>
                  <p>Giá tiền: <b className="text-emerald-400 text-sm">{selectedAcc.price.toLocaleString("vi-VN")} VNĐ</b></p>
                </div>
                <button
                  onClick={confirmBuyAcc}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-sm transition cursor-pointer"
                >
                  Xác Nhận Mua
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
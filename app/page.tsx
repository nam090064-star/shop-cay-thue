"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// Dữ liệu mẫu 2 danh mục chính
const CAY_THUE_SERVICES = [
  { id: 1, name: "Up Level Max (2550)", price: 50000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500" },
  { id: 2, name: "Cày Melee V2 (Godhuman)", price: 80000, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500" },
  { id: 3, name: "Săn Tộc V4 (Full Gear)", price: 150000, image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500" },
  { id: 4, name: "Farm Beli & Fragment", price: 40000, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500" },
];

const ACC_BLOXFRUITS_LIST = [
  { id: 101, title: "Acc Max Level + Mochi V2", price: 120000, code: "ACC-01", desc: "Godhuman, CDK, Mochi V2 Full Skill", image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500" },
  { id: 102, title: "Acc Race V4 Full Gear + Dragon", price: 250000, code: "ACC-02", desc: "Tộc V4 Thỏ, Trái Rồng Permanent", image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500" },
  { id: 103, title: "Acc Giá Rẻ Cho Học Sinh", price: 30000, code: "ACC-03", desc: "Level 1500+, Có Trái Leopard / Magma", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500" },
];

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | "order_caythue" | "buy_acc" | "nap_tien" | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "caythue" | "shopacc">("all");
  
  // Selected items
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

  // User & Profile State
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  // Lấy thông tin user đăng nhập
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

  // 1. ĐĂNG KÝ
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

  // 2. ĐĂNG NHẬP
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

  // 3. ĐĂNG XUẤT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBalance(0);
    alert("Đã đăng xuất thành công!");
  };

  // 4. XỬ LÝ CÀY THUÊ
  const handleOrderCayThue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đặt dịch vụ!");
      setModalType("login");
      return;
    }
    alert(`🎉 Đặt đơn cày thuê "${selectedService?.name}" thành công! Shop sẽ xử lý trong 24h.`);
    setModalType(null);
    setRobloxUsername("");
    setRobloxPassword("");
    setNote("");
  };

  // 5. XỬ LÝ MUA ACC
  const confirmBuyAcc = () => {
    alert(`🎉 Mua ${selectedAcc?.title} thành công! Thông tin tài khoản sẽ được gửi đến bạn.`);
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER / NAVBAR STYLE SHOPSONB */}
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* LOGO SHOP */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-sky-400 to-blue-600 text-white font-black text-xl px-3 py-1 rounded-xl shadow-md tracking-wider">
              MYSHOP.COM
            </div>
          </div>

          {/* USER ACTION BUTTONS */}
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

      {/* BANNER & TOP NẠP BẢNG VINH DANH */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        {/* Banner Hình Ảnh Tuỳ Chỉnh */}
        <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-sky-200 mb-6 bg-slate-900 relative">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=450&fit=crop" 
            alt="Banner Shop" 
            className="w-full h-48 md:h-72 object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <span className="bg-sky-500 text-white font-black text-sm md:text-xl px-4 py-2 rounded-xl shadow-lg border border-sky-300">
              ⚡ SHOP GAME DUYỆT ĐƠN SIÊU TỐC - UY TÍN 100%
            </span>
          </div>
        </div>

        {/* Khung TOP Nạp Tháng */}
        <div className="bg-white border border-sky-200 rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 py-3 text-center text-white font-extrabold text-base md:text-lg flex items-center justify-center gap-2">
            🏆 TOP NẠP THÁNG 08/2026
          </div>
          <div className="p-4 space-y-2 text-xs md:text-sm">
            <div className="flex justify-between items-center bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="font-bold text-slate-700">🥇 1. huy****</span>
              <span className="font-black text-amber-600">+1.530.000 đ</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700">🥈 2. duy****</span>
              <span className="font-black text-rose-500">+1.500.000 đ</span>
            </div>
            <div className="flex justify-between items-center bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
              <span className="font-bold text-slate-700">🥉 3. Dun*****</span>
              <span className="font-black text-amber-600">+1.170.000 đ</span>
            </div>
          </div>
          <div className="p-3 bg-sky-50 border-t border-sky-100 text-center">
            <button 
              onClick={() => setModalType("nap_tien")}
              className="bg-sky-400 hover:bg-sky-500 text-white font-extrabold px-6 py-2 rounded-xl text-xs md:text-sm shadow transition"
            >
              👉 NẠP TIỀN NGAY 👈
            </button>
          </div>
        </div>
      </div>

      {/* DANH MỤC SẢN PHẨM TRANG CHỦ */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-sky-600 mb-2 uppercase tracking-wide">
            DANH MỤC DỊCH VỤ BLOX FRUITS
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">Chọn dịch vụ bạn muốn trải nghiệm ngay bên dưới</p>
        </div>

        {/* CÁC MỤC DANH MỤC GIỐNG ẢNH MẪU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MỤC 1: CÀY THUÊ BLOX FRUITS */}
          <div className="bg-sky-50/60 border-2 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-sky-200 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500" 
                alt="Cày Thuê Blox Fruits" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-extrabold text-xl text-sky-600 mb-2 uppercase tracking-wide">
              CÀY THUÊ BLOX-FRUITS
            </h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1 rounded-full mb-4 border border-emerald-300">
              Sẵn Sàng
            </span>
            <button
              onClick={() => setActiveTab(activeTab === "caythue" ? "all" : "caythue")}
              className="w-full py-3 bg-sky-400 hover:bg-sky-500 text-white font-black rounded-2xl text-base shadow-md transition flex items-center justify-center gap-2"
            >
              XEM TẤT CẢ $\rightarrow$
            </button>
          </div>

          {/* MỤC 2: ACC BLOX FRUITS TỔNG HỢP */}
          <div className="bg-sky-50/60 border-2 border-sky-200 rounded-3xl p-5 shadow-md flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-sky-200 shadow-inner">
              <img 
                src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500" 
                alt="Acc Blox Fruits Tổng Hợp" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-extrabold text-xl text-sky-600 mb-2 uppercase tracking-wide">
              ACC BLOX-FRUITS TỔNG HỢP
            </h3>
            <span className="bg-sky-100 text-rose-600 text-xs font-bold px-4 py-1 rounded-full mb-4 border border-sky-300">
              Còn 25 Acc
            </span>
            <button
              onClick={() => setActiveTab(activeTab === "shopacc" ? "all" : "shopacc")}
              className="w-full py-3 bg-sky-400 hover:bg-sky-500 text-white font-black rounded-2xl text-base shadow-md transition flex items-center justify-center gap-2"
            >
              XEM TẤT CẢ $\rightarrow$
            </button>
          </div>

        </div>

        {/* CHI TIẾT DANH SÁCH SẢN PHẨM KHI CLICK NÚT XEM TẤT CẢ */}
        {(activeTab === "caythue" || activeTab === "all") && (
          <div className="mt-12">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
              ⚡ GÓI CÀY THUÊ HOT
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CAY_THUE_SERVICES.map((s) => (
                <div key={s.id} className="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <img src={s.image} alt={s.name} className="h-32 w-full object-cover rounded-xl mb-3" />
                  <h4 className="font-bold text-sm text-slate-700 mb-1">{s.name}</h4>
                  <p className="text-sky-600 font-extrabold text-base mb-3">{s.price.toLocaleString("vi-VN")} VNĐ</p>
                  <button
                    onClick={() => { setSelectedService(s); setModalType("order_caythue"); }}
                    className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs transition"
                  >
                    Thuê Ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === "shopacc" || activeTab === "all") && (
          <div className="mt-12">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4 border-l-4 border-sky-500 pl-3">
              🛒 KHO ACC BLOX FRUITS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACC_BLOXFRUITS_LIST.map((acc) => (
                <div key={acc.id} className="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <img src={acc.image} alt={acc.title} className="h-36 w-full object-cover rounded-xl mb-3" />
                  <h4 className="font-bold text-sm text-slate-700 mb-1">{acc.title}</h4>
                  <p className="text-xs text-slate-400 mb-2">{acc.desc}</p>
                  <p className="text-emerald-600 font-extrabold text-lg mb-3">{acc.price.toLocaleString("vi-VN")} VNĐ</p>
                  <button
                    onClick={() => {
                      if (!user) { alert("Vui lòng đăng nhập!"); setModalType("login"); return; }
                      setSelectedAcc(acc); setModalType("buy_acc");
                    }}
                    className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs transition"
                  >
                    Mua Ngay
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODALS HỘP THOẠI NỔI */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-sky-100 w-full max-w-md rounded-3xl p-6 relative shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* FORM ĐĂNG NHẬP */}
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
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
                  >
                    {loading ? "Đang xử lý..." : "Đăng Nhập"}
                  </button>
                </form>
                <p className="text-xs text-center mt-4 text-slate-500">
                  Chưa có tài khoản?{" "}
                  <button onClick={() => { setModalType("register"); setError(""); }} className="text-sky-600 font-bold hover:underline">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            )}

            {/* FORM ĐĂNG KÝ */}
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
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md mt-2"
                  >
                    {loading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                  </button>
                </form>
                <p className="text-xs text-center mt-4 text-slate-500">
                  Đã có tài khoản?{" "}
                  <button onClick={() => { setModalType("login"); setError(""); }} className="text-sky-600 font-bold hover:underline">
                    Đăng nhập
                  </button>
                </p>
              </div>
            )}

            {/* MODAL CÀY THUÊ */}
            {modalType === "order_caythue" && selectedService && (
              <div>
                <h2 className="text-lg font-extrabold mb-1 text-center text-sky-600 uppercase">ĐẶT ĐƠN CÀY THUÊ</h2>
                <p className="text-xs text-center text-slate-500 mb-4">{selectedService.name} - <b className="text-sky-600">{selectedService.price.toLocaleString("vi-VN")}đ</b></p>
                <form onSubmit={handleOrderCayThue} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Tên Tài Khoản Roblox</label>
                    <input
                      type="text"
                      required
                      placeholder="Nhập tài khoản Roblox"
                      value={robloxUsername}
                      onChange={(e) => setRobloxUsername(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Mật Khẩu Roblox</label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập mật khẩu Roblox"
                      value={robloxPassword}
                      onChange={(e) => setRobloxPassword(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600">Ghi chú (Mã 2FA / Yêu cầu)</label>
                    <textarea
                      placeholder="Ví dụ: Mã PIN 2FA..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 h-20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
                  >
                    Xác Nhận Đặt Đơn
                  </button>
                </form>
              </div>
            )}

            {/* MODAL MUA ACC */}
            {modalType === "buy_acc" && selectedAcc && (
              <div>
                <h2 className="text-lg font-extrabold mb-2 text-center text-sky-600 uppercase">XÁC NHẬN MUA ACC</h2>
                <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl mb-4 text-xs space-y-1">
                  <p>Mã Nick: <b className="text-sky-700">{selectedAcc.code}</b></p>
                  <p>Tên Acc: <b>{selectedAcc.title}</b></p>
                  <p>Giá tiền: <b className="text-emerald-600 text-sm">{selectedAcc.price.toLocaleString("vi-VN")}đ</b></p>
                </div>
                <button
                  onClick={confirmBuyAcc}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
                >
                  Xác Nhận Mua
                </button>
              </div>
            )}

            {/* MODAL NẠP TIỀN BANK / MOMO */}
            {modalType === "nap_tien" && (
              <div>
                <h2 className="text-lg font-extrabold mb-3 text-center text-sky-600 uppercase">NẠP TIỀN TỰ ĐỘNG</h2>
                <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl text-xs space-y-2 mb-4">
                  <p className="font-bold text-slate-700">📌 Ngân hàng: <b className="text-sky-600">MB BANK</b></p>
                  <p className="font-bold text-slate-700">📌 Số tài khoản: <b className="text-sky-600">0399999999</b></p>
                  <p className="font-bold text-slate-700">📌 Chủ tài khoản: <b>NGUYEN VAN A</b></p>
                  <p className="font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    Nội dung chuyển khoản: <b className="text-sky-700 uppercase">NAP {user?.user_metadata?.username || username}</b>
                  </p>
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
"use client";

import { useState, useEffect } from "react";
// Import supabase - nếu dòng dưới báo đỏ bạn chỉ cần đổi tên file/đường dẫn lại chút nhé
import { supabase } from "@/lib/supabase"; 

export default function Home() {
  const [modalType, setModalType] = useState<"login" | "register" | "napbank" | null>(null);
  
  // State Form Auth (Chỉ dùng Username và Password)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State User
  const [user, setUser] = useState<any>(null);

  // Lấy thông tin user đăng nhập
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

  // Tạo email ảo theo username để Supabase Auth chấp nhận (vì Supabase Auth bắt buộc có email)
  const getFakeEmail = (uname: string) => `${uname.trim().toLowerCase()}@shop.com`;

  // 1. XỬ LÝ ĐĂNG KÝ
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fakeEmail = getFakeEmail(username);

    try {
      // Đăng ký trên Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
        options: {
          data: { username: username }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Lưu thông tin vào bảng profiles
        await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            username: username,
            balance: 0,
            role: "user"
          }
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

  // 2. XỬ LÝ ĐĂNG NHẬP
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

  // 3. XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert("Đã đăng xuất thành công!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl text-amber-500">SHOP CẦY THUÊ</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
            {user ? (
              <>
                <span className="text-slate-300">
                  Chào, <b className="text-amber-400">{user.user_metadata?.username || username}</b>
                </span>
                <button
                  onClick={() => setModalType("napbank")}
                  className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg font-semibold"
                >
                  Nạp Tiền
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg font-semibold"
                >
                  Đăng Xuất
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setModalType("login"); setError(""); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => { setModalType("register"); setError(""); }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-semibold"
                >
                  Đăng Ký
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Chào Mừng Đến Với Shop Cầy Thuê Roblox</h1>
        <p className="text-center text-slate-400">Vui lòng đăng ký/đăng nhập để trải nghiệm dịch vụ.</p>
      </main>

      {/* MODAL CỬA SỔ NỔI: ĐĂNG NHẬP / ĐĂNG KÝ */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
            {/* Nút đóng X */}
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
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg text-sm transition"
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
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-bold rounded-lg text-sm text-black transition mt-2"
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
          </div>
        </div>
      )}
    </div>
  );
}
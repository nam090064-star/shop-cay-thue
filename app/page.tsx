"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  // Modal State
  const [modalType, setModalType] = useState<"login" | "register" | "napbank" | "napthe" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"caythue" | "accv4" | null>(null);

  // Form Nạp Thẻ Cào State
  const [telco, setTelco] = useState("VIETTEL");
  const [amount, setAmount] = useState("10000");
  const [pin, setPin] = useState("");
  const [serial, setSerial] = useState("");

  // Form Đặt Đơn Cày Thuê State
  const [accountInfo, setAccountInfo] = useState("");
  const [note, setNote] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Form Đặt Acc V4 State
  const [accContact, setAccContact] = useState("");
  const [accPackages] = useState([
    { id: 1, title: "Acc Blox Fruits V4 Full Gear (Random Tộc)", price: 45000, desc: "Level Max + V4 Full Gear + Trái Ác Quỷ ngon" },
    { id: 2, title: "Acc Blox Fruits Max Level Godhuan Song Kiếm SGT", price: 15000, desc: "Level Max + V4 Full Gear Tộc Quỷ + Melee Godhuman" },
  ]);
  const [selectedAcc, setSelectedAcc] = useState<any>(accPackages[0]);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ngân hàng cấu hình VietQR
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // STK thật của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Tên chủ tài khoản

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("*");
      if (data && data.length > 0) {
        setServices(data);
        setSelectedService(data[0]);
      }
    };
    fetchServices();
  }, []);

  // Xử lý gửi Thẻ Cào
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !serial) return alert("Vui lòng nhập Mã thẻ và Serial!");
    alert(`Đã gửi thẻ ${telco} mệnh giá ${Number(amount).toLocaleString()}đ thành công! Hệ thống đang xử lý.`);
    setModalType(null);
    setPin("");
    setSerial("");
  };

  // Xử lý Cày Thuê
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInfo || !selectedService) return alert("Vui lòng nhập thông tin tài khoản!");

    setLoading(true);
    const fullData = `[CÀY THUÊ]\n[TK/MK/Mã 2FA]:\n${accountInfo}\n\n[Ghi chú]:\n${note || "Không có"}`;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: "Khách Cày Thuê",
        account_info: fullData,
        service_title: selectedService.title,
        amount: selectedService.price,
        status: "Pending",
      },
    ]);
    setLoading(false);

    if (error) alert("Lỗi: " + error.message);
    else setIsSubmitted(true);
  };

  // Xử lý Mua Acc
  const handleAccSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accContact || !selectedAcc) return alert("Vui lòng nhập Zalo/SĐT!");

    setLoading(true);
    const fullData = `[MUA ACC V4 FULL GEAR]\n[Liên hệ nhận Acc]: ${accContact}`;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: `Khách Mua Acc (${accContact})`,
        account_info: fullData,
        service_title: selectedAcc.title,
        amount: selectedAcc.price,
        status: "Pending",
      },
    ]);
    setLoading(false);

    if (error) alert("Lỗi: " + error.message);
    else setIsSubmitted(true);
  };

  const currentPrice = selectedCategory === "caythue" ? selectedService?.price : selectedAcc?.price;

  return (
  <div className="min-h-screen bg-slate-100 text-slate-800">
    {/* 1. HEADER / THANH MENU CHÍNH */}
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo Shop */}
      <div 
        className="cursor-pointer flex items-center" 
        onClick={() => {
  setSelectedCategory(null);
  setSelectedService(null);
}}
      >
        <img 
  src="/logo.png.png" 
  alt="Logo Roblox Giá Rẻ" 
  className="h-10 md:h-14 object-contain" 
/>
      </div>

      {/* Các nút bấm góc phải Header */}
<div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
  {/* Nút Đăng Nhập */}
  <button
    onClick={() => setModalType("login")}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium transition"
  >
    Đăng Nhập
  </button>

  {/* Nút Đăng Ký */}
  <button
    onClick={() => setModalType("register")}
    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-medium transition"
  >
    Đăng Ký
  </button>

  {/* Nút Nạp Tiền */}
  <button
    onClick={() => setModalType("napbank")}
    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-medium transition"
  >
    Nạp Tiền
  </button>
{/* ================= MODAL ĐĂNG KÝ ================= */}
{modalType === "register" && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    <div className="bg-white p-6 rounded-2xl max-w-sm w-full relative shadow-2xl border border-slate-100">
      
      {/* Nút đóng (X) */}
      <button 
        onClick={() => setModalType(null)} 
        className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl font-bold transition"
      >
        ✕
      </button>

      {/* Tiêu đề */}
      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-slate-800 tracking-wide uppercase">
          Tạo Tài Khoản
        </h2>
        <p className="text-xs text-slate-500 mt-1">Đăng ký để bắt đầu mua sắm tại shop</p>
      </div>
      
      {/* Form nhập thông tin */}
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập."); 
          setModalType("login"); 
        }} 
        className="space-y-3"
      >
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Tên tài khoản</label>
          <input 
            type="text" 
            required 
            placeholder="Nhập tên tài khoản..." 
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Mật khẩu</label>
          <input 
            type="password" 
            required 
            placeholder="Nhập mật khẩu..." 
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition" 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Xác nhận mật khẩu</label>
          <input 
            type="password" 
            required 
            placeholder="Nhập lại mật khẩu..." 
            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition transform active:scale-95 mt-2"
        >
          Đăng Ký Ngay
        </button>
      </form>

      {/* Chuyển sang Đăng nhập nếu đã có tài khoản */}
      <div className="text-center mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
        Đã có tài khoản?{" "}
        <button 
          onClick={() => setModalType("login")}
          className="text-blue-600 font-bold hover:underline"
        >
          Đăng nhập ngay
        </button>
      </div>

    </div>
  </div>
)}</div>

    </header>
      {/* 2. MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* BANNER THÔNG BÁO */}
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 text-sm text-sky-900 shadow-sm">
          📢 <b>THÔNG BÁO:</b> Shop duyệt đơn tự động 24/7. Uy tín - Giá rẻ - Bảo hành trọn đời cho anh em!
        </div>

        {/* 3. MÀN HÌNH CHỌN CARD DANH MỤC */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* CARD 1: CÀY THUÊ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col items-center hover:shadow-xl transition">
              <img
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe6FpAyfVSQM27Y4axZI8m9i0dkg68F9nEP7pLgCHE-NCP1jDJyzAv6VGG&s=10"
  alt="Cày Thuê"
  className="w-full h-48 object-cover"
/>
              <div className="p-5 w-full text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase">CÀY THUÊ BLOX-FRUITS</h2>
                <span className="inline-block bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Sẵn Sàng
                </span>
                <button
                  onClick={() => setSelectedCategory("caythue")}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  XEM TẤT CẢ ➔
                </button>
              </div>
            </div>

            {/* CARD 2: ACC V4 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col items-center hover:shadow-xl transition">
              <img
  src="https://assetsio.gnwcdn.com/roblox-blox-fruits-codes-list.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp"
  alt="Acc V4"
  className="w-full h-48 object-cover"
/>
              <div className="p-5 w-full text-center">
                <h2 className="text-xl font-bold text-sky-600 mb-2 uppercase">ACC BLOX-FRUITS V4 FULL GEAR</h2>
                <span className="inline-block bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Còn 15
                </span>
                <button
                  onClick={() => setSelectedCategory("accv4")}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  XEM TẤT CẢ ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. MÀN HÌNH ĐẶT HÀNG FORM */}
        {selectedCategory && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
            <button
              onClick={() => { setSelectedCategory(null); setIsSubmitted(false); }}
              className="text-xs font-bold text-sky-600 hover:underline mb-4 inline-block"
            >
              ⬅ Quay lại danh mục chính
            </button>

            {!isSubmitted ? (
              <>
                {selectedCategory === "caythue" && (
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 border-b pb-2">⚔️ DỊCH VỤ CÀY THUÊ</h2>
                    <div>
                      <label className="block text-sm font-semibold mb-1">1. Chọn gói cày:</label>
                      <select
                        value={selectedService?.id || ""}
                        onChange={(e) => {
                          const found = services.find((s) => s.id.toString() === e.target.value);
                          if (found) setSelectedService(found);
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-sky-500"
                      >
                        {services.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">2. Thông tin acc cần cày (kèm Mã 2FA):</label>
                      <textarea
                        placeholder="TK: acc_game&#10;MK: 123456&#10;Mã dự phòng 2FA: 123456, 789012"
                        value={accountInfo}
                        onChange={(e) => setAccountInfo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 h-28 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">3. Ghi chú (không bắt buộc):</label>
                      <input
                        type="text"
                        placeholder="Lưu ý riêng của bạn..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || services.length === 0}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2"
                    >
                      {loading ? "Đang xử lý..." : "XÁC NHẬN TẠO ĐƠN THANH TOÁN"}
                    </button>
                  </form>
                )}

                {selectedCategory === "accv4" && (
                  <form onSubmit={handleAccSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-sky-600 border-b pb-2">🔥 ACC BLOX FRUITS V4 FULL GEAR</h2>
                    <div>
                      <label className="block text-sm font-semibold mb-1">1. Chọn gói Acc:</label>
                      <select
                        value={selectedAcc?.id || ""}
                        onChange={(e) => {
                          const found = accPackages.find((a) => a.id.toString() === e.target.value);
                          if (found) setSelectedAcc(found);
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-sky-500"
                      >
                        {accPackages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedAcc && (
                      <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sm text-sky-800">
                        <p className="font-bold mb-1">Chi tiết gói:</p>
                        <p>{selectedAcc.desc}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold mb-1">2. Nhập Zalo/SĐT nhận Acc:</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Zalo 0912345678"
                        value={accContact}
                        onChange={(e) => setAccContact(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-2"
                    >
                      {loading ? "Đang xử lý..." : "XÁC NHẬN MUA ACC"}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold text-emerald-600">Tạo Đơn Thành Công!</h2>
                <p className="text-sm text-slate-600">Quét mã QR để chuyển khoản thanh toán:</p>
                {currentPrice && (
                  <img
                    src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${currentPrice}&addInfo=THANH%20TOAN%20SHOP`}
                    alt="Mã QR"
                    className="w-full border-2 border-sky-500 rounded-xl p-2 bg-white shadow-md"
                  />
                )}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  Tạo đơn mới
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. MODALS POPUP (NẠP NGÂN HÀNG / NẠP THẺ CÀO / ĐĂNG NHẬP / ĐĂNG KÝ) */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            {/* MODAL NẠP BANK */}
            {modalType === "napbank" && (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">🏦 NẠP TIỀN QUA NGÂN HÀNG (VIETQR)</h3>
                <img
                  src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=50000&addInfo=NAP%20TIEN%20SHOP`}
                  alt="Mã QR Nạp Tiền"
                  className="w-64 mx-auto border rounded-xl p-2 bg-white shadow-sm"
                />
                <div className="text-left bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                  <p><b>Ngân hàng:</b> {BANK_ID}</p>
                  <p><b>Số tài khoản:</b> {ACCOUNT_NO}</p>
                  <p><b>Chủ tài khoản:</b> {ACCOUNT_NAME}</p>
                  <p><b>Nội dung CK:</b> NAPTIEN [Tên_Tài_Khoản]</p>
                </div>
              </div>
            )}

            {/* MODAL NẠP THẺ CÀO */}
            {modalType === "napthe" && (
              <form onSubmit={handleCardSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">💳 NẠP THẺ CÀO TỰ ĐỘNG</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Loại thẻ:</label>
                  <select
                    value={telco}
                    onChange={(e) => setTelco(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-sm bg-slate-50"
                  >
                    <option value="VIETTEL">Viettel</option>
                    <option value="VINAPHONE">Vinaphone</option>
                    <option value="MOBIFONE">Mobifone</option>
                    <option value="ZING">Zing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Mệnh giá:</label>
                  <select
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-sm bg-slate-50"
                  >
                    <option value="10000">10.000 VNĐ</option>
                    <option value="20000">20.000 VNĐ</option>
                    <option value="50000">50.000 VNĐ</option>
                    <option value="100000">100.000 VNĐ</option>
                    <option value="200000">200.000 VNĐ</option>
                    <option value="500000">500.000 VNĐ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Mã thẻ (PIN):</label>
                  <input
                    type="text"
                    placeholder="Nhập mã mã thẻ cào"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Số Serial:</label>
                  <input
                    type="text"
                    placeholder="Nhập số serial"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full border rounded-xl p-2.5 text-sm bg-slate-50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  NẠP THẺ NGAY
                </button>
              </form>
            )}

            {/* MODAL ĐĂNG NHẬP */}
            {modalType === "login" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">🔑 ĐĂNG NHẬP TÀI KHOẢN</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Tài khoản / Email:</label>
                  <input type="text" placeholder="Tên đăng nhập" className="w-full border rounded-xl p-2.5 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Mật khẩu:</label>
                  <input type="password" placeholder="Mật khẩu" className="w-full border rounded-xl p-2.5 text-sm bg-slate-50" />
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  ĐĂNG NHẬP
                </button>
              </div>
            )}

            {/* MODAL ĐĂNG KÝ */}
            {modalType === "register" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">📝 ĐĂNG KÝ TÀI KHOẢN MỚI</h3>
                <div>
                  <label className="block text-xs font-bold mb-1">Tên đăng nhập:</label>
                  <input type="text" placeholder="Nhập tên đăng nhập" className="w-full border rounded-xl p-2.5 text-sm bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Mật khẩu:</label>
                  <input type="password" placeholder="Tạo mật khẩu" className="w-full border rounded-xl p-2.5 text-sm bg-slate-50" />
                </div>
                <button
                  onClick={() => setModalType(null)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  ĐĂNG KÝ NGAY
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
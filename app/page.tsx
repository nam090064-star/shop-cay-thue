"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<"caythue" | "accv4" | null>(null);

  // State Form Cày Thuê
  const [accountInfo, setAccountInfo] = useState("");
  const [note, setNote] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // State Form Bán Acc V4
  const [accContact, setAccContact] = useState("");
  const [accPackages, setAccPackages] = useState([
    { id: 1, title: "Acc Blox Fruits V4 Full Gear (Random Tộc)", price: 150000, desc: "Level Max + V4 Full Gear + Trái Ác Quỷ ngon" },
    { id: 2, title: "Acc Blox Fruits V4 Full Gear (Tộc Quỷ)", price: 200000, desc: "Level Max + V4 Full Gear Tộc Quỷ + Melee Godhuman" },
    { id: 3, title: "Acc Blox Fruits V4 Full Gear (Tộc Thỏ/Thiên Thần)", price: 220000, desc: "Level Max + V4 Full Gear + Song Kiếm Oden" },
  ]);
  const [selectedAcc, setSelectedAcc] = useState<any>(accPackages[0]);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ngân hàng
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // STK thật
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Tên thật

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
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-sky-600 uppercase tracking-wide">
          NGUYỄN THẮNG - SHOP ROBLOX UY TÍN
        </h1>

        {/* 1. MÀN HÌNH CHỌN CARD (KHI CHƯA BẤM VÀO MỤC NÀO) */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* CARD 1: CÀY THUÊ BLOX-FRUITS */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden flex flex-col items-center hover:shadow-2xl transition">
              <img
                src="https://via.placeholder.com/400x220/1e293b/ffffff?text=CAY+THUE+BLOX+FRUITS"
                alt="Cày thuê Blox Fruits"
                className="w-full h-48 object-cover"
              />
              <div className="p-5 w-full text-center flex flex-col items-center">
                <h2 className="text-xl font-extrabold text-slate-900 mb-2 uppercase">
                  CÀY THUÊ BLOX-FRUITS
                </h2>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Sẵn Sàng
                </span>
                <button
                  onClick={() => setSelectedCategory("caythue")}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  XEM TẤT CẢ ➔
                </button>
              </div>
            </div>

            {/* CARD 2: ACC BLOX FRUITS V4 FULL GEAR */}
            <div className="bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden flex flex-col items-center hover:shadow-2xl transition">
              <img
                src="https://via.placeholder.com/400x220/0f172a/ffffff?text=ACC+V4+FULL+GEAR"
                alt="Acc Blox Fruits V4"
                className="w-full h-48 object-cover"
              />
              <div className="p-5 w-full text-center flex flex-col items-center">
                <h2 className="text-xl font-extrabold text-sky-500 mb-2 uppercase">
                  ACC BLOX-FRUITS V4 FULL GEAR
                </h2>
                <span className="bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Còn 15
                </span>
                <button
                  onClick={() => setSelectedCategory("accv4")}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
                >
                  XEM TẤT CẢ ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MÀN HÌNH ĐẶT HÀNG (KHI ĐÃ BẤM XEM TẤT CẢ) */}
        {selectedCategory && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => { setSelectedCategory(null); setIsSubmitted(false); }}
              className="text-xs font-bold text-sky-600 hover:underline mb-4 inline-block"
            >
              ⬅ Quản lại danh mục chính
            </button>

            {!isSubmitted ? (
              <>
                {selectedCategory === "caythue" && (
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 border-b pb-2">
                      ⚔️ DỊCH VỤ CÀY THUÊ
                    </h2>
                    <div>
                      <label className="block text-sm font-semibold mb-1">1. Chọn dịch vụ:</label>
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
                    <h2 className="text-xl font-bold text-sky-600 border-b pb-2">
                      🔥 ACC BLOX FRUITS V4 FULL GEAR
                    </h2>
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
                    src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${currentPrice}&addInfo=THANH%20TOAN%20SHOP%20ROBLOX`}
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
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  // Tab hiện tại: "caythue" hoặc "accv4"
  const [activeTab, setActiveTab] = useState<"caythue" | "accv4">("caythue");

  // State Form Cày Thuê
  const [accountInfo, setAccountInfo] = useState("");
  const [note, setNote] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  // State Form Bán Acc V4
  const [accCustomerContact, setAccCustomerContact] = useState("");
  const [accPackages, setAccPackages] = useState([
    { id: 1, title: "Acc Blox Fruits V4 Full Gear (Random Tộc)", price: 150000, desc: "Level Max + V4 Full Gear + 1-2 Trái Ác Quỷ ngon" },
    { id: 2, title: "Acc Blox Fruits V4 Full Gear (Tộc Quỷ)", price: 200000, desc: "Level Max + V4 Full Gear Tộc Quỷ + Melee Godhuman" },
    { id: 3, title: "Acc Blox Fruits V4 Full Gear (Tộc Thỏ/Thiên Thần)", price: 220000, desc: "Level Max + V4 Full Gear + Song Kiếm Oden" },
  ]);
  const [selectedAcc, setSelectedAcc] = useState<any>(accPackages[0]);

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Thông tin ngân hàng của bạn
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Thay bằng STK thật của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Thay tên chủ TK thật

  // Lấy dịch vụ cày thuê từ Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*");
      if (!error && data && data.length > 0) {
        setServices(data);
        setSelectedService(data[0]);
      }
    };
    fetchServices();
  }, []);

  // Xử lý tạo đơn Cày thuê
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInfo || !selectedService) return alert("Vui lòng nhập thông tin tài khoản!");

    setLoading(true);
    const fullAccountData = `[CÀY THUÊ]\n[TK/MK/Mã dự phòng]:\n${accountInfo}\n\n[Ghi chú]:\n${note || "Không có"}`;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: "Khách Cày Thuê",
        account_info: fullAccountData,
        service_title: selectedService.title,
        amount: selectedService.price,
        status: "Pending",
      },
    ]);
    setLoading(false);

    if (error) alert("Có lỗi xảy ra: " + error.message);
    else setIsSubmitted(true);
  };

  // Xử lý tạo đơn Mua Acc V4
  const handleAccSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accCustomerContact || !selectedAcc) return alert("Vui lòng nhập Zalo/SĐT để nhận Acc!");

    setLoading(true);
    const fullAccountData = `[MUA ACC V4 FULL GEAR]\n[Liên hệ nhận Acc]: ${accCustomerContact}`;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: `Khách Mua Acc (${accCustomerContact})`,
        account_info: fullAccountData,
        service_title: selectedAcc.title,
        amount: selectedAcc.price,
        status: "Pending",
      },
    ]);
    setLoading(false);

    if (error) alert("Có lỗi xảy ra: " + error.message);
    else setIsSubmitted(true);
  };

  const currentPrice = activeTab === "caythue" ? selectedService?.price : selectedAcc?.price;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-amber-500 tracking-wide uppercase">
          NGUYỄN THẮNG - SHOP ROBLOX
        </h1>

        {/* THANH MENU CHỌN 2 MỤC */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6 border border-slate-700">
          <button
            type="button"
            onClick={() => { setActiveTab("caythue"); setIsSubmitted(false); }}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition ${
              activeTab === "caythue"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚔️ DỊCH VỤ CÀY THUÊ
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("accv4"); setIsSubmitted(false); }}
            className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition ${
              activeTab === "accv4"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 ACC BLOX FRUITS V4 FULL GEAR
          </button>
        </div>

        {!isSubmitted ? (
          <>
            {/* TAB 1: DỊCH VỤ CÀY THUÊ */}
            {activeTab === "caythue" && (
              <form onSubmit={handleServiceSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    1. Chọn dịch vụ cày thuê:
                  </label>
                  {services.length === 0 ? (
                    <p className="text-amber-400 text-sm italic">Đang tải danh sách dịch vụ...</p>
                  ) : (
                    <select
                      value={selectedService?.id || ""}
                      onChange={(e) => {
                        const found = services.find((s) => s.id.toString() === e.target.value);
                        if (found) setSelectedService(found);
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                    >
                      {services.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-300">
                    2. Nhập thông tin acc cần cày (bao gồm Mã dự phòng/2FA):
                  </label>
                  <textarea
                    placeholder="Tài khoản: acc_game123&#10;Mật khẩu: 12345678&#10;Mã dự phòng 2FA: 123456, 789012"
                    value={accountInfo}
                    onChange={(e) => setAccountInfo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-28"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-300">
                    3. Ghi chú cho đơn hàng (không bắt buộc):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Cày vào buổi tối..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || services.length === 0}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg mt-4"
                >
                  {loading ? "Đang xử lý..." : "XÁC NHẬN TẠO ĐƠN CÀY THUÊ"}
                </button>
              </form>
            )}

            {/* TAB 2: MUA ACC V4 FULL GEAR */}
            {activeTab === "accv4" && (
              <form onSubmit={handleAccSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    1. Chọn gói Acc Blox Fruits V4:
                  </label>
                  <select
                    value={selectedAcc?.id || ""}
                    onChange={(e) => {
                      const found = accPackages.find((a) => a.id.toString() === e.target.value);
                      if (found) setSelectedAcc(found);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  >
                    {accPackages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAcc && (
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-sm text-slate-300">
                    <p className="font-semibold text-amber-400 mb-1">Mô tả gói Acc:</p>
                    <p>{selectedAcc.desc}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-300">
                    2. Nhập Zalo / SĐT để shop gửi TK/MK Acc sau khi thanh toán:
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Zalo 0912345678"
                    value={accCustomerContact}
                    onChange={(e) => setAccCustomerContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg mt-4"
                >
                  {loading ? "Đang xử lý..." : "XÁC NHẬN MUA ACC"}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-green-400">Tạo Đơn Thành Công!</h2>
            <p className="text-sm text-slate-300">Quét mã QR để chuyển khoản thanh toán:</p>
            {currentPrice && (
              <img
                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${currentPrice}&addInfo=THANH%20TOAN%20SHOP%20ROBLOX`}
                alt="Mã QR"
                className="w-full border-2 border-amber-500 rounded-xl p-2 bg-white shadow-md"
              />
            )}
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 font-bold py-2.5 rounded-xl text-sm transition"
            >
              Tạo đơn mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
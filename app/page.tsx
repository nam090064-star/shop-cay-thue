"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [accountInfo, setAccountInfo] = useState("");
  const [note, setNote] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Thông tin ngân hàng của bạn
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Thay bằng STK thật của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Thay bằng tên chủ TK thật

  // Lấy toàn bộ danh sách dịch vụ
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

  // Xử lý khi khách bấm Tạo đơn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountInfo || !selectedService) {
      alert("Vui lòng nhập đầy đủ thông tin tài khoản!");
      return;
    }

    setLoading(true);

    // Ghép thông tin tài khoản và ghi chú để lưu vào database
    const fullAccountData = `[TK/MK/Mã dự phòng]:\n${accountInfo}\n\n[Ghi chú]:\n${note || "Không có"}`;

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: "Khách Đặt Web",
        account_info: fullAccountData,
        service_title: selectedService.title,
        amount: selectedService.price,
        status: "Pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Có lỗi xảy ra: " + error.message);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-amber-500 tracking-wide uppercase">
          NGUYỄN THẮNG - SHOP CÀY THUÊ
        </h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. CHỌN ĐƠN MUỐN CÀY */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                1. Chọn đơn muốn cày:
              </label>
              {services.length === 0 ? (
                <p className="text-amber-400 text-sm italic">
                  Đang tải danh sách dịch vụ...
                </p>
              ) : (
                <select
                  value={selectedService?.id || ""}
                  onChange={(e) => {
                    const found = services.find(
                      (s) => s.id.toString() === e.target.value
                    );
                    if (found) setSelectedService(found);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
                >
                  {services.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. NHẬP THÔNG TIN ACC CẦN CÀY */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                2. Nhập thông tin acc cần cày (bao gồm Mã dự phòng/2FA nếu có):
              </label>
              <textarea
                placeholder="Ví dụ:&#10;Tài khoản: acc_game123&#10;Mật khẩu: 12345678&#10;Mã dự phòng 2FA: 123456, 789012"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-28 transition"
                required
              />
            </div>

            {/* 3. GHI CHÚ CHO ĐƠN HÀNG */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                3. Ghi chú cho đơn hàng (không bắt buộc):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cày vào buổi tối, cất giùm trái ác quỷ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || services.length === 0}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg transition mt-4"
            >
              {loading ? "Đang xử lý..." : "XÁC NHẬN TẠO ĐƠN THANH TOÁN"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-green-400">Tạo Đơn Thành Công!</h2>
            <p className="text-sm text-slate-300">
              Quét mã QR để chuyển khoản thanh toán:
            </p>
            {selectedService && (
              <img
                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${selectedService.price}&addInfo=THANH%20TOAN%20CAY%20THUE`}
                alt="Mã QR Thanh Toán"
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
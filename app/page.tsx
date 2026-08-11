"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Thông tin ngân hàng của bạn
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Thay bằng STK thật của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Thay bằng tên chủ TK thật

  // Lấy danh sách dịch vụ thật từ Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*");
      if (!error && data && data.length > 0) {
        setServices(data);
        setSelectedService(data[0]); // Mặc định chọn dịch vụ đầu tiên
      }
    };

    fetchServices();
  }, []);

  // Xử lý tạo đơn hàng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !accountInfo || !selectedService) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customerName,
        account_info: accountInfo,
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
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-500">
          DỊCH VỤ CÀY THUÊ GAME
        </h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên / Zalo của bạn:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A (Zalo: 0912...)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tài khoản / Mật khẩu Game:
              </label>
              <textarea
                placeholder="TK: tk_game123&#10;MK: matkhau123&#10;Server: Asia"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Chọn gói cày thuê:
              </label>
              {services.length === 0 ? (
                <p className="text-amber-400 text-sm">Đang tải danh sách dịch vụ...</p>
              ) : (
                <select
                  onChange={(e) => {
                    const found = services.find((s) => s.id.toString() === e.target.value);
                    if (found) setSelectedService(found);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  {services.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} - {Number(item.price).toLocaleString("vi-VN")} VNĐ
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || services.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-500 font-bold py-3 rounded-lg transition mt-4"
            >
              {loading ? "Đang tạo đơn..." : "TẠO ĐƠN THANH TOÁN"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-green-400">Tạo Đơn Thành Công!</h2>
            <p className="text-sm text-slate-300">
              Quét mã QR dưới đây để chuyển khoản:
            </p>
            {selectedService && (
              <img
                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${selectedService.price}&addInfo=CT%20${customerName}`}
                alt="Mã QR Thanh Toán"
                className="w-full border-2 border-amber-500 rounded-lg p-2 bg-white"
              />
            )}
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 font-bold py-2 rounded-lg text-sm transition"
            >
              Tạo đơn mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
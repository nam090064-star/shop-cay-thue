"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Thay STK thật của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Thay tên thật của bạn

  const categories = [
    "Tất cả",
    "CÀY LEVEL",
    "CÀY ITEM",
    "CÀY BELI & ĐIỂM F",
    "RACE V4",
    "DRACO RACE",
    "LEVIATHAN",
  ];

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

  // Lọc dịch vụ theo danh mục được chọn
  const filteredServices = services.filter((s) => {
    if (selectedCategory === "Tất cả") return true;
    return s.title.includes(`[${selectedCategory}]`);
  });

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const list = services.filter((s) =>
      cat === "Tất cả" ? true : s.title.includes(`[${cat}]`)
    );
    if (list.length > 0) setSelectedService(list[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !accountInfo || !selectedService) return;

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

    if (error) alert("Lỗi: " + error.message);
    else setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-amber-500 tracking-wide uppercase">
          NGUYỄN THẮNG - SHOP CÀY THUÊ
        </h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                Tên / Zalo liên hệ:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A (Zalo: 0912...)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                Tài khoản / Mật khẩu Game:
              </label>
              <textarea
                placeholder="TK: tk_game123&#10;MK: matkhau123"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-24"
                required
              />
            </div>

            {/* DANH MỤC */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                1. Chọn loại dịch vụ:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* GÓI CHI TIẾT */}
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                2. Chọn gói chi tiết:
              </label>
              {filteredServices.length === 0 ? (
                <p className="text-amber-400 text-sm italic">
                  Chưa có gói nào trong mục này...
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
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                >
                  {filteredServices.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title.replace(/\[.*?\]\s*/, "")} —{" "}
                      {Number(item.price).toLocaleString("vi-VN")} VNĐ
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || filteredServices.length === 0}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg mt-4"
            >
              {loading ? "Đang xử lý..." : "XÁC NHẬN TẠO ĐƠN THANH TOÁN"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-green-400">Tạo Đơn Thành Công!</h2>
            <p className="text-sm text-slate-300">Quét mã QR để chuyển khoản:</p>
            {selectedService && (
              <img
                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${selectedService.price}&addInfo=CT%20${customerName}`}
                alt="Mã QR"
                className="w-full border-2 border-amber-500 rounded-xl p-2 bg-white"
              />
            )}
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-slate-800 font-bold py-2.5 rounded-xl text-sm"
            >
              Tạo đơn mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
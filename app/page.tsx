"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Thông tin ngân hàng của bạn
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Thay STK của bạn
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Thay tên của bạn

  // 1. Lấy danh sách dịch vụ từ Supabase
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

  // 2. Lọc danh sách dịch vụ theo Danh mục được chọn
  const filteredServices = services.filter((s) => {
    if (selectedCategory === "Tất cả") return true;
    return s.title.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // 3. Xử lý khi đổi Danh mục
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const firstMatch = services.find((s) =>
      category === "Tất cả" ? true : s.title.toLowerCase().includes(category.toLowerCase())
    );
    if (firstMatch) setSelectedService(firstMatch);
  };

  // 4. Xử lý tạo đơn hàng
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

  // Các nút Danh mục
  const categories = [
    "Tất cả",
    "Level",
    "Item",
    "Beli",
    "Race V4",
    "Draco",
    "Leviathan",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-amber-500 tracking-wide uppercase">
          KURORYU - SHOP CÀY THUÊ
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
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                Tài khoản / Mật khẩu Game:
              </label>
              <textarea
                placeholder="TK: tk_game123&#10;MK: matkhau123&#10;Server/Mã bảo mật (nếu có)"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 h-24 transition"
                required
              />
            </div>

            {/* BỘ LỌC DANH MỤC DỊCH VỤ */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">
                1. Chọn loại dịch vụ:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
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

              {/* CHỌN GÓI CỤ THỂ */}
              <label className="block text-sm font-semibold mb-1 text-slate-300">
                2. Chọn gói chi tiết:
              </label>
              {filteredServices.length === 0 ? (
                <p className="text-amber-400 text-sm italic">
                  Chưa có gói dịch vụ nào trong mục này...
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
                  {filteredServices.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {Number(item.price).toLocaleString("vi-VN")} VNĐ
                    </option>
                  ))}
                </select>
              )}
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
              Quét mã QR để chuyển khoản trực tiếp:
            </p>
            {selectedService && (
              <img
                src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${selectedService.price}&addInfo=CT%20${customerName}`}
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
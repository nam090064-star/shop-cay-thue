"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import NoticeModal from "./components/NoticeModal";

// DỮ LIỆU CÁC MỤC DỊCH VỤ / TÀI KHOẢN
const CATEGORIES = [
  {
    id: "cay-thue",
    title: "CÀY THUÊ BLOX-FRUITS",
    badge: "Sẵn Sàng",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ045TU5JEnlwnzDggyWoifSvWmta1W1xqG03t-4j5Zw&s=10",
    items: [
      { id: "ct-1", name: "Kéo Tim Levi Về Hydra", price: 35000 },
      { id: "ct-2", name: "Kéo Tim Levi Về Tiki", price: 30000 },
      { id: "ct-3", name: "Lấy Tộc Rồng (Bonus V3)", price: 30000 },
      { id: "ct-4", name: "Cày Trứng Rồng 1 Quả", price: 10000 },
      { id: "ct-5", name: "Lấy Kiếm Rồng", price: 35000 },
      { id: "ct-6", name: "Lấy Súng Rồng", price: 40000 },
      { id: "ct-7", name: "Up Full Gear V4 Tộc Đang Dùng", price: 35000 },
    ],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedItem, setSelectedItem] = useState(CATEGORIES[0].items[0]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("orders").insert([
      {
        category: selectedCategory.title,
        item_name: selectedItem.name,
        price: selectedItem.price,
        username,
        password,
        note,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("❌ Đã có lỗi xảy ra, vui lòng thử lại!");
    } else {
      setMessage("✅ Đặt hàng thành công! Shop sẽ liên hệ với bạn sớm nhất.");
      setUsername("");
      setPassword("");
      setNote("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {/* THÔNG BÁO POPUP */}
      <NoticeModal />

      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">
            SHOP ROBLOX GIÁ RẺ
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Dịch vụ Cày Thuê Blox Fruits Uy Tín & Nhanh Chóng
          </p>
        </header>

        {/* GIAO DIỆN CHỌN DỊCH VỤ VÀ ĐẶT HÀNG */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-800 pb-3">
            1. Chọn Dịch Vụ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategory.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-xl border text-left transition flex justify-between items-center ${
                  selectedItem.id === item.id
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 font-bold"
                    : "border-gray-800 bg-gray-800/50 text-gray-300 hover:border-gray-700"
                }`}
              >
                <span>{item.name}</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {item.price.toLocaleString("vi-VN")} đ
                </span>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-800 pb-3 pt-4">
            2. Thông Tin Tài Khoản
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tên tài khoản Roblox
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Nhập username Roblox"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mật khẩu Roblox
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400"
                placeholder="Nhập mật khẩu Roblox"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Ghi chú thêm (nếu có)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-400 h-24"
                placeholder="Mã PIN 2FA, lưu ý đặc biệt..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-400/20 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : `Thanh Toán ${selectedItem.price.toLocaleString("vi-VN")} đ`}
            </button>

            {message && (
              <p className="text-center font-medium mt-2">{message}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tự động mở thông báo khi khách vào trang web
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Nút Đóng */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold px-2 py-1 rounded-lg hover:bg-gray-800 transition"
        >
          ✕
        </button>

        {/* Tiêu đề thông báo */}
        <div className="flex items-center gap-2 mb-3 text-yellow-400 text-xl font-bold">
          <span>📢</span>
          <h2>THÔNG BÁO SHOP</h2>
        </div>

        {/* Nội dung thông báo */}
        <div className="text-gray-300 text-sm leading-relaxed space-y-2 mb-6">
          <p>Chào mừng bạn đã đến với <strong>Shop Roblox Giá Rẻ</strong>! 🎉</p>
          <p>🔥 <strong>Khuyến mãi đặc biệt:</strong> Giảm giá 10% dịch vụ Cày Thuê Blox Fruits tuần này!</p>
          <p>⏱️ Thời gian xử lý đơn hàng: Từ 15 - 30 phút sau khi đặt hàng.</p>
          <p className="text-xs text-yellow-500 font-medium">Chúc các bạn mua sắm vui vẻ!</p>
        </div>

        {/* Nút Xã Nhận / Hiểu Rồi */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition shadow-lg shadow-yellow-500/20"
        >
          Đã hiểu, vào shop ngay!
        </button>
      </div>
    </div>
  );
}
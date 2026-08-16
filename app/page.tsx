"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// KHO DỊCH VỤ CHUẨN (4 MỤC THEO YÊU CẦU)
const SERVICES_DATA = [
  {
    id: "cay-thue",
    name: "Cày Thuê Blox Fruits",
    badge: "🔥 HOT",
    description: "Cày Level, Beli, Fragment & Melee siêu tốc, an toàn 100%.",
    items: [
      { id: "ct-1", name: "Cày Level 1 - 2550 (Max Level)", price: 50000 },
      { id: "ct-2", name: "Farm 10.000.000 Beli", price: 30000 },
      { id: "ct-3", name: "Farm 50.000 Fragments", price: 40000 },
      { id: "ct-4", name: "Săn Melee Godhuman", price: 120000 },
      { id: "ct-5", name: "Săn Cursed Dual Katana (CDK)", price: 100000 },
    ],
  },
  {
    id: "acc-v4",
    name: "Acc Blox Fruits V4",
    badge: "⚡ VIP",
    description: "Tài khoản có sẵn Tộc V4, Godhuman, Kiếm Cổ Đại và nhiều vật phẩm quý.",
    items: [
      { id: "acc-1", name: "Acc Max Level + Tộc V4 (Ngẫu nhiên)", price: 150000 },
      { id: "acc-2", name: "Acc Max Level + Full Gear V4 (Tự chọn Tộc)", price: 250000 },
      { id: "acc-3", name: "Acc VIP + CDK + Godhuman + Trái Ác Quỷ Xịn", price: 350000 },
    ],
  },
  {
    id: "combo-draco",
    name: "Combo Draco",
    badge: "🎁 SIÊU ƯU ĐÃI",
    description: "Gói trọn gói đặc biệt dành cho Game thủ Blox Fruits với mức giá tiết kiệm.",
    items: [
      { id: "draco-1", name: "Combo Draco Tân Thủ: Level 1500 + Tam Kiếm + 5M Beli", price: 99000 },
      { id: "draco-2", name: "Combo Draco Bá Vương: Max Level + Tộc V4 + CDK + 10M Beli", price: 180000 },
      { id: "draco-3", name: "Combo Draco Thượng Thừa: Max Level + Full Gear V4 + Godhuman + CDK", price: 299000 },
    ],
  },
  {
    id: "race-v4-thuong",
    name: "Full Race V4 Thường",
    badge: "👑 UY TÍN",
    description: "Dịch vụ làm trọn gói Tộc V4 Thường (Thỏ, Vượn, Cá, Thiên Thần...).",
    items: [
      { id: "v4-1", name: "Mở Khóa Tộc V4 (Chưa Gear)", price: 80000 },
      { id: "v4-2", name: "Up Full Gear Tộc V4 Thường (1 Tộc)", price: 150000 },
      { id: "v4-3", name: "Trọn Gói Cần Mạt Thế + Up Full Gear V4", price: 220000 },
    ],
  },
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("cay-thue");
  const [selectedItemId, setSelectedItemId] = useState<string>("ct-1");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lấy mục danh mục hiện tại
  const currentCategoryData =
    SERVICES_DATA.find((cat) => cat.id === activeCategory) || SERVICES_DATA[0];

  // Lấy tất cả vật phẩm để tính toán dịch vụ được chọn
  const allItems = SERVICES_DATA.flatMap((cat) => cat.items);
  const selectedItem =
    allItems.find((item) => item.id === selectedItemId) || currentCategoryData.items[0];

  return (
    <main className="min-h-screen bg-emerald-950 text-emerald-50 pb-16 font-sans">
      {/* HEADER NAVBAR MÀU XANH LÁ TỐI */}
      <header className="border-b border-emerald-800/60 bg-emerald-900/80 backdrop-blur sticky top-0 z-50 px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐉</span>
            <h1 className="text-xl font-black text-emerald-400 tracking-wider uppercase">
              SHOP CÀY THUÊ DRACO
            </h1>
          </div>
          <div>
            {session ? (
              <span className="text-xs text-emerald-300 font-bold bg-emerald-800/80 px-3 py-1.5 rounded-full border border-emerald-600">
                {session.user.email}
              </span>
            ) : (
              <span className="text-xs text-emerald-300/70 bg-emerald-900/50 px-3 py-1.5 rounded-full border border-emerald-800">
                Chưa đăng nhập
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {/* THANH CHỌN 4 MỤC DỊCH VỤ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SERVICES_DATA.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedItemId(cat.items[0].id);
                }}
                className={`p-4 rounded-xl font-bold transition-all text-left flex flex-col justify-between border shadow-lg ${
                  isActive
                    ? "bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400 scale-[1.02]"
                    : "bg-emerald-900/60 border-emerald-800/80 text-emerald-200 hover:bg-emerald-900 hover:border-emerald-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-700/50">
                    {cat.badge}
                  </span>
                </div>
                <div className="text-base font-extrabold">{cat.name}</div>
              </button>
            );
          })}
        </div>

        {/* CHI TIẾT DANH MỤC ĐANG CHỌN */}
        <div className="bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-6 shadow-xl mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-emerald-300 uppercase tracking-wide flex items-center gap-2">
              {currentCategoryData.name}
            </h2>
            <p className="text-sm text-emerald-200/80 mt-1">
              {currentCategoryData.description}
            </p>
          </div>

          {/* DANH SÁCH GÓI DỊCH VỤ CON */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentCategoryData.items.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-800/90 border-emerald-400 text-white ring-2 ring-emerald-400/80 shadow-emerald-900/50 shadow-lg"
                      : "bg-emerald-950/70 border-emerald-800/80 text-emerald-100 hover:border-emerald-600 hover:bg-emerald-900/50"
                  }`}
                >
                  <div className="font-bold text-sm mb-3 leading-snug">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-emerald-800/60 mt-auto">
                    <span className="text-lg font-black text-emerald-400">
                      {item.price.toLocaleString()} VNĐ
                    </span>
                    <input
                      type="radio"
                      name="service_item"
                      checked={isSelected}
                      onChange={() => setSelectedItemId(item.id)}
                      className="accent-emerald-400 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KHU VỰC THANH TOÁN / ĐẶT HÀNG */}
        <div className="max-w-xl mx-auto">
          <div className="bg-emerald-900/90 border-2 border-emerald-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur">
            <h3 className="text-lg font-bold text-emerald-100 mb-4 flex items-center gap-2">
              🛒 ĐÃ CHỌN: <span className="text-emerald-400">{selectedItem?.name}</span>
            </h3>
            <div className="flex justify-between items-center bg-emerald-950 p-4 rounded-xl mb-5 border border-emerald-800">
              <span className="text-sm text-emerald-300/80">Tổng thanh toán:</span>
              <span className="text-2xl font-black text-emerald-400">
                {selectedItem?.price.toLocaleString()} VNĐ
              </span>
            </div>
            <button
              onClick={() => alert(`Đã ghi nhận đơn hàng: ${selectedItem?.name}`)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-lg rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wider"
            >
              XÁC NHẬN ĐẶT HÀNG NGAY
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
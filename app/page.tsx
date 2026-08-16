"use client";

import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// 1. KHO GÓI CÀY THUÊ LẺ
const CAY_THUE_SERVICES = [
  { id: "1", name: "Cày Level 1 - 2550 (Max Level)", price: 50000 },
  { id: "2", name: "Lấy Tộc V4 (Full Gear)", price: 150000 },
  { id: "3", name: "Săn Cursed Dual Katana (CDK)", price: 100000 },
  { id: "4", name: "Săn Melee Godhuman", price: 120000 },
  { id: "5", name: "Farm 10.000.000 Beli", price: 30000 },
];

// 2. KHO GÓI COMBO CÀY THUÊ
const COMBO_CAY_THUE_SERVICES = [
  {
    id: "combo-1",
    name: "Combo Bá Vương Blox Fruit",
    originalPrice: 250000,
    comboPrice: 180000,
    discount: "30%",
    items: [
      "Cày Max Level (2550)",
      "Lấy Tộc V4 Full Gear",
      "Farm 10.000.000 Beli",
      "Sở hữu Kiếm Cổ Đại"
    ],
    badge: "🔥 HOT NEST",
  },
  {
    id: "combo-2",
    name: "Combo Tân Thủ Siêu Cấp",
    originalPrice: 150000,
    comboPrice: 99000,
    discount: "34%",
    items: [
      "Level 1 -> 1500 (Sea 3)",
      "Mocha / Tam Kiếm",
      "Farm 5.000.000 Beli",
      "Tặng kèm 1 Trái Ác Quỷ Random"
    ],
    badge: "⚡ TIẾT KIỆM",
  },
];

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("1");

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

  // Gộp cả gói lẻ và gói combo lại để tìm kiếm theo id khi chọn dịch vụ
  const allServices = [
    ...CAY_THUE_SERVICES.map((s) => ({ ...s, isCombo: false })),
    ...COMBO_CAY_THUE_SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.comboPrice,
      isCombo: true,
    })),
  ];

  const selectedService = allServices.find((s) => s.id === selectedServiceId) || allServices[0];

  return (
    <main className="min-h-screen bg-slate-900 text-white pb-12">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black text-amber-500 tracking-wider">
            SHOP CÀY THUÊ
          </h1>
          <div>
            {session ? (
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {session.user.email}
              </span>
            ) : (
              <span className="text-xs text-slate-400">Chưa đăng nhập</span>
            )}
          </div>
        </div>
      </header>

      {/* SECTION 1: GÓI COMBO CÀY THUÊ SIÊU ƯU ĐÃI */}
      <div className="my-8 max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎁</span>
          <div>
            <h2 className="text-xl font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
              COMBO CÀY THUÊ SIÊU ƯU ĐÃI
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse font-bold">
                Tiết kiệm đến 35%
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Đặt cày trọn gói dịch vụ với giá rẻ hơn nhiều so với đặt lẻ từng phần!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMBO_CAY_THUE_SERVICES.map((combo) => (
            <div
              key={combo.id}
              className="relative bg-slate-800/80 border-2 border-amber-500/50 hover:border-amber-400 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-red-500 to-amber-500 text-white font-black text-xs px-3 py-1 rounded-bl-xl shadow">
                {combo.badge} - GIẢM {combo.discount}
              </div>

              <div>
                <h3 className="text-lg font-bold text-amber-400 pr-16 mb-2">
                  {combo.name}
                </h3>

                <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 mb-4 space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 mb-1">
                    Gói bao gồm các dịch vụ:
                  </div>
                  {combo.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between mt-auto">
                <div>
                  <div className="text-xs text-slate-400 line-through font-semibold">
                    Giá gốc: {combo.originalPrice.toLocaleString()}đ
                  </div>
                  <div className="text-xl font-black text-emerald-400 flex items-baseline gap-1">
                    {combo.comboPrice.toLocaleString()}
                    <span className="text-xs font-bold">VNĐ</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedServiceId(combo.id)}
                  className={`font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all ${
                    selectedServiceId === combo.id
                      ? "bg-emerald-500 text-white ring-2 ring-emerald-400"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  }`}
                >
                  {selectedServiceId === combo.id ? "Đã chọn gói" : "🚀 Chọn Combo"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: DỊCH VỤ CÀY LẺ */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
          <span>⚡</span> DỊCH VỤ CÀY LẺ TÙY CHỌN
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CAY_THUE_SERVICES.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedServiceId === service.id
                  ? "bg-amber-500/10 border-amber-500 text-amber-300"
                  : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              <div>
                <div className="font-bold text-sm">{service.name}</div>
                <div className="text-xs text-emerald-400 font-extrabold mt-1">
                  {service.price.toLocaleString()} VNĐ
                </div>
              </div>
              <input
                type="radio"
                name="service"
                checked={selectedServiceId === service.id}
                onChange={() => setSelectedServiceId(service.id)}
                className="accent-amber-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: KHU VỰC ĐẶT HÀNG */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            🛒 ĐÃ CHỌN: <span className="text-amber-400">{selectedService?.name}</span>
          </h3>
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl mb-4">
            <span className="text-sm text-slate-400">Tổng thanh toán:</span>
            <span className="text-2xl font-black text-emerald-400">
              {selectedService?.price.toLocaleString()} VNĐ
            </span>
          </div>
          <button
            onClick={() => alert(`Đã gửi đơn hàng: ${selectedService?.name}`)}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl shadow-lg transition-all active:scale-95"
          >
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </div>
      </div>
    </main>
  );
}
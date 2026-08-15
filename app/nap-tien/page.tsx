"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Chỉnh lại đường dẫn nếu file supabase.ts ở chỗ khác

// ⚠️ THAY THÔNG TIN NGÂN HÀNG CỦA BẠN VÀO ĐÂY:
const BANK_CONFIG = {
  BANK_ID: "MB", // Tên viết tắt ngân hàng: MB, VCB, TCB, TPB, CTG... (MBBank là MB)
  ACCOUNT_NO: "07908024409999", // Số tài khoản ngân hàng của bạn
  ACCOUNT_NAME: "NGUYEN NGOC THANG", // Tên chủ tài khoản (viết hoa không dấu)
};

export default function NapTienPage() {
  const [amount, setAmount] = useState<number>(20000);
  const [transferCode, setTransferCode] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Tạo mã nạp ngẫu nhiên (VD: NAP8392)
    const randomCode = "NAP" + Math.floor(1000 + Math.random() * 9000);
    setTransferCode(randomCode);

    // Lấy thông tin người dùng hiện tại (Giả định lấy user id từ localStorage hoặc supabase session)
    const savedUserId = localStorage.getItem("user_id");
    if (savedUserId) setUserId(Number(savedUserId));
  }, []);

  // Link tạo QR code tự động từ vietqr.io (Hoàn toàn miễn phí)
  const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.BANK_ID}-${BANK_CONFIG.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${transferCode}&accountName=${encodeURIComponent(BANK_CONFIG.ACCOUNT_NAME)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center text-amber-400 mb-6 uppercase">
        Nạp Tiền Vào TÀI KHOẢN
      </h1>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        {/* Chọn số tiền nạp */}
        <div>
          <label className="text-xs text-slate-400 block mb-2 font-medium">
            1. Chọn hoặc nhập số tiền nạp (VNĐ):
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[10000, 20000, 50000, 100000, 200000, 500000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`py-2 text-xs font-bold rounded-lg border transition ${
                  amount === val
                    ? "bg-amber-500 border-amber-500 text-slate-950"
                    : "bg-slate-950 border-slate-700 text-slate-300 hover:border-amber-500"
                }`}
              >
                {val.toLocaleString()}đ
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-bold text-center text-sm p-2.5 rounded-lg outline-none focus:border-amber-500"
          />
        </div>

        {/* Mã QR Quét Tiền */}
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl">
          <img src={qrUrl} alt="Mã QR Chuyển Khoản" className="w-64 h-64 object-contain" />
          <p className="text-slate-900 font-bold text-xs mt-1">Quét mã bằng App Ngân Hàng / Momo</p>
        </div>

        {/* Thông tin chuyển khoản chi tiết */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Ngân hàng:</span>
            <span className="font-bold text-amber-400">{BANK_CONFIG.BANK_ID}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Số tài khoản:</span>
            <span className="font-bold text-white select-all">{BANK_CONFIG.ACCOUNT_NO}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Chủ tài khoản:</span>
            <span className="font-bold text-white">{BANK_CONFIG.ACCOUNT_NAME}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Nội dung nạp (BẮT BUỘC):</span>
            <span className="font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded select-all">
              {transferCode}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 text-center italic">
          ⚡ Hệ thống sẽ tự động cộng tiền sau 5 - 10 giây kể từ khi chuyển khoản thành công.
        </p>
      </div>
    </div>
  );
}
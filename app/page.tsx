"use client";
import { useState } from "react";

export default function Home() {
  const [customerName, setCustomerName] = useState("");
  const [accountInfo, setAccountInfo] = useState("");
  const [service, setService] = useState("Lv 1 - 50 (100.000đ)");
  const [amount, setAmount] = useState(100000);
  const [orderId, setOrderId] = useState("CT" + Math.floor(1000 + Math.random() * 9000));
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ⚠️ THAY THÔNG TIN THỰC TẾ CỦA BẠN VÀO ĐÂY
  const BANK_ID = "MB"; // Mã ngân hàng: MB, VCB, TCB, ICB, ACB...
  const ACCOUNT_NO = "0987654321"; // Số tài khoản ngân hàng
  const ACCOUNT_NAME = "NGUYEN VAN A"; // Tên chủ tài khoản (viết hoa không dấu)

  // Danh sách các gói cày thuê
  const packages = [
    { name: "Cày Level 1 - 50", price: 100000 },
    { name: "Cày Level 50 - 100", price: 250000 },
    { name: "Làm Nhiệm Vụ Hằng Ngày (1 Tuần)", price: 150000 },
    { name: "Săn Boss / Đồ Hiếm", price: 300000 },
  ];

  const handleSelectPackage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = packages.find((p) => p.name === e.target.value);
    if (selected) {
      setService(selected.name);
      setAmount(selected.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !accountInfo) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setIsSubmitted(true);
  };

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${orderId}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 space-y-6">
        <h1 className="text-2xl font-bold text-center text-amber-400 uppercase tracking-wide">
          Dịch Vụ Cày Thuê Game
        </h1>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên / Zalo của bạn:</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Nguyễn Văn A (Zalo: 0912...)"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-400 text-white"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tài khoản / Mật khẩu Game:</label>
              <textarea
                required
                placeholder="TK: tk_game123&#10;MK: matkhau123&#10;Server: Asia"
                rows={3}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-400 text-white"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Chọn gói cày thuê:</label>
              <select
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-amber-400 text-white"
                onChange={handleSelectPackage}
              >
                {packages.map((pkg, idx) => (
                  <option key={idx} value={pkg.name}>
                    {pkg.name} - {pkg.price.toLocaleString("vi-VN")} VNĐ
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg transition-colors"
              >
                Tạo Đơn & Thanh Toán ({amount.toLocaleString("vi-VN")} VNĐ)
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-slate-700 p-4 rounded-xl text-left text-sm space-y-1">
              <p><span className="text-gray-400">Mã đơn:</span> <strong className="text-amber-400">{orderId}</strong></p>
              <p><span className="text-gray-400">Khách hàng:</span> {customerName}</p>
              <p><span className="text-gray-400">Gói cày:</span> {service}</p>
              <p><span className="text-gray-400">Số tiền:</span> {amount.toLocaleString("vi-VN")} VNĐ</p>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block">
              <img src={qrUrl} alt="Mã VietQR" className="w-64 h-64 object-contain mx-auto" />
            </div>

            <p className="text-sm text-gray-300">
              Nội dung CK bắt buộc: <span className="font-bold text-amber-400">{orderId}</span>
            </p>

            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-gray-400 underline hover:text-white mt-2"
            >
              ← Quay lại chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
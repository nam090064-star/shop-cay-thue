"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách dịch vụ hiện tại
  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (!error && data) {
      setServices(data);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Hàm thêm dịch vụ mới
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert("Vui lòng nhập tên dịch vụ và giá tiền!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("services").insert([
      {
        title: title,
        price: Number(price),
        description: description,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Thêm dịch vụ thành công!");
      setTitle("");
      setPrice("");
      setDescription("");
      fetchServices();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-500">
          Quản Lý Dịch Vụ Cày Thuê
        </h1>

        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên dịch vụ:</label>
            <input
              type="text"
              placeholder="VD: Cày Level 1-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Giá tiền (VNĐ):</label>
            <input
              type="number"
              placeholder="VD: 50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả dịch vụ:</label>
            <textarea
              placeholder="VD: Hoàn thành trong ngày"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition"
          >
            {loading ? "Đang xử lý..." : "+ Thêm Dịch Vụ"}
          </button>
        </form>

        <h2 className="text-xl font-bold mt-10 mb-4">Danh Sách Dịch Vụ Hiện Có</h2>
        <div className="space-y-3">
          {services.length === 0 ? (
            <p className="text-slate-400 text-sm">Chưa có dịch vụ nào.</p>
          ) : (
            services.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-amber-400">{item.title}</h3>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
                <span className="font-bold text-green-400">
                  {Number(item.price).toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
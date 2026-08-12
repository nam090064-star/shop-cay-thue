"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CÀY LEVEL");
  const [services, setServices] = useState<any[]>([]);

  const categories = [
    "CÀY LEVEL",
    "CÀY ITEM",
    "CÀY BELI & ĐIỂM F",
    "RACE V4",
    "DRACO RACE",
    "LEVIATHAN",
  ];

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*");
    if (data) setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Vui lòng nhập tên và giá!");

    // Ghép tên danh mục vào tiêu đề hoặc lưu chuẩn
    const fullTitle = `[${category}] ${title}`;

    const { error } = await supabase.from("services").insert([
      { title: fullTitle, price: Number(price), description },
    ]);

    if (error) alert("Lỗi: " + error.message);
    else {
      alert("Thêm dịch vụ thành công!");
      setTitle("");
      setPrice("");
      setDescription("");
      fetchServices();
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa?")) {
      await supabase.from("services").delete().eq("id", id);
      fetchServices();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-amber-500 text-center">
        TRANG QUẢN LÝ DỊCH VỤ (ADMIN)
      </h1>

      <form onSubmit={handleAdd} className="bg-slate-900 p-6 rounded-xl space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold mb-1">Chọn Danh Mục:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Tên dịch vụ:</label>
          <input
            type="text"
            placeholder="Ví dụ: Level 1 - 700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Giá tiền (VNĐ):</label>
          <input
            type="number"
            placeholder="Ví dụ: 5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Mô tả:</label>
          <input
            type="text"
            placeholder="Ví dụ: Hoàn thành trong ngày"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 font-bold py-3 rounded-lg"
        >
          THÊM DỊCH VỤ
        </button>
      </form>

      <h2 className="text-lg font-bold mb-4">Danh Sách Dịch Vụ Hiện Có:</h2>
      <div className="space-y-2">
        {services.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 p-3 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-amber-400">{item.title}</p>
              <p className="text-sm text-slate-400">
                {Number(item.price).toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-500"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
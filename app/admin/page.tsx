"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [category, setCategory] = useState("CÀY BELI & ĐIỂM F");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("Hoàn Thành Đơn Trong Ngày");
  const [services, setServices] = useState<any[]>([]);

  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*").order("id", { ascending: false });
    if (!error && data) setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Hàm thêm dịch vụ
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Vui lòng nhập đầy đủ thông tin!");

    const { error } = await supabase.from("services").insert([
      {
        title: title,
        price: Number(price),
        description: description || "Hoàn Thành Đơn Trong Ngày",
      },
    ]);

    if (error) {
      alert("Lỗi thêm dịch vụ: " + error.message);
    } else {
      alert("Thêm dịch vụ thành công!");
      setTitle("");
      setPrice("");
      fetchServices();
    }
  };

  // Hàm xóa dịch vụ
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (!error) fetchServices();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center text-amber-400 mb-6 uppercase">
        Trang Quản Lý Dịch Vụ (Admin)
      </h1>

      {/* FORM THÊM DỊCH VỤ BAN ĐẦU */}
      <form onSubmit={handleAddService} className="space-y-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
        
        {/* Dòng 1: Chọn Danh Mục */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Chọn Danh Mục:</label>
          <select 
  value={category} 
  onChange={(e) => setCategory(e.target.value)}
  className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
>
  <option value="CÀY LEVEL">CÀY LEVEL</option>
  <option value="CÀY BELI & ĐIỂM F">CÀY BELI & ĐIỂM F</option>
  <option value="CÀY TỘC V4">CÀY TỘC V4</option>
  <option value="CÀY MASTERY">CÀY MASTERY</option>
  <option value="SĂN ITEM & RAIDS">SĂN ITEM & RAIDS</option>
</select>
        </div>

        {/* Dòng 2: Tên Dịch Vụ */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Tên dịch vụ:</label>
          <input 
            type="text" 
            required
            placeholder="Ví dụ: Level 1 - 700" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
          />
        </div>

        {/* Dòng 3: Giá Tiền */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Giá tiền (VND):</label>
          <input 
            type="number" 
            required
            placeholder="Ví dụ: 5000" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
          />
        </div>

        {/* Dòng 4: Mô tả */}
        <div>
          <label className="text-xs text-slate-400 block mb-1 font-medium">Mô tả:</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Hoàn thành trong ngày" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none focus:border-amber-500"
          />
        </div>

        {/* Nút Thêm Dịch Vụ */}
        <button 
          type="submit" 
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition uppercase tracking-wide"
        >
          THÊM DỊCH VỤ
        </button>
      </form>

      {/* DANH SÁCH DỊCH VỤ HIỆN CÓ */}
      <div className="mt-8 space-y-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase mb-3">Danh Sách Dịch Vụ Hiện Có:</h2>
        {services.map((item) => (
          <div key={item.id} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-white">{item.title || item.name}</p>
              <p className="text-amber-400 font-semibold">{item.price?.toLocaleString()} VND</p>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-2.5 py-1 rounded transition text-[10px]"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
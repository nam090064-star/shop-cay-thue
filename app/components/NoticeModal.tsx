"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<any>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setNotice(data);
        setIsOpen(true);
      }
    };

    fetchNotice();
  }, []);

  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-sky-100 relative overflow-hidden transition-all scale-[1.01]">
        
        {/* HỌA TIẾT TRANG TRÍ NỀN TONE SKY */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-100 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-100 rounded-full blur-2xl pointer-events-none" />

        {/* NÚT ĐÓNG (X) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 font-bold flex items-center justify-center transition-all z-10"
        >
          ✕
        </button>

        {/* HEADER THÔNG BÁO */}
        <div className="text-center mb-4 relative z-10">
          <div className="w-14 h-14 bg-sky-50 border border-sky-200 text-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-sm">
            📢
          </div>
          <h3 className="text-lg font-black text-sky-600 uppercase tracking-wide">
            {notice.title || "THÔNG BÁO TỪ HỆ THỐNG"}
          </h3>
        </div>

        {/* NỘI DUNG THÔNG BÁO */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 text-xs font-medium text-slate-700 leading-relaxed mb-6 max-h-[60vh] overflow-y-auto whitespace-pre-wrap relative z-10">
          {notice.content}
        </div>

        {/* NÚT XÁC NHẬN / ĐÓNG */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 bg-[#40c4ff] hover:bg-[#00b0ff] active:scale-[0.98] text-white font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider relative z-10"
        >
          ĐÃ HỂU & ĐÓNG
        </button>
      </div>
    </div>
  );
}
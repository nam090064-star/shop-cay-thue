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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      {/* KHUNG POPUP BO GÓC GIỐNG ẢNH */}
      <div className="bg-[#f8faff] rounded-[28px] max-w-sm w-full p-6 shadow-xl border border-sky-100/80 text-center relative animate-fadeIn">
        
        {/* TIÊU ĐỀ KÈM 2 CHUÔNG XANH */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sky-400 text-lg">🔔</span>
          <h3 className="text-base font-bold text-[#1e293b]">
            {notice.title || "Thông Báo Mới"}
          </h3>
          <span className="text-sky-400 text-lg">🔔</span>
        </div>

        {/* NỘI DUNG THÔNG BÁO CĂN GIỮA */}
        <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium px-2 whitespace-pre-wrap">
          {notice.content}
        </p>

        {/* NÚT OK NỔI BẬT */}
        <button
          onClick={() => setIsOpen(false)}
          className="px-8 py-2 bg-[#38bdf8] hover:bg-[#0284c7] active:scale-95 text-white font-black text-xs rounded-full border-2 border-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all uppercase tracking-wider"
        >
          OK
        </button>
      </div>
    </div>
  );
}
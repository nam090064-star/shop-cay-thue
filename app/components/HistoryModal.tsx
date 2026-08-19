'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [activeTab, setActiveTab] = useState<'acc' | 'caythue'>('acc');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassId, setShowPassId] = useState<number | null>(null); // Trạng thái ẩn/hiện MK bảo mật
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    // Nếu tab 'acc' thì lấy từ bảng 'orders', nếu 'caythue' thì lấy từ bảng cày thuê của bạn
    const tableName = activeTab === 'acc' ? 'orders' : 'cay_thue_orders';

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    } else {
      setOrders([]);
    }
    setLoading(false);
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full font-bold transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold text-center mb-5 text-gray-800 tracking-wide">
          📜 LỊCH SỬ GIAO DỊCH
        </h2>

        {/* METRO TAB - 2 TAB CHUYỂN ĐỔI TIỆN LỢI */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-5">
          <button
            onClick={() => setActiveTab('acc')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'acc'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🎮 Mua Tài Khoản
          </button>
          <button
            onClick={() => setActiveTab('caythue')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'caythue'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            ⚡ Dịch Vụ Cày Thuê
          </button>
        </div>

        {/* NỘI DUNG DANH SÁCH ĐƠN HÀNG */}
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm font-medium">
            Đang tải dữ liệu...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm font-medium">
            Bạn chưa có giao dịch nào ở mục này.
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {orders.map((item) => (
              <div 
                key={item.id} 
                className="bg-gray-50 hover:bg-gray-100/80 border border-gray-200/70 p-4 rounded-2xl transition"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-bold text-gray-800 text-sm">{item.service}</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{item.amount} VNĐ</span>
                </div>

                <div className="text-[11px] text-gray-400 mb-3 flex justify-between">
                  <span>Mã: <code className="font-mono text-gray-600">{item.order_id}</code></span>
                  <span>{new Date(item.created_at).toLocaleString('vi-VN')}</span>
                </div>

                {/* KHU VỰC BẢO MẬT HIỂN THỊ TK/MK CHO TAB MUA ACC */}
                {activeTab === 'acc' ? (
                  <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl text-xs font-mono flex items-center justify-between border border-slate-800">
                    <div className="truncate mr-2">
                      <span className="text-slate-400 select-none">Acc: </span>
                      <span className="text-emerald-400 font-semibold">
                        {showPassId === item.id 
                          ? (item.account_info || 'Đang cập nhật')
                          : (item.account_info ? '••••••••••••••••••••' : 'Đang cập nhật')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Nút Ẩn/Hiện mật khẩu */}
                      <button
                        onClick={() => setShowPassId(showPassId === item.id ? null : item.id)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                        title="Ẩn/Hiện Mật Khẩu"
                      >
                        {showPassId === item.id ? '👁️' : '🙈'}
                      </button>

                      {/* Nút Copy nhanh */}
                      {item.account_info && (
                        <button
                          onClick={() => handleCopy(item.account_info, item.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold transition"
                        >
                          {copiedId === item.id ? '✓ Đã Copy' : 'Copy'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TRẠNG THÁI CHO TAB CÀY THUÊ */
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200/60">
                    <span className="text-gray-500">Trạng thái xử lý:</span>
                    <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {item.status || 'Đang xử lý'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
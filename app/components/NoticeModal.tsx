'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NoticeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassId, setShowPassId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-extrabold text-center mb-4 text-gray-800">
          📜 LỊCH SỬ ĐẶT HÀNG
        </h2>

        {loading ? (
          <p className="text-center py-8 text-gray-400">Đang tải lịch sử...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-8 text-gray-400">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {orders.map((item) => (
              <div key={item.id} className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800 text-sm">{item.service}</span>
                  <span className="text-blue-600 font-extrabold text-sm">{item.amount} VNĐ</span>
                </div>

                <div className="text-[11px] text-gray-400 mb-2 flex justify-between">
                  <span>Mã: <code className="text-gray-600">{item.order_id}</code></span>
                  <span>{new Date(item.created_at).toLocaleString('vi-VN')}</span>
                </div>

                {item.account_info ? (
                  <div className="bg-slate-900 text-slate-100 p-2.5 rounded-xl text-xs font-mono flex items-center justify-between mt-2">
                    <div className="truncate mr-2">
                      <span className="text-slate-400">Acc: </span>
                      <span className="text-emerald-400 font-semibold">
                        {showPassId === item.id ? item.account_info : '••••••••••••••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setShowPassId(showPassId === item.id ? null : item.id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Ẩn/Hiện Mật Khẩu"
                      >
                        {showPassId === item.id ? '👁️' : '🙈'}
                      </button>
                      <button
                        onClick={() => handleCopy(item.account_info, item.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold"
                      >
                        {copiedId === item.id ? '✓ Đã Copy' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200 mt-2">
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
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
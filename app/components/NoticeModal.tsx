'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu thật từ Supabase mỗi khi mở Modal Lịch sử
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
      .order('created_at', { ascending: false }); // Đơn mới nhất xếp lên đầu

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl">
        {/* Nút đóng Modal */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-blue-600 flex items-center justify-center gap-2">
          📜 LỊCH SỬ ĐẶT HÀNG
        </h2>

        {loading ? (
          <p className="text-center py-6 text-gray-500">Đang tải lịch sử...</p>
        ) : orders.length === 0 ? (
          <p className="text-center py-6 text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {orders.map((item) => (
              <div key={item.id} className="bg-gray-50 border border-gray-200 p-3 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800">{item.service}</span>
                  <span className="text-blue-600 font-bold">{item.amount} VNĐ</span>
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {new Date(item.created_at).toLocaleString('vi-VN')} • {item.order_id}
                </div>

                {/* HIỂN THỊ THÔNG TIN TÀI KHOẢN | MẬT KHẨU GIAO CHO KHÁCH */}
                <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono flex justify-between items-center">
                  <span>TK|MK: <strong>{item.account_info || 'Đang xử lý'}</strong></span>
                  {item.account_info && (
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.account_info)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px]"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
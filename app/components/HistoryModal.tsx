'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
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
          💳 LỊCH SỬ NẠP TIỀN
        </h2>

        {loading ? (
          <p className="text-center py-8 text-gray-400">Đang tải lịch sử...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-400">Chưa có giao dịch nạp tiền nào.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {transactions.map((item) => (
              <div key={item.id} className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800 text-sm">Nạp tiền qua Ngân hàng</div>
                  <div className="text-[11px] text-gray-400">
                    Mã GD: <code className="text-gray-600">{item.code || item.id}</code> - {new Date(item.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-extrabold text-sm">+{Number(item.amount).toLocaleString('vi-VN')} VNĐ</span>
                  <div className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    {item.status || 'Thành công'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
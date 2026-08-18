"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

interface OrderHistoryItem {
  id: string;
  item_name: string;
  price: number;
  created_at: string;
  status: string;
}

interface DepositHistoryItem {
  id: string;
  amount: number;
  created_at: string;
  status: string;
}

export default function Dashboard() {
  // Khởi tạo Supabase Client với @supabase/ssr
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // States cho Modal Lịch sử
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyTab, setHistoryTab] = useState<"orders" | "deposits">("orders");
  const [ordersHistory, setOrdersHistory] = useState<OrderHistoryItem[]>([]);
  const [depositsHistory, setDepositsHistory] = useState<DepositHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // State xử lý Mua hàng
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Danh sách dịch vụ mẫu
  const services: ServiceItem[] = [
    { id: "srv_1", name: "Gói Premium 1 Tháng", price: 50000 },
    { id: "srv_2", name: "Gói VIP 3 Tháng", price: 120000 },
  ];

  // 1. Tải số dư người dùng
  const fetchUserBalance = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", userId)
        .single();

      if (error) throw error;
      if (data) setBalance(data.balance ?? 0);
    } catch (error) {
      console.error("Lỗi lấy số dư:", error);
    }
  };

  // 2. Lắng nghe trạng thái Auth (Đã fix đầy đủ type cho TypeScript)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserBalance(session.user.id);
        } else {
          setBalance(0);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // 3. Xử lý Mua hàng an toàn (Thông qua Supabase RPC)
  const handleOrder = async (item: ServiceItem) => {
    if (!session || !user) {
      alert("Vui lòng đăng nhập để thực hiện giao dịch.");
      return;
    }

    if (balance < item.price) {
      alert("Số dư không đủ để thực hiện giao dịch này.");
      return;
    }

    setPurchasingId(item.id);

    try {
      const { data, error } = await supabase.rpc("process_purchase", {
        p_item_id: item.id,
        p_item_name: item.name,
        p_price: item.price,
      });

      if (error) throw error;

      if (data?.success) {
        alert("Thanh toán thành công!");
        setBalance(data.new_balance);
      } else {
        alert(data?.message || "Thanh toán thất bại.");
      }
    } catch (err: any) {
      console.error("Lỗi giao dịch:", err);
      alert(err.message || "Đã xảy ra lỗi trong quá trình xử lý đơn hàng.");
    } finally {
      setPurchasingId(null);
    }
  };

  // 4. Lấy lịch sử giao dịch thực tế
  const fetchHistory = async (tab: "orders" | "deposits") => {
    if (!user) return;
    setLoadingHistory(true);

    try {
      if (tab === "orders") {
        const { data, error } = await supabase
          .from("orders")
          .select("id, item_name, price, created_at, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrdersHistory(data || []);
      } else {
        const { data, error } = await supabase
          .from("deposits")
          .select("id, amount, created_at, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setDepositsHistory(data || []);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openHistoryModal = (tab: "orders" | "deposits") => {
    setHistoryTab(tab);
    setIsHistoryOpen(true);
    fetchHistory(tab);
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header & Balance */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div>
          <h1 className="text-xl font-bold">Xin chào, {user?.email}</h1>
          <p className="text-gray-600">
            Số dư: <span className="font-semibold text-green-600">{balance.toLocaleString()} VNĐ</span>
          </p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => openHistoryModal("orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lịch sử mua hàng
          </button>
          <button
            onClick={() => openHistoryModal("deposits")}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Lịch sử nạp tiền
          </button>
        </div>
      </div>

      {/* Danh sách Dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">{service.name}</h3>
              <p className="text-sm text-gray-500">{service.price.toLocaleString()} VNĐ</p>
            </div>
            <button
              onClick={() => handleOrder(service)}
              disabled={purchasingId === service.id}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {purchasingId === service.id ? "Đang xử lý..." : "Mua ngay"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal Lịch sử */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setHistoryTab("orders");
                    fetchHistory("orders");
                  }}
                  className={`font-bold ${historyTab === "orders" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                  Đơn hàng
                </button>
                <button
                  onClick={() => {
                    setHistoryTab("deposits");
                    fetchHistory("deposits");
                  }}
                  className={`font-bold ${historyTab === "deposits" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                >
                  Nạp tiền
                </button>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {loadingHistory ? (
              <p className="text-center py-4">Đang tải lịch sử...</p>
            ) : historyTab === "orders" ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {ordersHistory.length === 0 ? (
                  <p className="text-gray-500 text-center">Chưa có đơn hàng nào.</p>
                ) : (
                  ordersHistory.map((item) => (
                    <li key={item.id} className="border-b pb-2 flex justify-between">
                      <div>
                        <p className="font-medium">{item.item_name}</p>
                        <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{item.price.toLocaleString()} VNĐ</p>
                        <span className="text-xs text-green-600">{item.status}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {depositsHistory.length === 0 ? (
                  <p className="text-gray-500 text-center">Chưa có lịch sử nạp tiền.</p>
                ) : (
                  depositsHistory.map((item) => (
                    <li key={item.id} className="border-b pb-2 flex justify-between">
                      <div>
                        <p className="font-medium">Nạp số dư</p>
                        <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">+{item.amount.toLocaleString()} VNĐ</p>
                        <span className="text-xs text-gray-500">{item.status}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Bảng giá niêm yết cố định trên Server
const PRICES: Record<string, number> = {
  "ct-1": 35000, "ct-2": 30000, "ct-3": 30000, "ct-4": 10000,
  "ct-5": 35000, "ct-6": 40000, "ct-7": 35000, "ct-8": 25000,
  "ct-9": 20000, "ct-10": 10000, "ct-11": 5000, "ct-12": 35000,
  "ct-13": 30000, "ct-14": 20000, "ct-15": 20000, "ct-16": 30000,
  "ct-17": 45000, "ct-18": 20000, "ct-19": 20000, "ct-20": 45000,
  "ct-21": 10000, "ct-22": 35000, "ct-23": 35000, "ct-24": 45000,
  "ct-25": 45000, "ct-26": 30000, "ct-27": 20000, "ct-28": 10000,
  "acc-1": 45000, "acc-2": 30000, "acc-3": 130000,
  "draco-1": 180000,
  "v4-1": 180000,
};

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { itemId, categoryTitle, itemName, username, password, twoFactor, note, userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Vui lòng đăng nhập!" }, { status: 401 });
    }

    // 1. Kiểm tra giá từ Server
    const realPrice = PRICES[itemId];
    if (realPrice === undefined) {
      return NextResponse.json({ success: false, message: "Gói dịch vụ không hợp lệ!" }, { status: 400 });
    }

    // 2. Lấy số dư từ Supabase
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("balance, email")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, message: "Không tìm thấy thông tin tài khoản!" }, { status: 404 });
    }

    if (profile.balance < realPrice) {
      return NextResponse.json({ success: false, message: "Số dư không đủ thanh toán!" }, { status: 400 });
    }

    // 3. Trừ tiền tài khoản
    const newBalance = profile.balance - realPrice;
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json({ success: false, message: "Cập nhật số dư thất bại!" }, { status: 500 });
    }

    // 4. Lưu lịch sử đơn hàng
    await supabaseAdmin.from("orders").insert([
      {
        user_id: userId,
        category: categoryTitle,
        item_name: itemName,
        price: realPrice,
        account_info: { username, password, twoFactor, note },
        status: "Đang xử lý",
        created_at: new Date().toISOString(),
      },
    ]);

    // 5. Gửi thông báo về Telegram Admin
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      const message = `🛒 **ĐƠN HÀNG MỚI NẠP**\n` +
        `👤 User: ${profile.email || userId}\n` +
        `📦 Loại: ${categoryTitle}\n` +
        `🎯 Gói: ${itemName}\n` +
        `💰 Giá: ${realPrice.toLocaleString()} VNĐ\n` +
        `🔑 TK: \`${username || "N/A"}\`\n` +
        `🔒 MK: \`${password || "N/A"}\`\n` +
        `🛡️ 2FA: \`${twoFactor || "N/A"}\`\n` +
        `📝 Ghi chú: ${note || "Không có"}`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }).catch(err => console.error("Lỗi gửi Telegram:", err));
    }

    return NextResponse.json({ success: true, newBalance });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, message: "Lỗi hệ thống Server!" }, { status: 500 });
  }
}
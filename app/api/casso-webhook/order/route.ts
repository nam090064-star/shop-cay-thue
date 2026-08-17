import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      categoryTitle,
      itemName,
      price,
      email,
      balance,
      username,
      password,
      twoFactor,
      note,
    } = body;

    // Lấy Token bảo mật từ Biến môi trường (Environment Variables)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID");
      return NextResponse.json(
        { error: "Cấu hình Server chưa sẵn sàng." },
        { status: 500 }
      );
    }

    // Soạn nội dung thông báo
    let message = `🛒 *ĐƠN HÀNG MỚI TỪ WEBSITE*\n\n`;
    message += `📌 *Danh mục:* ${categoryTitle}\n`;
    message += `📦 *Gói dịch vụ:* ${itemName}\n`;
    message += `💰 *Giá tiền:* ${Number(price).toLocaleString()} VNĐ\n`;
    message += `👤 *Khách hàng:* ${email}\n`;
    message += `💵 *Số dư còn lại:* ${Number(balance).toLocaleString()} VNĐ\n`;

    if (username || password) {
      message += `\n🔑 *THÔNG TIN TÀI KHOẢN:* \n`;
      message += `• *Tài khoản:* \`${username}\`\n`;
      message += `• *Mật khẩu:* \`${password}\`\n`;
      if (twoFactor) message += `• *2FA/Cookie:* \`${twoFactor}\`\n`;
      if (note) message += `• *Ghi chú:* ${note}\n`;
    }

    message += `\n⏰ *Thời gian:* ${new Date().toLocaleString("vi-VN")}`;

    // Gửi tin nhắn về Telegram từ Server
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Lỗi khi gửi tin nhắn Telegram");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lỗi xử lý đơn hàng:", error);
    return NextResponse.json(
      { error: "Không thể gửi thông báo đơn hàng." },
      { status: 500 }
    );
  }
}
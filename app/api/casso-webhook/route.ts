import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Phản hồi cho payOS khi kiểm tra/xác thực Webhook (Ping check)
    if (body.test || body.code === "00" && !body.data) {
      return NextResponse.json({ success: true, message: "Webhook active" }, { status: 200 });
    }

    // 2. Lấy dữ liệu giao dịch thật
    const data = body.data || body;
    const transactions = Array.isArray(data) ? data : [data];

    for (const transaction of transactions) {
      const description = transaction.description || "";
      const amount = Number(transaction.amount || 0);

      // Tìm mã nạp dạng NAPxxxx (ví dụ: NAP8392)
      const match = description.match(/NAP\d+/i);
      if (match) {
        const transferCode = match[0].toUpperCase();

        // Kiểm tra giao dịch trong cơ sở dữ liệu Supabase
        const { data: existingTx } = await supabase
          .from("transactions")
          .select("*")
          .eq("code", transferCode)
          .single();

        if (existingTx && existingTx.status === "pending") {
          // A. Đổi trạng thái giao dịch thành completed
          await supabase
            .from("transactions")
            .update({ status: "completed", amount: amount })
            .eq("code", transferCode);

          // B. Lấy số dư hiện tại của người dùng
          const { data: profile } = await supabase
            .from("profiles")
            .select("balance")
            .eq("id", existingTx.user_id)
            .single();

          const currentBalance = Number(profile?.balance || 0);
          const newBalance = currentBalance + amount;

          // C. Cộng tiền cho tài khoản
          await supabase
            .from("profiles")
            .update({ balance: newBalance })
            .eq("id", existingTx.user_id);
        }
      }
    }

    return NextResponse.json({ success: true, error: 0 }, { status: 200 });
  } catch (err: any) {
    // Trả về status 200 để payOS không báo lỗi Webhook
    return NextResponse.json({ success: true, message: err.message }, { status: 200 });
  }
}
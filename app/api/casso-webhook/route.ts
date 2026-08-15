import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Khởi tạo Supabase Client với Service Role hoặc Anon Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Đặt mã Secure Token của bạn tại đây (Để bảo mật, chống spam API)
const CASSO_SECURE_TOKEN = "ShopCayThueSecret123"; 

export async function POST(request: Request) {
  try {
    // 1. Kiểm tra Token bảo mật từ Casso gửi sang
    const authHeader = request.headers.get("Secure-Token");
    if (authHeader !== CASSO_SECURE_TOKEN) {
      return NextResponse.json({ error: 1, message: "Unauthorized Token" }, { status: 401 });
    }

    const body = await request.json();
    const data = body.data;

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({ error: 0, message: "No data" });
    }

    // 2. Lặp qua danh sách biến động số dư nhận được
    for (const transaction of data) {
      const description = transaction.description || "";
      const amount = Number(transaction.amount);

      // Tìm mã nạp tiền có định dạng NAPxxxx (ví dụ: NAP8392) trong nội dung chuyển khoản
      const match = description.match(/NAP\d+/i);
      if (match) {
        const transferCode = match[0].toUpperCase();

        // Kiểm tra xem mã nạp này đã tồn tại trong bảng transactions chưa
        const { data: existingTx } = await supabase
          .from("transactions")
          .select("*")
          .eq("code", transferCode)
          .single();

        if (existingTx && existingTx.status === "pending") {
          // A. Cập nhật trạng thái giao dịch thành completed
          await supabase
            .from("transactions")
            .update({ status: "completed", amount: amount })
            .eq("code", transferCode);

          // B. Lấy số dư hiện tại của khách
          const { data: profile } = await supabase
            .from("profiles")
            .select("balance")
            .eq("id", existingTx.user_id)
            .single();

          const currentBalance = Number(profile?.balance || 0);
          const newBalance = currentBalance + amount;

          // C. Cộng số dư mới cho khách
          await supabase
            .from("profiles")
            .update({ balance: newBalance })
            .eq("id", existingTx.user_id);
        }
      }
    }

    return NextResponse.json({ error: 0, message: "Success" });
  } catch (err: any) {
    return NextResponse.json({ error: 1, message: err.message }, { status: 500 });
  }
}
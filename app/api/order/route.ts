import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { customer_name, service, amount } = await request.json();

    // 1. TÌM 1 ACC CHƯA BÁN KHỚP VỚI GÓI DỊCH VỤ TRONG KHO
    const { data: acc } = await supabase
      .from('accounts')
      .select('*')
      .eq('service', service)
      .eq('status', 'available')
      .limit(1)
      .maybeSingle();

    if (!acc) {
      return NextResponse.json(
        { error: 'Gói dịch vụ này hiện đã HẾT HÀNG trong kho!' },
        { status: 400 }
      );
    }

    // 2. ĐÁNH DẤU ACC ĐÓ ĐÃ BÁN (status = 'sold')
    await supabase
      .from('accounts')
      .update({ status: 'sold' })
      .eq('id', acc.id);

    // 3. LƯU ĐƠN HÀNG VÀO LỊCH SỬ (BẢNG ORDERS)
    const orderId = 'ORD' + Date.now();

    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: orderId,
          customer_name: customer_name,
          service: service,
          amount: amount,
          account_info: acc.account_info, // Lưu tài khoản | mật khẩu vào lịch sử
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 4. TRẢ VỀ THÔNG BÁO CHO KHÁCH HÀNG
    return NextResponse.json({
      success: true,
      message: 'Mua hàng thành công!',
      account_info: acc.account_info,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
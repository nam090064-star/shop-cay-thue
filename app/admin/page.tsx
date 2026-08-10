'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [services, setServices] = useState<any[]>([])

  // Hàm tải danh sách dịch vụ hiện có
  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('id', { ascending: false })
    if (data) setServices(data)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Hàm thêm dịch vụ mới vào Supabase
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()

    const { error } = await supabase.from('services').insert([
      { title, price, description }
    ])

    if (error) {
      alert('Lỗi: ' + error.message)
    } else {
      alert('Thêm dịch vụ thành công!')
      setTitle('')
      setPrice('')
      setDescription('')
      fetchServices() // Tải lại danh sách ngay lập tức
    }
  }

  // Hàm xóa dịch vụ
  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      await supabase.from('services').delete().eq('id', id)
      fetchServices()
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 uppercase text-center">
          Quản Lý Dịch Vụ Cày Thuê
        </h1>

        {/* Form thêm dịch vụ mới */}
        <form onSubmit={handleAddService} className="flex flex-col gap-4 mb-8 bg-slate-700/50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-200">Thêm Dịch Vụ Mới</h2>
          
          <div>
            <label className="block text-sm mb-1 text-slate-300">Tên dịch vụ:</label>
            <input
              type="text"
              placeholder="Ví dụ: Cày Level 1 - 500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Giá tiền (VNĐ):</label>
            <input
              type="text"
              placeholder="Ví dụ: 100.000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Mô tả dịch vụ:</label>
            <input
              type="text"
              placeholder="Ví dụ: Hoàn thành trong 24h, kèm x2 Exp"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 text-white border border-slate-600 focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2.5 rounded transition"
          >
            + Thêm Dịch Vụ
          </button>
        </form>

        {/* Danh sách dịch vụ đã tạo */}
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Danh Sách Dịch Vụ Hiện Có</h2>
          {services.length === 0 ? (
            <p className="text-slate-400 text-sm">Chưa có dịch vụ nào.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {services.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-700 p-3 rounded border border-slate-600">
                  <div>
                    <p className="font-bold text-yellow-400">{item.title}</p>
                    <p className="text-sm text-slate-300">{item.price} VNĐ</p>
                    {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
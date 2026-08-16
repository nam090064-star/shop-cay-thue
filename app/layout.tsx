import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RobloxGiaRe.Com - Shop Blox Fruits Uy Tín",
  description: "Dịch vụ Cày Thuê, Bán Acc Blox Fruits Giá Rẻ",
  icons: {
    icon: "/logo.png.png", // 👈 Điền đường dẫn tới ảnh logo trong thư mục public
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

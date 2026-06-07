import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "黄叔 AI 编程学习路径",
  description: "基于课程排课表生成的 AI 编程教学网站",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}

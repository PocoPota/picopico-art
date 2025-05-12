import type { Metadata } from "next";
import "./globals.scss";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "ぴこぴこアート",
  description: "お絵かきアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

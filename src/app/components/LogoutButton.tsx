// components/LogoutButton.tsx (例)
"use client"; // App Router を使用している場合、クライアントコンポーネントであることを示す

import React from "react";
import { signOut } from "firebase/auth"; // signOut関数をインポート
import { auth } from "../lib/firebase"; // ステップ4で初期化したauthオブジェクトをインポート
import { useRouter } from "next/navigation"; // Next.js App Router の場合のリダイレクト用
// import { useRouter } from 'next/router'; // Next.js Pages Router の場合のリダイレクト用
import Button from "./Button";

const LogoutButton: React.FC = () => {
  const router = useRouter(); // リダイレクトを使う場合

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // ログアウト成功後の処理（例: ログインページにリダイレクト）
      console.log("ログアウト成功！");
      router.push("/"); // ログアウト後にログインページに遷移させる場合
    } catch (error: any) {
      console.error("ログアウトエラー:", error);
      // エラーメッセージをユーザーに表示するなどの処理
    }
  };

  return (
    <Button
      onClick={handleLogout}
      label="ログアウト"
      size="small"
    />
  );
};

export default LogoutButton;

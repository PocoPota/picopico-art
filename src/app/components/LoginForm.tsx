// components/LoginForm.tsx (例)
"use client"; // App Router を使用している場合、クライアントコンポーネントであることを示す

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // ログイン用の関数をインポート
import { auth } from "../lib/firebase"; // ステップ4で初期化したauthオブジェクトをインポート
import { useRouter } from "next/navigation";

import Button from "./Button";
import Input from "./Input";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    setError(null); // エラーをリセット

    try {
      // Firebase Authentication のログイン関数を呼び出す
      await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功した場合の処理（例: ホームページにリダイレクトなど）
      console.log("ログイン成功！");
      // useRouter などを使ってリダイレクト処理をここに記述
      router.push("/");
    } catch (error: any) {
      // エラーが発生した場合の処理
      console.error("ログインエラー:", error);
      // エラーコードに応じてメッセージを出し分けることも可能
      // if (error.code === 'auth/user-not-found') { ... }
      // if (error.code === 'auth/wrong-password') { ... }
      setError(error.message); // エラーメッセージを状態にセット
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <div>
          <Input
            label="メールアドレス"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="パスワード"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* エラー表示 */}
        <Button
          type="submit"
          label="ログイン"
          size="small"
        />
      </form>
      <p>
        <a href="/signup">新規アカウントの作成</a>
      </p>
    </div>
  );
};

export default LoginForm;

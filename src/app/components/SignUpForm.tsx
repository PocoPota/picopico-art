// components/SignUpForm.tsx (例)
"use client"; // App Router を使用している場合、クライアントコンポーネントであることを示す

import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebase"; // ステップ4で初期化したauthオブジェクトをインポート
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Input from "./Input";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    setError(null); // エラーをリセット

    try {
      // Firebase Authentication の新規登録関数を呼び出す
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          // DBにユーザーネームを登録
          const docRef = addDoc(collection(db, "users"), {
            uid: user.uid,
            userName: userName,
            comment: comment,
          });
        },
      );
      // 成功した場合の処理（例: ホームページにリダイレクトなど）
      console.log("新規登録成功！");
      // useRouter などを使ってリダイレクト処理をここに記述
      router.push("/");
    } catch (error: any) {
      // エラーが発生した場合の処理
      console.error("新規登録エラー:", error);
      setError(error.message); // エラーメッセージを状態にセット
    }
  };

  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handleSignUp}>
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
        <div>
          <Input
            label="ユーザー名"
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            label="自己紹介"
            as="textarea"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* エラー表示 */}
        <Button
          label="登録"
          type="submit"
          size="small"
        />
      </form>
    </div>
  );
};

export default SignUpForm;

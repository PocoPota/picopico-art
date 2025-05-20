"use client";

import { useState } from "react";

import Button from "./Button";
import Input from "./Input";

export default function MailAuth() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleMailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/send-link", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setSent(true);
    }
  };

  if (sent) {
    return <div>メールを送信しました。確認してください。</div>;
  }

  return (
    <div>
      <h2>メールアドレス認証</h2>
      <p>
        メールアドレスでユーザー登録します。入力したメールアドレスへ確認コードを送信します。
      </p>
      <form onSubmit={handleMailAuth}>
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
        <Button
          label="登録"
          type="submit"
          size="small"
        />
      </form>
    </div>
  );
}

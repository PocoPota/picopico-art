"use client";

import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import Button from "./Button";
import Input from "./Input";

export default function SignUpForm(props: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          const docRef = addDoc(collection(db, "users"), {
            uid: user.uid,
            userName: userName,
            comment: comment,
          });
        },
      );
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const mailAuthData = async () => {
      try {
        const docRef = doc(db, "mailauth", props.code);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setError("認証コードが存在しません");
          setProcessing(false);
          return;
        }

        const mailAuth = docSnap.data();

        // 有効期限チェック
        const isValid = Date.now() - mailAuth.createdAt < 60 * 60 * 1000;
        if (!isValid) {
          setError("認証コードは無効です");
          setProcessing(false);
          return;
        }

        setEmail(mailAuth.email);
        setProcessing(false);
      } catch (err) {
        setError("認証処理中にエラーが発生しました");
        setProcessing(false);
      }
    };

    if (props.code) {
      mailAuthData();
    } else {
      setError("認証コードが見つかりません");
      setProcessing(false);
    }
  }, [props.code]);

  if (processing) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h2>新規登録</h2>
      <form onSubmit={handleSignUp}>
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
}

"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

import styles from "./page.module.scss";
import LogoutButton from "../components/LogoutButton";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Settings() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  // userの値が変わった時に状態を更新
  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setComment(user.comment || "");
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setError("該当ユーザーは存在しません");
      } else {
        // 複数該当する場合も、最初の1件を更新
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { userName: userName, comment: comment });
        // リダイレクト
        router.push(`/user/${user.uid}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.settings}>
      <section>
        <h2>プロフィール</h2>
        <form onSubmit={handleUpdate}>
          <div>
            <Input
              label="ユーザー名"
              type="text"
              id="userName"
              value={userName ?? ""}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="自己紹介"
              as="textarea"
              id="comment"
              value={comment ?? ""}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* エラー表示 */}
          <Button
            label="更新"
            type="submit"
            size="small"
          />
        </form>
      </section>
      <section>
        <h2>アカウント</h2>
        <LogoutButton />
      </section>
    </div>
  );
}

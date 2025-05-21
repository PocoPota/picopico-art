"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function DeleteAccountButton() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleDelete = async () => {
    if (!user) return;

    try {
      const password = prompt("現在のパスワードを入力してください");
      if (!password) return;

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user.firebaseUser, credential);

      await user.firebaseUser.delete();

      // db(users)から関連データを削除
      const usersRef = collection(db, "users");
      const q1 = query(usersRef, where("uid", "==", user.uid));
      const snapshot1 = await getDocs(q1);

      const deletePromises1 = snapshot1.docs.map((document) =>
        deleteDoc(doc(db, "users", document.id)),
      );

      await Promise.all(deletePromises1);

      // db(drawings)から関連データを削除
      const drawingsRef = collection(db, "drawings");
      const q2 = query(drawingsRef, where("uid", "==", user.uid));
      const snapshot2 = await getDocs(q2);

      const deletePromises2 = snapshot2.docs.map((document) =>
        deleteDoc(doc(db, "drawings", document.id)),
      );

      await Promise.all(deletePromises2);


      console.log("アカウントを削除しました");

      router.push("/");
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        alert("再ログインが必要です");
      } else {
        console.error(error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Button
      onClick={handleDelete}
      label="アカウントを削除"
      size="small"
    />
  );
}

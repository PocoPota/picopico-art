"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import Button from "./Button";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error: any) {
      console.error(error);
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

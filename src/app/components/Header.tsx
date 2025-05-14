"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import Button from "./Button";

import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.header_inner}>
        <Link
          href="/"
          className={styles.logo}
        >
          <div className={styles.icon}>
            <Image
              src="/logo_rmbg.png"
              alt="ぴこぴこアート"
              fill
              style={{
                objectFit: "contain",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          ぴこぴこアート
        </Link>
        <div className={styles.account}>
          {user ? (
            <div>Hello {user.email}!</div>
          ) : (
            <Button
              label="ログイン"
              size="small"
              href="/login"
            />
          )}
        </div>
      </div>
    </header>
  );
}

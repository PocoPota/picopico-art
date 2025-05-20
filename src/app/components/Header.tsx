"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import Button from "./Button";
import Avatar from "boring-avatars";
import { GearSix } from "@phosphor-icons/react";

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
            <>
              <Link
                href="/settings"
                className={styles.settingBtn}
              >
                <GearSix
                  size={25}
                  fill="#808080"
                />
              </Link>
              <Link href={`/user/${user.uid}`}>
                <Avatar
                  name={user.uid}
                  variant="beam"
                  size={40}
                  colors={["#8fc6fe", "#fe8fc6", "#c6fe8f"]}
                />
              </Link>
            </>
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

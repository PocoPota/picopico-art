"use client";

import styles from "./page.module.scss";
import Avatar from "boring-avatars";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Button from "@/app/components/Button";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function User({ params }: PageProps) {
  const { user, loading } = useAuth();
  const unwrappedParams = React.use(params); // 👈 unwrap Promise
  const { slug } = unwrappedParams;
  const [userDoc, setUserDoc] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  // データの取得
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setUserDoc(docData);
        } else {
          console.warn("ユーザー情報がFirestoreに存在しません");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    if (!loading) {
      fetchUserData();
    }
  }, [user, loading]);

  if (loading || fetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.user}>
      <div className={styles.profile}>
        <div className={styles.p_user}>
          <div className={styles.p_left}>
            <Avatar
              name={slug}
              variant="beam"
              size={70}
            />
          </div>
          <div className={styles.p_right}>
            <div className={styles.username}>{userDoc.userName}</div>
            <div className={styles.comment}>{userDoc.comment}</div>
          </div>
        </div>
        {user && (
          <div className={styles.edit}>
            <Button
              label="Edit Profile"
              size="small"
              href="/settings"
            />
          </div>
        )}
      </div>
      <div className={styles.gallary}></div>
    </div>
  );
}

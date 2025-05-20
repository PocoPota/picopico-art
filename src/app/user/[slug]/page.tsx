"use client";

import styles from "./page.module.scss";
import Avatar from "boring-avatars";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import Image from "next/image";

import { db } from "../../lib/firebase";
import Button from "@/app/components/Button";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Item = {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lines: Array<any>;
  uid: string;
  image_url: string;
};

export default function User({ params }: PageProps) {
  const { user, loading } = useAuth();
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  const [userDoc, setUserDoc] = useState<any>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [fetching, setFetching] = useState(true);

  // データの取得
  useEffect(() => {
    // ユーザーデータの取得
    const fetchDatas = async () => {
      try {
        // ユーザーデータを取得
        const usersRef = collection(db, "users");
        const q1 = query(usersRef, where("uid", "==", slug));
        const querySnapshot1 = await getDocs(q1);
        if (!querySnapshot1.empty) {
          const docData = querySnapshot1.docs[0].data();
          setUserDoc(docData);
        } else {
          console.warn("ユーザー情報がFirestoreに存在しません");
        }

        // お絵かきデータを取得
        const q2 = query(
          collection(db, "drawings"),
          where("uid", "==", slug),
          orderBy("updatedAt", "desc"),
        );
        const querySnapshot2 = await getDocs(q2);

        const itemsList: Item[] = querySnapshot2.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Item, "id">),
        }));
        setItems(itemsList);
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };

    if (!loading) {
      fetchDatas();
    }
  }, [slug, loading]);

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
      <div className={styles.gallary}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/?did=${item.id}`}>
                <Image
                  src={item.image_url}
                  width={250}
                  height={250 * (400 / 780)}
                  alt="お絵かき作品"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

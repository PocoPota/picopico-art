"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";

import Drawing from "../components/Drawing";
import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./Top.module.scss";

export default function Top() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const did = searchParams.get("did");

  const [fetching, setFetching] = useState(true);
  const [lines, setLines] = useState<null | any[]>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isStage, setIsStage] = useState(true);

  useEffect(() => {
    const fetchDrawing = async () => {
      console.log(user);
      try {
        if (did) {
          // userがnullでないことを確認
          const docRef = doc(db, "drawings", did);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // 本人チェック
            setLines(docSnap.data().lines);
            if (user) {
              if (docSnap.data().uid !== user.uid) {
                setIsStage(false);
                setImageUrl(docSnap.data().image_url);
              }
            } else {
              setIsStage(false);
              setImageUrl(docSnap.data().image_url);
            }
          } else {
            setLines([]);
          }
        }
      } catch (error) {
        console.error(error);
        setLines([]);
      } finally {
        setFetching(false);
      }
    };

    if (did) {
      fetchDrawing();
    } else {
      setFetching(false);
    }
  }, [did, user, loading]);

  if (loading || fetching) {
    return <div>Loading...</div>;
  }

  if (isStage) {
    return <Drawing lines_preset={lines ?? []} />;
  } else {
    return (
      <div className={styles.garally}>
        <Image
          src={imageUrl}
          width={780}
          height={400}
          alt="お絵かき作品"
        />
      </div>
    );
  }
}

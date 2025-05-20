"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";

import Drawing from "../components/Drawing";
import { useEffect, useState } from "react";

export default function Top() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const did = searchParams.get("did");

  const [fetching, setFetching] = useState(true);
  const [lines, setLines] = useState<null | any[]>(null);

  useEffect(() => {
    const fetchDrawing = async () => {
      try {
        if (did) {
          const docRef = doc(db, "drawings", did);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setLines(docSnap.data().lines);
          } else {
            setLines([]);
          }
        } else {
          setLines([]);
        }
      } catch (error) {
        console.error(error);
        setLines([]);
      } finally {
        setFetching(false);
      }
    };

    fetchDrawing();
  }, [did]);

  if (loading || fetching) {
    return <div>Loading...</div>;
  }

  return <Drawing lines_preset={lines ?? []} />;
}

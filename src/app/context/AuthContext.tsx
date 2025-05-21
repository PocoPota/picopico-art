"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { User } from "firebase/auth";

// コンテキストの型を定義
interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
}

interface ExtendedUser {
  firebaseUser: User;
  uid: string;
  email: string | null;
  // Firestore 上の追加情報
  userName: string | null;
  comment: string | null;
}

// AuthContextを作成（デフォルト値は仮のもの）
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// AuthProviderコンポーネント：アプリをラップして認証状態を提供する
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true); // 初期状態は認証状態を確認中

  useEffect(() => {
    // Firebaseの認証状態の変化を監視するリスナーを設定
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", firebaseUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data(); // 一番最初の一致ドキュメントを取得
          setUser({
            firebaseUser: firebaseUser,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            userName: docData.userName ?? null,
            comment: docData.comment,
          });
        } else {
          console.warn("ユーザー情報がFirestoreに存在しません");
          setUser({
            firebaseUser: firebaseUser,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            userName: null,
            comment: null,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // 確認が完了したのでloadingをfalseにする
    });

    // コンポーネントがアンマウントされるときにリスナーを解除する
    return () => unsubscribe();
  }, []); // 依存配列が空なので、コンポーネントのマウント時に一度だけ実行される

  // コンテキストプロバイダーで子コンポーネントをラップし、stateを提供する
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック：どこからでも認証状態にアクセスできるようにする
export const useAuth = () => useContext(AuthContext);

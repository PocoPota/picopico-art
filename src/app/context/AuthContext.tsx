// context/AuthContext.tsx (例)
"use client"; // App Router を使用している場合、クライアントコンポーネントであることを示す

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth"; // FirebaseのUser型をインポート
import { auth } from "../lib/firebase"; // ステップ4で初期化したauthオブジェクトをインポート

// コンテキストの型を定義
interface AuthContextType {
  user: User | null; // ログインしているユーザー情報（ログインしていない場合はnull）
  loading: boolean; // 認証状態を確認中かどうか
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 初期状態は認証状態を確認中

  useEffect(() => {
    // Firebaseの認証状態の変化を監視するリスナーを設定
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // 認証状態が変更されたらuserの状態を更新
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

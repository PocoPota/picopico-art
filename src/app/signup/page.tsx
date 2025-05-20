"use client";

import styles from "./page.module.scss";
import SignUpForm from "../components/SignUpForm";
import MailAuth from "../components/MailAuth";

import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (code) {
    return <SignUpForm code={code} />;
  } else {
    return <MailAuth />;
  }
}

"use client";

import styles from "./page.module.scss";
import CreateAccount from "../components/CreateAccount";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense>
      <CreateAccount />
    </Suspense>
  );
}

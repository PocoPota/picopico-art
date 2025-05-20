import SignUpForm from "./SignUpForm";
import MailAuth from "./MailAuth";

import { useSearchParams } from "next/navigation";

export default function CreateAccount() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  if (code) {
    return <SignUpForm code={code} />;
  } else {
    return <MailAuth />;
  }
}

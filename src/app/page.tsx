import { Suspense } from "react";
import Top from "./components/Top";

export default function Home() {
  return (
    <Suspense>
      <Top />
    </Suspense>
  );
}

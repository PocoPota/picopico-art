import { db } from "@/app/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

  const code = randomBytes(16).toString("hex");

  await setDoc(doc(collection(db, "mailauth"), code), {
    email,
    createdAt: Date.now(),
  });

  const registrationUrl = `${process.env.APP_URL}/signup?code=${code}`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "【ぴこぴこアート】ユーザー登録リンク",
      html: `<p>以下のリンクをクリックして登録を完了してください。<br>リンクの有効期間は1時間です。</p>
             <a href="${registrationUrl}">${registrationUrl}</a>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 },
    );
  }
}

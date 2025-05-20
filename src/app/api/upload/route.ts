import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  const { image } = await req.json();

  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "konva_uploads",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

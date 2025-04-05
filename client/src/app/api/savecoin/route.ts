import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("memecoins");
    const data = await db.collection("coins").find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBuffer, tokenAddress } = body;

    if (!imageBuffer || !tokenAddress) {
      return NextResponse.json(
        { error: "Missing imageBuffer or tokenAddress." },
        { status: 400 }
      );
    }

    const imgbbKey = process.env.IMGBB_API_KEY;
    if (!imgbbKey) {
      return NextResponse.json(
        { error: "IMGBB_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const uploadUrl = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
    const formData = new URLSearchParams();
    formData.append("image", imageBuffer);

    const imgbbResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const imgbbData = await imgbbResponse.json();
    if (!imgbbData?.data?.url) {
      return NextResponse.json(
        { error: "Failed to upload image to imgbb." },
        { status: 500 }
      );
    }

    const imageUrl = imgbbData.data.url;

    const client = await clientPromise;
    const db = client.db("memecoins");
    const result = await db
      .collection("coins")
      .insertOne({ tokenAddress, imageUrl });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

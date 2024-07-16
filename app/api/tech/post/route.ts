import { connectDatabase } from "@/lib/mongoose";
import Tech from "@/models/tech-model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { label, category, image } = await req.json();
    const tech = await Tech.create({ label, category, image });
    return NextResponse.json({ data: tech, message: "Tech created" }, { status: 201 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

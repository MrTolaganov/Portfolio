import { connectDatabase } from "@/lib/mongoose";
import Tech from "@/models/tech-model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDatabase();
    const techs = await Tech.find({});
    return NextResponse.json({ data: techs, messages: "Techs got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

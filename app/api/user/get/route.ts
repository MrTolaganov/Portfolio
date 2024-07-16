import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDatabase();
    const users = await User.find();
    return NextResponse.json({ data: users, message: "Users got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

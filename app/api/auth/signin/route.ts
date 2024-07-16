import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { date } from "zod";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { email, password } = await req.json();
    const existedUser = await User.findOne({ email });
    if (!existedUser)
      return NextResponse.json({ data: existedUser, message: "Email does not exist" });
    const correctPassword = await compare(password, existedUser.password);
    if (!correctPassword)
      return NextResponse.json({ data: null, message: "Incorrect password" });
    return NextResponse.json(
      { data: existedUser, message: "User signed in successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

import User from "@/models/user-model";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDatabase } from "@/lib/mongoose";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { username, email, password } = await req.json();
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      const hashedPassword = await hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        isAdmin: false,
        comment: "",
        rating: 0.0,
      });
      return NextResponse.json(
        { data: user, message: "User signed up successfully" },
        { status: 201 }
      );
    } else return NextResponse.json({ data: null, message: "User has already signed up" });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

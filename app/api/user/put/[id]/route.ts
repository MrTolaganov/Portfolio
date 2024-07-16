import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function PUT(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { comment, rating } = await req.json();
    const result = await User.findByIdAndUpdate(
      route.params.id,
      { comment, rating },
      { new: true }
    );
    return NextResponse.json({ data: result, message: "Comment updated" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const result = await User.findById(route.params.id);
    return NextResponse.json({ data: result, message: "User got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

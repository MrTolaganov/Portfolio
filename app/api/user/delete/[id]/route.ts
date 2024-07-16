import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    await User.findByIdAndDelete(route.params.id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

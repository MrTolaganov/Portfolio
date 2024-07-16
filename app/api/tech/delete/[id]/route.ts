import { connectDatabase } from "@/lib/mongoose";
import Tech from "@/models/tech-model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { id } = route.params;
    const tech = await Tech.findByIdAndDelete(id);
    return NextResponse.json({  message: "Tech deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

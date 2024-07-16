import { connectDatabase } from "@/lib/mongoose";
import Tech from "@/models/tech-model";
import { NextResponse } from "next/server";

export async function PUT(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { label, category, image } = await req.json();
    const { id } = route.params;
    const tech = await Tech.findByIdAndUpdate(id, { label, category, image }, { new: true });
    return NextResponse.json({ data: tech, message: "Tech updated" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Something went wrong" }, { status: 500 });
  }
}

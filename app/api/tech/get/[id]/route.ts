import { connectDatabase } from "@/lib/mongoose";
import Tech from "@/models/tech-model";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { id } = route.params;
    const tech = await Tech.findById(id);
    return NextResponse.json({ data: tech, message: "Tech got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

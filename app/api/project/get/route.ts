import { connectDatabase } from "@/lib/mongoose";
import Project from "@/models/project-model";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    await connectDatabase();
    const projects = await Project.find({});
    return NextResponse.json({ data: projects, message: "Projects got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

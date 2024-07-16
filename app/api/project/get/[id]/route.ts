import { connectDatabase } from "@/lib/mongoose";
import Project from "@/models/project-model";
import { NextResponse } from "next/server";

export async function GET(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const project = await Project.findById(route.params.id);
    return NextResponse.json({ data: project, message: "Project got" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

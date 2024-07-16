import { connectDatabase } from "@/lib/mongoose";
import Project from "@/models/project-model";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    await Project.findByIdAndDelete(route.params.id);
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

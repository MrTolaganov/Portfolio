import { connectDatabase } from "@/lib/mongoose";
import Project from "@/models/project-model";
import { NextResponse } from "next/server";

export async function PUT(req: Request, route: { params: { id: string } }) {
  try {
    await connectDatabase();
    const { title, techs, image, browserUrl, githubUrl } = await req.json();
    const project = await Project.findByIdAndUpdate(
      route.params.id,
      { title, techs, image, browserUrl, githubUrl },
      { new: true }
    );
    return NextResponse.json({ data: project, message: "Project updated" }, { status: 200 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

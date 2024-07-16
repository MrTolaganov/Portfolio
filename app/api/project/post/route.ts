import { connectDatabase } from "@/lib/mongoose";
import Project from "@/models/project-model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDatabase();
    const { title, techs, image, browserUrl, githubUrl } = await req.json();
    const project = await Project.create({ title, techs, image, browserUrl, githubUrl });
    return NextResponse.json({ data: project, message: "Project created" }, { status: 201 });
  } catch {
    return NextResponse.json({ data: null, message: "Someting went wrong" }, { status: 500 });
  }
}

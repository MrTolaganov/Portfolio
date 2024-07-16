import { model, models, Schema } from "mongoose";

const projectSchema = new Schema(
  { title: String, techs: String, image:String, browserUrl: String, githubUrl: String },
  { timestamps: true }
);

const Project = models.Project || model("Project", projectSchema);
export default Project;

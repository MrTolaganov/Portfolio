import { Schema, model, models } from "mongoose";

const techSchema = new Schema(
  { label: String, category: String, image: String },
  { timestamps: true }
);

const Tech = models.Tech || model("Tech", techSchema);
export default Tech;

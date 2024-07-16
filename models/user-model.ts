import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    image: String,
    isAdmin: Boolean,
    comment:String,
    rating:Number,
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;

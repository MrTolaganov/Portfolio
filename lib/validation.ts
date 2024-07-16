import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const signUpSchema = z.object({
  username: z.string().min(3).max(16),
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

export const techSchema = z.object({
  image: z.string().min(3),
  label: z.string().min(3).max(16),
  category: z.string().min(3).max(16),
});

export const projectSchema = z.object({
  title: z.string().min(3),
  techs: z.string().min(3),
  image: z.string().min(3),
  browserUrl: z.string().min(3),
  githubUrl: z.string().min(3),
});

export const commentSchema = z.object({
  comment: z.string(),
  rating: z.number(),
});

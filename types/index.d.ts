import { ReactNode } from "react";

export interface NavItemType {
  path: string;
  label: string;
}

export interface ChildProps {
  children: ReactNode;
}

export interface UserType {
  _id?: string;
  name?: string;
  username?: string;
  image?: string;
  email: string;
  isAdmin?: boolean;
  password?: string;
  comment?: string;
  rating?: number;
  createdAt?: Date;
}

export interface TechType {
  _id?: string;
  label: string;
  category: string;
  image: string;
}

export interface ProjectType {
  _id?: string;
  title: string;
  techs: string;
  image: string;
  browserUrl: string;
  githubUrl: string;
}

export interface CommentType {
  comment: string;
  rating: number;
}

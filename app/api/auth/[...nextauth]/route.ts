import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDatabase } from "@/lib/mongoose";
import User from "@/models/user-model";
import { AuthOptions } from "next-auth";
import { NextApiHandler } from "next";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDatabase();
        const user = await User.findOne({ email: credentials?.email });
        if (user) return user;
        else return null;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      await connectDatabase();
      const existedUser = await User.findOne({ email: session.user.email });
      if (!existedUser) {
        const newUser = await User.create({
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          username: session.user.name.split(" ").join("").toLowerCase(),
          password: Math.trunc(Math.random() * 100000000),
          isAdmin: false,
          comment: "",
          rating: 0.0,
        });
        session.currentUser = newUser;
      } else {
        session.currentUser = existedUser;
      }
      session.user.id = token.sub;
      return session;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_JWT_SECRET },
  secret: process.env.SECRET_KEY,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export { authHandler as GET, authHandler as POST };

import Navbar from "@/components/shared/navbar";
import { ChildProps } from "@/types";
import { getServerSession } from "next-auth";
import authOptions from "../api/auth/[...nextauth]/route";
import Auth from "@/components/shared/auth";

export default async function RootLayout({ children }: ChildProps) {
  const session: any = await getServerSession(authOptions);

  return (
    <section className="container relative">
      <Navbar />
      <main>{session?.currentUser ? children : <Auth />}</main>
    </section>
  );
}

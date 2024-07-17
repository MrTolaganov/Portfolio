"use client";
import { myImage } from "@/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function HomePage() {
  const { data: session }: any = useSession();

  return (
    <div className="flex flex-col md:flex-row-reverse justify-center items-center h-[90vh] md:gap-x-32 gap-y-4">
      <div className="bg-black dark:bg-white rounded-full">
        <Image src={myImage} alt="my-image" width={300} height={300} className="rounded-full p-1" />
      </div>
      <div className="flex flex-col gap-y-2 md:gap-y-4 items-center md:items-start">
        <h2 className="text-4xl md:text-6xl font-semibold">
          Hi{" "}
          {!session?.currentUser.name
            ? session?.currentUser.username
                .at(0)
                .toUpperCase()
                .concat(session?.currentUser.username.slice(1).toLowerCase())
            : session?.user.name.split(" ").at(0)}
        </h2>
        <div className="flex flex-col text-5xl md:text-7xl font-bold ">
          <h1>I'm Otabek</h1>
          <h1>Tulaganov</h1>
        </div>
        <h3 className="font-normal text-3xl md:text-5xl">Web Developer</h3>
      </div>
    </div>
  );
}

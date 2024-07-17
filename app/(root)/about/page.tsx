"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const { data: session }: any = useSession();

  return (
    <div className="h-[90vh] flex items-center justify-center px-4 md:px-32">
      <p className="md:leading-10 text-xl  md:text-3xl">
        Hi{" "}
        {!session?.user.name
          ? session?.currentUser.username
              .at(0)
              .toUpperCase()
              .concat(session?.currentUser.username.slice(1).toLowerCase())
          : session?.user.name.split(" ").at(0)}
        , I'm nice to meet you. As I itroduce myself for you, so my fullname is Otabek Tulaganov. I
        was born on March 24, 2004. I'm from Uzbekistan. I have benn studying in Tashkent University
        of Inpformation Technolgies since 2022. I have over half year web development experience.
        I'm interested in building and deploying large scalable, optimizing performance both
        frontend and backend that is full stack web applications.
      </p>
    </div>
  );
}

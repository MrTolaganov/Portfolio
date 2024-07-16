"use client";
import { AlignJustify } from "lucide-react";
import ModeToggle from "../providers/mode-toggle";
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from "../ui/sheet";
import { adminNavItems, navItems } from "@/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [openSheet, setOpenSheet] = useState(false);
  const { data: session }: any = useSession();
  const pathname = usePathname();

  return (
    <>
      <nav className="flex justify-between items-center border-b-2 h-[10vh]">
        <Link href={"/"} className="text-4xl font-bold">
          Portfolio
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {!session?.currentUser.isAdmin
            ? navItems.map(navItem => (
                <li
                  key={navItem.label}
                  className={cn(
                    "text-lg hover:font-semibold",
                    navItem.path === pathname ? "font-semibold" : "font-thin"
                  )}
                >
                  <Link href={navItem.path}>{navItem.label}</Link>
                </li>
              ))
            : adminNavItems.map(navItem => (
                <li
                  key={navItem.label}
                  className={cn(
                    "text-lg hover:font-semibold",
                    navItem.path === pathname ? "font-semibold" : "font-thin"
                  )}
                >
                  <Link href={navItem.path}>{navItem.label}</Link>
                </li>
              ))}
        </ul>
        <span className="flex items-center gap-4">
          <ModeToggle />
          {session && (
            <Popover>
              <PopoverTrigger>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src={session.user?.image!} />
                  <AvatarFallback>
                    {session.currentUser.username?.toUpperCase().at(0)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col border-b-2 pb-3">
                    <span>@{session.currentUser.username}</span>
                    <span className="text-sm text-muted-foreground">
                      {session.currentUser.email.length <= 32
                        ? session.currentUser.email
                        : `${session.currentUser.email.substring(0, 32)}...`}
                    </span>
                  </div>
                  <Button size={"sm"} onClick={() => signOut()}>
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <AlignJustify
            className="block md:hidden cursor-pointer"
            onClick={() => setOpenSheet(true)}
          />
        </span>
      </nav>
      <Sheet open={openSheet} onOpenChange={() => setOpenSheet(false)}>
        <SheetTrigger asChild></SheetTrigger>
        <SheetContent className="w-3/4 px-0 mx-0">
          <Link
            href={"/"}
            className={"text-4xl font-bold px-4"}
            onClick={() => setOpenSheet(false)}
          >
            Portfolio
          </Link>
          <SheetDescription className="flex flex-col py-8 text-black dark:text-white">
            {!session?.currentUser.isAdmin
              ? navItems.map(navItem => (
                  <Link
                    key={navItem.label}
                    href={navItem.path}
                    onClick={() => setOpenSheet(false)}
                    className={cn(
                      "block text-center w-full hover:font-semibold hover:bg-black/5 dark:hover:bg-white/5 py-3 px-4",
                      navItem.path === pathname
                        ? "font-semibold bg-black/5 dark:bg-white/5"
                        : "font-thin"
                    )}
                  >
                    {navItem.label}
                  </Link>
                ))
              : adminNavItems.map(navItem => (
                  <Link
                    key={navItem.label}
                    href={navItem.path}
                    onClick={() => setOpenSheet(false)}
                    className={cn(
                      "block text-center w-full hover:font-semibold hover:bg-black/5 dark:hover:bg-white/5 py-3 px-4",
                      navItem.path === pathname
                        ? "font-semibold bg-black/5 dark:bg-white/5"
                        : "font-thin"
                    )}
                  >
                    {navItem.label}
                  </Link>
                ))}
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}

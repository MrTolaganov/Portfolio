"use client";
import { SiGmail } from "react-icons/si";
import { FaTelegramPlane } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import ReactStars from "react-stars";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { CommentType, UserType } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/constants";

export default function ContactPage() {
  const [state, setState] = useState<CommentType>({ comment: "", rating: 0.0 });
  const { data: session }: any = useSession();
  let isCommented: boolean = false;

  const ratingChangehandler = (value: number) => {
    setState(state => ({ ...state, rating: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.comment || !state.rating) {
      toast({
        description:
          !state.comment && !state.rating
            ? "Comment and Rating are required."
            : !state.comment
            ? "Comment is required."
            : "Rating is reqired",
        variant: "destructive",
      });
      return;
    } else if (state.comment.length > 100) {
      toast({
        description: "Comment must be less than 100 characters.",
        variant: "destructive",
      });
      return;
    } else {
      await api.put(`/api/user/put/${session?.currentUser._id}`, state);
      toast({
        description: `Comment and rating ${
          !isCommented ? "added" : "edited"
        } successfully. Only owner of this portfolio can see all comments.`,
        variant: "default",
      });
    }
    setState({ comment: "", rating: 0.0 });
  };

  const getCommentByUserId = async () => {
    try {
      const { data: comment } = await api.get(`/api/user/get/${session?.currentUser._id}`);
      isCommented = comment.data.comment ? true : false;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommentByUserId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="h-[90vh] flex flex-col md:flex-row justify-evenly items-center">
      <div className="flex flex-col gap-y-4  md:text-xl">
        <span className="flex items-center gap-2">
          <SiGmail />
          tulaganovok04@gmail.com
        </span>
        <Link
          href={"https://t.me/tulaganovok"}
          target="_blank"
          className="flex items-center gap-2 hover:underline"
        >
          <FaTelegramPlane />
          @tulaganovok
        </Link>
        <Link
          href={"https://www.linkedin.com/in/otabek-%D1%82ulaganov-143106294/"}
          target="_blank"
          className="flex items-center gap-2 hover:underline"
        >
          <FaLinkedinIn />
          @otabektulaganov
        </Link>
        <Link
          href={"https://github.com/MrTolaganov"}
          target="_blank"
          className="flex items-center gap-2 hover:underline"
        >
          <FaGithub />
          @MrTolaganov
        </Link>
        <Link
          href={
            "https://www.google.com/maps/place/Tashkent,+Uzbekistan/@41.2824799,69.1145579,11z/data=!3m1!4b1!4m6!3m5!1s0x38ae8b0cc379e9c3:0xa5a9323b4aa5cb98!8m2!3d41.2994958!4d69.2400734!16zL20vMGZzbXk?entry=ttu"
          }
          target="_blank"
          className="flex items-center gap-2 hover:underline"
        >
          <FaLocationDot />
          Tashkent, Uzbekistan
        </Link>
        <span className="flex items-center gap-2">
          <FaPhoneAlt />
          +998 94 368 62 65
        </span>
      </div>
      <div className="w-72 md:w-96">
        <form
          className="flex flex-col space-y-4 items-center md:items-start border-2 p-6 rounded-md"
          onSubmit={handleSubmit}
        >
          <textarea
            name="comment"
            id="comment"
            placeholder="Comment it out"
            className="w-full resize p-2 rounded-md"
            rows={3}
            value={state.comment}
            onChange={e => setState(state => ({ ...state, comment: e.target.value! }))}
          ></textarea>
          <div className="flex flex-col space-y-2">
            <ReactStars
              count={5}
              half
              value={state.rating}
              size={32}
              color2="#ffd700"
              className="space-x-4"
              onChange={ratingChangehandler}
            />
          </div>
          <Button type="submit" size={"sm"}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

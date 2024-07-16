"use client";
import useSigninModal from "@/hooks/useSigninModal";
import SigninModal from "../modals/signin-modal";
import { useEffect } from "react";
import { useAuthType } from "@/hooks/useAuthType";
import SignUpModal from "../modals/signup-modal";

export default function Auth() {
  const { onOpen } = useSigninModal();
  const { state } = useAuthType();

  useEffect(() => {
    onOpen();
  }, []);

  return <>{state === "signin" ? <SigninModal /> : <SignUpModal />}</>;
}

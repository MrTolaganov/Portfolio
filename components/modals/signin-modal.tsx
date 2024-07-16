"use client";
import useSigninModal from "@/hooks/useSigninModal";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import SignupModal from "./signup-modal";
import useSignupModal from "@/hooks/useSignupModal";
import { useAuthType } from "@/hooks/useAuthType";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useToast } from "../ui/use-toast";

export default function SigninModal() {
  const { isOpen, onClose } = useSigninModal();
  const { onOpen } = useSignupModal();
  const { onSignup } = useAuthType();
  const { toast } = useToast();

  const signinForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const { isSubmitting } = signinForm.formState;

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const { email, password } = values;
      const { data: user } = await axios.post("/api/auth/signin", { email, password });

      if (user.data) {
        signIn("credentials", { email, password });
        onClose();
        toast({ description: user.message });
      } else {
        toast({ description: user.message, variant: "destructive" });
        signinForm.reset();
      }
    } catch {
      toast({ description: "Something went wrong", variant: "destructive" });
      signinForm.reset();
    }
  };

  const pushSignup = () => {
    onClose();
    onSignup();
    onOpen();
    return <SignupModal />;
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogTitle className="text-center text-xl">Sign in</DialogTitle>
        <Form {...signinForm}>
          <form onSubmit={signinForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={signinForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="otabektulaganov@gmail.com" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signinForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <div className="flex items-center gap-2 text-[12px] border-b-2 pb-2">
              <span className="text-muted-foreground">Don't have an account?</span>
              <span className="cursor-pointer" onClick={pushSignup}>
                Sign up
              </span>
            </div>
          </form>
        </Form>
        <Button className="w-full" type="submit" onClick={() => signIn("github")}>
          <FaGithub className="w-5 h-5 text-white dark:text-black mr-1" />
          Continue with Github
        </Button>
        <Button className="w-full" type="submit" onClick={() => signIn("google")}>
          <FaGoogle className="w-4 h-4 text-white dark:text-black mr-1" />
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}

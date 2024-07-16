"use client";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import useSignupModal from "@/hooks/useSignupModal";
import useSigninModal from "@/hooks/useSigninModal";
import { signUpSchema } from "@/lib/validation";
import SigninModal from "./signin-modal";
import { useAuthType } from "@/hooks/useAuthType";
import { signIn } from "next-auth/react";
import axios from "axios";
import { useToast } from "../ui/use-toast";

export default function SignUpModal() {
  const { isOpen, onClose } = useSignupModal();
  const { onOpen } = useSigninModal();
  const { onSignin } = useAuthType();
  const { toast } = useToast();

  const signupForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const { isSubmitting } = signupForm.formState;

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const { username, email, password } = values;
      const { data: user } = await axios.post("/api/auth/signup", { username, email, password });
      if (user.data) {
        signIn("credentials", { email, password });
        onClose();
        toast({ description: user.message });
      } else {
        toast({ description: user.message, variant: "destructive" });
        signupForm.reset();
      }
    } catch {
      toast({ description: "Something went wrong", variant: "destructive" });
      signupForm.reset();
    }
  };

  const pushSignin = () => {
    onClose();
    onSignin();
    onOpen();
    return <SigninModal />;
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogTitle className="text-center text-xl">Sign up</DialogTitle>
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={signupForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="otabektulaganov" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signupForm.control}
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
              control={signupForm.control}
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
              <span className="text-muted-foreground">Have an account?</span>
              <span className="cursor-pointer" onClick={pushSignin}>
                Sign in
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

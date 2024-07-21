"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/constants";
import { cn } from "@/lib/utils";
import { techSchema } from "@/lib/validation";
import { TechType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function TechsPage() {
  const [techs, setTechs] = useState<TechType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"add" | "edit">("edit");
  const [id, setId] = useState("");
  const { data: session }: any = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof techSchema>>({
    resolver: zodResolver(techSchema),
    defaultValues: { image: "", label: "", category: "" },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof techSchema>) => {
    try {
      const { label, category, image } = values;
      if (state === "add") {
        const { data: tech } = await api.post("/api/tech/post", { label, category, image });
        setTechs([...techs, tech.data]);
      } else {
        const { data: tech } = await api.put(`/api/tech/put/${id}`, { label, category, image });
        setTechs(techs => techs.map(t => (t._id === tech.data._id ? tech.data : t)));
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const onAddTech = () => {
    setState("add");
    form.reset({ label: "", category: "", image: "" });
    setOpen(true);
  };

  const onEditTech = (id: string) => {
    setState("edit");
    setId(id);
    setOpen(true);
  };

  const onDeleteTech = async (id: string) => {
    try {
      await api.delete(`/api/tech/delete/${id}`);
      setTechs(techs => techs.filter(tech => tech._id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const getTechs = async () => {
    try {
      const { data: techs } = await api.get("/api/tech/get");
      setTechs(techs.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTechs();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const getTech = async (id: string) => {
      const { data: tech } = await api.get(`/api/tech/get/${id}`);
      form.reset({
        label: tech.data.label!,
        category: tech.data.category!,
        image: tech.data.image!,
      });
    };
    getTech(id);
  }, [form, id]);

  return (
    <>
      <div className="h-[90vh] flex items-center justify-center flex-col">
        {isLoading && (
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-9/12"
          >
            <CarouselContent>
              {techs.map(tech => (
                <CarouselItem key={tech._id} className={`md:basis-1/3`}>
                  <div className="p-1 border-black">
                    <Card className="border-black dark:border-white">
                      <Skeleton className="w-full h-60 md:h-72" />
                      <div className="flex justify-between gap-x-2 px-2 py-1 border-t-2 border-black items-center">
                        <Skeleton className="w-2/3 h-6" />
                        <Skeleton className="w-1/3 h-6" />
                      </div>
                      {session?.currentUser.isAdmin && (
                        <div className="flex items-center border-t-2 gap-2 m-1 border-black dark:border-white pt-1">
                          <Skeleton className="w-1/2 h-8" />
                          <Skeleton className="w-1/2 h-8" />
                        </div>
                      )}
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div onClick={() => setStep(step => step - 1)}>
              <CarouselPrevious />
            </div>
            <div onClick={() => setStep(step => step + 1)}>
              <CarouselNext />
            </div>
          </Carousel>
        )}
        {!isLoading && techs.length > 0 && (
          <>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-9/12"
            >
              <CarouselContent>
                {techs.map((tech, idx) => (
                  <CarouselItem key={tech._id} className={`md:basis-1/3`}>
                    <div className="p-1 border-black">
                      <Card className="border-4 border-black dark:border-white">
                        <CardContent className="flex aspect-square items-center justify-center p-6 relative bg-white ">
                          <Badge className="absolute z-50 top-0 right-0 bg-black/50 text-white m-1 md:hidden">
                            {idx + 1} / {techs.length}
                          </Badge>
                          <Image src={tech.image} alt={tech.label} fill className="object-cover" />
                        </CardContent>
                        <div className="flex justify-between px-2 py-1 border-t-2 border-black items-center">
                          <span className="font-semibold text-xl">{tech.label}</span>
                          <span className="text-muted-foreground">{tech.category}</span>
                        </div>
                        {session?.currentUser.isAdmin && (
                          <div className="flex items-center border-t-2 gap-2 m-1 border-black dark:border-white pt-1">
                            <Button
                              className="w-1/2"
                              size={"sm"}
                              onClick={() => onEditTech(tech._id!)}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="w-1/2" size={"sm"}>
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure to delete this technology?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    technology and remove your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction asChild>
                                    <Button onClick={() => onDeleteTech(tech._id!)}>
                                      Continue
                                    </Button>
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        )}
        {!isLoading && techs.length === 0 && <span>No techs found</span>}
        {session?.currentUser.isAdmin && (
          <Button className="mt-8" onClick={onAddTech}>
            Add technology
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle className="text-center text-xl">
            {state.at(0)?.toUpperCase().concat(state.slice(1))} technology
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technology</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

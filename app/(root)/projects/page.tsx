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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import getTechs from "@/lib/getTechs";
import { projectSchema } from "@/lib/validation";
import { ProjectType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { z } from "zod";

export default function ProjectsPage() {
  const { data: session }: any = useSession();
  const [state, setState] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", techs: "", image: "", browserUrl: "", githubUrl: "" },
  });

  const { isSubmitting } = form.formState;

  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    try {
      const { title, techs, image, browserUrl, githubUrl } = values;
      if (state === "add") {
        const { data: project } = await api.post("/api/project/post", {
          title,
          techs,
          image,
          browserUrl,
          githubUrl,
        });
        setProjects([...projects, project.data]);
      } else {
        const { data: project } = await api.put(`/api/project/put/${id}`, {
          title,
          techs,
          image,
          browserUrl,
          githubUrl,
        });
        setProjects(projects => projects.map(p => (p._id === project.data._id ? project.data : p)));
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const onAddProject = () => {
    setState("add");
    form.reset({ title: "", techs: "", image: "", browserUrl: "", githubUrl: "" });
    setOpen(true);
  };

  const onEditProject = (id: string) => {
    setState("edit");
    setId(id);
    setOpen(true);
  };

  const onDeleteTech = async (id: string) => {
    try {
      await api.delete(`/api/project/delete/${id}`);
      setProjects(projects => projects.filter(project => project._id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchHandler = (value: string) => {
    setValue(value);
    if (value.trim()) {
      setProjects(
        allProjects.filter(
          project =>
            project.title.toLowerCase().includes(value.toLowerCase()) ||
            project.techs.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setProjects(allProjects);
    }
  };

  const getProjects = async () => {
    try {
      const { data: projects } = await api.get("/api/project/get");
      setProjects(projects.data);
      setAllProjects(projects.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const getProject = async (id: string) => {
      try {
        const { data: project } = await api.get(`/api/project/get/${id}`);
        form.reset({
          title: project.data.title!,
          techs: project.data.techs!,
          image: project.data.image!,
          browserUrl: project.data.browserUrl!,
          githubUrl: project.data.githubUrl!,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getProject(id);
  }, [form, id]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-y-0 md:gap-x-4">
        <div className="flex justify-center items-center py-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Search..."
            className="w-full md:w-80 h-10 rounded-xl bg-muted text-[1rem]"
            ref={inputRef}
            value={value}
            onChange={e => onSearchHandler(e.target.value!)}
          />
          <FaSearch className="w-6 h-6 ml-[-28px] z-50 hover:cursor-pointer" onClick={onFocus} />
        </div>
        {session?.currentUser.isAdmin && (
          <Button className="w-full md:w-auto" onClick={onAddProject}>
            Add project
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
        {isLoading &&
          projects
            .slice()
            .reverse()
            .map(project => (
              <Card key={project._id} className="h-76">
                <Skeleton className="w-full h-40" />
                <div className="flex flex-col justify-between p-2 h-36">
                  <Skeleton className="w-2/3 h-6" />
                  <div className="flex flex-wrap items-center gap-2">
                    {getTechs(project.techs).map((_, idx) => (
                      <Skeleton key={idx} className="w-1/6 h-4" />
                    ))}
                  </div>
                  <Skeleton className="w-full h-8" />
                </div>
                {session?.currentUser.isAdmin && (
                  <div className="flex items-center border-t-2 px-2 py-1 gap-x-2">
                    <Skeleton className="w-1/2 h-8" />
                    <Skeleton className="w-1/2 h-8" />
                  </div>
                )}
              </Card>
            ))}

        {!isLoading &&
          projects.length > 0 &&
          projects
            .slice()
            .reverse()
            .map(project => (
              <Card key={project._id} className="h-76 border-2 border-black dark:border-white">
                <div className="relative w-full h-40 border-b-2 border-black dark:border-white">
                  <Link href={project.browserUrl} target="_blank">
                    <Image src={project.image} alt="image" fill className="object-cover" />
                  </Link>
                </div>
                <div className="flex flex-col justify-between p-2 h-36">
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {getTechs(project.techs).map((tech, idx) => (
                      <span key={idx} className="bg-muted px-1 rounded-sm text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Link href={project.githubUrl} target="_blank">
                    <Button className="w-full" size={"sm"}>
                      <FaGithub className="w-5 h-5 mr-1" />
                      Source code
                    </Button>
                  </Link>
                </div>
                {session?.currentUser.isAdmin && (
                  <div className="flex items-center border-t-2 px-2 py-1 gap-x-2">
                    <Button
                      className="w-1/2"
                      size={"sm"}
                      onClick={() => onEditProject(project._id!)}
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
                          <AlertDialogTitle>Are you sure to delete this project?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your project
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button onClick={() => onDeleteTech(project._id!)}>Continue</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </Card>
            ))}
      </div>
      {!isLoading && projects.length === 0 && (
        <div className="text-center w-full">No projects found</div>
      )}
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent>
          <DialogTitle className="text-center text-xl">
            {state.at(0)?.toUpperCase().concat(state.slice(1))} project
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="techs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Techs</FormLabel>
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
              <FormField
                control={form.control}
                name="browserUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BrowserURL</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GithubURL</FormLabel>
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

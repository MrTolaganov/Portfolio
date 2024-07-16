"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommentType, UserType } from "@/types";
import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import ReactStars from "react-stars";
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

export default function DashboardPage() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [id, setId] = useState("");
  const [state, setState] = useState<CommentType>({ comment: "", rating: 0.0 });
  const isCommented = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getUsers = async () => {
    try {
      const { data: users } = await axios.get("/api/user/get");
      setAllUsers(users.data);
      setUsers(users.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (id: string) => {
    try {
      const { data: user } = await axios.get(`/api/user/get/${id}`);
      setState({ comment: user.data.comment, rating: user.data.rating });
      isCommented.current = user.data.comment ? true : false;
    } catch (error) {
      console.error(error);
    }
  };

  const onFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const onSearchHandler = (value: string) => {
    setValue(value);
    if (value.trim()) {
      setUsers(allUsers.filter(user => user.username?.toLowerCase().includes(value.toLowerCase())));
    } else {
      setUsers(allUsers);
    }
  };

  const onEditUser = (id: string) => {
    setId(id);
    setOpenDialog(true);
  };

  const onDeleteUser = async (id: string) => {
    try {
      await axios.delete(`/api/user/delete/${id}`);
      setUsers(users => users.filter(user => user._id !== id));
      setAllUsers(users => users.filter(user => user._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

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
      const { data: user } = await axios.put(`/api/user/put/${id}`, state);
      setUsers(users => users.map(u => (u._id === user.data._id ? user.data : u)));
      setAllUsers(users => users.map(u => (u._id === user.data._id ? user.data : u)));
      toast({
        description: `Comment and rating ${
          !isCommented.current ? "added" : "edited"
        } successfully. Only owner of this portfolio can see all comments.`,
        variant: "default",
      });
    }
    setOpenDialog(false);
    // getUsers();
  };

  useEffect(() => {
    getUsers();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    getUser(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Users</TableHead>
            <TableHead className="min-w-32">Date</TableHead>
            <TableHead className="min-w-32">Admins</TableHead>
            <TableHead className="min-w-32">Comments</TableHead>
            <TableHead>Ratings</TableHead>
            <TableHead colSpan={2} className="text-center">
              Settings
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            users.map(user => (
              <TableRow key={user._id}>
                <TableCell>
                  <Skeleton className="w-48 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-32 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-8 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-64 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-16 h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-20 h-6" />
                </TableCell>
              </TableRow>
            ))}
          {!isLoading &&
            users.length > 0 &&
            users
              .slice()
              .reverse()
              .map(user => (
                <TableRow key={user._id}>
                  <TableCell>@{user.username}</TableCell>
                  <TableCell className="min-w-32">
                    {format(user.createdAt!, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="min-w-32">
                    {user.isAdmin ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      <MdClose className="w-5 h-5" />
                    )}
                  </TableCell>
                  <TableCell className="min-w-32 max-w-48">
                    {user.comment ? user.comment : "-"}
                  </TableCell>
                  <TableCell>{user.rating ? user.rating : "-"}</TableCell>
                  <TableCell>
                    <Button size={"sm"} variant={"outline"} onClick={() => onEditUser(user._id!)}>
                      Edit comment
                    </Button>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="text-red-500" size={"sm"} variant={"outline"}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure to delete this user?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your user and
                            remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button onClick={() => onDeleteUser(user._id!)}>Continue</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          {!isLoading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton className="w-48 h-4" />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <Skeleton className="w-8 h-4" />
              </TableCell>
              <TableCell className="min-w-32">
                <Skeleton className="w-64 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-16 h-4" />
              </TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">-</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell>{users.length} users</TableCell>
              <TableCell>-</TableCell>
              <TableCell className="min-w-32">
                {users.filter(user => user.isAdmin).length} admins
              </TableCell>
              <TableCell className="min-w-32">
                {users.filter(user => user.comment !== "").length} comments
              </TableCell>
              <TableCell>
                {users.filter(user => user.rating !== 0.0).length
                  ? (
                      users
                        .filter(user => user.rating !== 0.0)
                        .reduce((acc, cur) => acc + Number(cur.rating), 0) /
                      users.filter(user => user.rating !== 0.0).length
                    ).toFixed(2)
                  : "-"}
              </TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">-</TableCell>
            </TableRow>
          )}
        </TableFooter>
      </Table>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogTitle className="text-center text-xl">Edit comment</DialogTitle>
          <div className="w-full">
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
        </DialogContent>
      </Dialog>
    </>
  );
}

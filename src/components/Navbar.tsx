import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/AuthService";
import { login, logout } from "@/store/authSlice";
import { resetUserData } from "@/store/coursesSlice";
import { AppDispatch, RootState } from "@/store/store";
import { LayoutDashboardIcon, Loader2, MountainIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type FormValues = {
  email: string;
  password: string;
};

const Navbar = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { email, password } = formValues;

    if (isLogin) {
      try {
        const session = await authService.login({ email, password });
        if (session) {
          const userData = await authService.getCurrentUser();
          console.log(userData);
          if (userData) dispatch(login(userData));
          navigate("/");
          toast.success("Logged in successfully");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const msg = error?.message;
        if (msg.includes(":")) toast.error(msg.split(":")[1]);
        else toast.error(msg);
        console.log(error?.message);
      }
    } else {
      try {
        const userData = await authService.createAccount({ email, password });
        if (userData) {
          const userData = await authService.getCurrentUser();
          if (userData) dispatch(login(userData));
          navigate("/");
          toast.success("Logged in successfully");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const msg = error?.message;
        if (msg.includes(":")) toast.error(msg.split(":")[1]);
        else toast.error(msg);
        console.log(error);
      }
    }

    setLoading(false);
  };

  const logoutUser = () => {
    authService.logout().then(() => {
      dispatch(logout());
      dispatch(resetUserData());
      navigate("/");
    });
  };

  return (
    <header className="bg-background border-b shadow-sm sticky top-0 z-40">
      <div className="container px-4 md:px-6 flex items-center h-16">
        <Link to="/" className="mr-6 flex items-center">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Course Inc</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          {status ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <LayoutDashboardIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logoutUser}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{isLogin ? "Log in" : "Sign up"}</DialogTitle>
                  <DialogDescription>
                    Please {isLogin ? "log in into" : "create"} your account
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-left">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      className="col-span-3"
                      value={formValues.email}
                      required
                      onChange={(e) =>
                        setFormValues({ ...formValues, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-left">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="col-span-3"
                      required
                      value={formValues.password}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex w-full justify-between mt-4">
                    {isLogin ? (
                      <Button
                        onClick={() => setIsLogin(false)}
                        variant={"link"}
                        className="px-0"
                      >
                        Create an account
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setIsLogin(true)}
                        className="px-0"
                        variant={"link"}
                      >
                        Login an account
                      </Button>
                    )}

                    <Button type="submit" disabled={loading}>
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Submit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

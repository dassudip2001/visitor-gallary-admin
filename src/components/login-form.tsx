"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

export type LoginRequestT = {
  email: string;
  password: string;
  redirect: boolean;
};
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestT>();

  // Check if user is already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = session.user.role;
      if (userRole === "admin" || userRole === "superadmin") {
        console.log("User already authenticated, redirecting to dashboard");
        // Show loading state before redirect
        setLoading(true);
        router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  const conSubmit: SubmitHandler<LoginRequestT> = async (data) => {
    setLoading(true);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        console.error(result?.error);
        toast.error("Invalid email or password.");
        setLoading(false);
      } else {
        console.log("Login successful, redirecting to dashboard");
        toast("Login successful");
        // Use window.location for more reliable redirect in production
        router.push("/dashboard");
        setLoading(false);
      }
    });
  };

  if (errors.email || errors.password) {
    toast.error(
      "Please fill in all required fields." +
        (errors.email ? " Email is required." : "") +
        (errors.password ? " Password is required." : "")
    );
  }

  // Show loading while checking session or redirecting authenticated user
  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {status === "authenticated" && loading 
                ? "Redirecting to Dashboard..." 
                : "Checking authentication..."}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <div className="text-center text-muted-foreground">
                {status === "authenticated" && loading 
                  ? "You're already logged in. Redirecting to your dashboard..." 
                  : "Please wait while we verify your session."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(conSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder="Enter password"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {loading ? "Loading..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                Please contact the administrator to get an account.
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "./ui/sonner";

type Inputs = {
  email: string;
  password: string;
  name: string;
  password_confirmation: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const handleGoogle = () => {
    const backendUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:8000";
    window.location.href = `${backendUrl}/oauth/google/redirect`;
  };

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: data.email,
      password: data.password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            toast.error(value[0]);
          });
        } else if (result.message) {
          toast.error(result.message);
        } else {
          toast.success("User logged in successfully");
          localStorage.setItem("token", result.access_token);
          navigate("/");
        }
      })
      .catch((error) => console.error(error));
  };

  const token = localStorage.getItem("token");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {token ? (
        <div className="text-center text-sm text-gray-600">
          You are already logged in
        </div>
      ) : (
        <>
          <Card>
            <Toaster />
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...register("email")}
                    />
                  </Field>
                  <Field>
                    {/* <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div> */}
                    <Input
                      id="password"
                      type="password"
                      required
                      {...register("password")}
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Login</Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogle}
                    >
                      Login with Google
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link to="/register">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

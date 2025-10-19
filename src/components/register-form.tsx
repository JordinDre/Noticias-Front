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
import { Toaster } from "@/components/ui/sonner";

type Inputs = {
  email: string;
  password: string;
  name: string;
  password_confirmation: string;
};
import { Link, useNavigate } from "react-router-dom";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };


    fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          Object.entries(result.errors).forEach(([, value]) => {
            toast.error((value as string[])[0]);
          });
        } else if (result.data) {
          toast.success("¡Registro exitoso! Por favor verifica tu correo electrónico.");
          toast.info("Hemos enviado un enlace de verificación a tu correo.");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar usuario");
      });
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
              <CardTitle>Register to your account</CardTitle>
              <CardDescription>
                Enter your email below to register to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      {...register("name")}
                    />
                  </Field>
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
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      {...register("password")}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password_confirmation">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="password_confirmation"
                      type="password"
                      required
                      {...register("password_confirmation")}
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Register</Button>
                    {/* <Button variant="outline" type="button">
                  Register with Google
                </Button> */}
                    <FieldDescription className="text-center">
                      Already have an account? <Link to="/login">Login</Link>
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

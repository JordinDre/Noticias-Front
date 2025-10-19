import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
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

type Inputs = {
  password: string;
  password_confirmation: string;
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (!token || !email) {
      toast.error("Enlace de recuperación inválido");
      return;
    }

    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      token: token,
      email: email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/auth/password/reset`,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.errors) {
          Object.entries(result.errors).forEach(([, value]) => {
            toast.error((value as string[])[0]);
          });
        } else if (result.message && !result.errors) {
          toast.success("¡Contraseña cambiada exitosamente!");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Error al cambiar la contraseña");
      });
  };

  if (!token || !email) {
    return (
      <>
        <Navbar />
        <Toaster />
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <CardTitle>Enlace Inválido</CardTitle>
                <CardDescription>
                  El enlace de recuperación es inválido o ha expirado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <svg
                      className="w-16 h-16 text-red-500 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 font-medium">
                      Enlace no válido
                    </p>
                    <p className="text-red-700 text-sm mt-2">
                      Por favor solicita un nuevo enlace de recuperación
                    </p>
                  </div>

                  <Button asChild className="w-full">
                    <Link to="/password/forgot">
                      Solicitar Nuevo Enlace
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Restablecer Contraseña</CardTitle>
              <CardDescription>
                Ingresa tu nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">
                      Correo Electrónico
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-100"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">
                      Nueva Contraseña
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                      {...register("password")}
                    />
                    <FieldDescription>
                      Mínimo 8 caracteres, debe incluir mayúsculas, minúsculas, números y símbolos
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password_confirmation">
                      Confirmar Nueva Contraseña
                    </FieldLabel>
                    <Input
                      id="password_confirmation"
                      type="password"
                      placeholder="********"
                      required
                      {...register("password_confirmation")}
                    />
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading
                        ? "Cambiando contraseña..."
                        : "Restablecer Contraseña"}
                    </Button>

                    <div className="text-center text-sm mt-4">
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                      >
                        Volver a Iniciar Sesión
                      </Link>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


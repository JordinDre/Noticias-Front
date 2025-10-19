import { useState } from "react";
import { Link } from "react-router-dom";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Inputs = {
  email: string;
};

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: data.email,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(
      `${import.meta.env.VITE_API_URL}/auth/password/forgot`,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.errors) {
          Object.entries(result.errors).forEach(([, value]) => {
            toast.error((value as string[])[0]);
          });
        } else if (result.message) {
          toast.success(result.message);
          setEmailSent(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Error al enviar el enlace de recuperación");
      });
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>¿Olvidaste tu contraseña?</CardTitle>
              <CardDescription>
                {emailSent
                  ? "Revisa tu correo electrónico"
                  : "Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emailSent ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg
                      className="w-16 h-16 text-green-500 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-green-800 font-medium">
                      ¡Enlace enviado!
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                      Hemos enviado un enlace de recuperación a tu correo
                      electrónico. Por favor revisa tu bandeja de entrada.
                    </p>
                  </div>

                  <div className="text-center text-sm space-y-2">
                    <p>
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                      >
                        Volver a Iniciar Sesión
                      </Link>
                    </p>
                    <p className="text-gray-600">
                      ¿No recibiste el email?{" "}
                      <button
                        onClick={() => setEmailSent(false)}
                        className="text-blue-600 hover:underline"
                      >
                        Intentar de nuevo
                      </button>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="email">
                        Correo Electrónico
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu-email@ejemplo.com"
                        required
                        {...register("email")}
                      />
                    </Field>

                    <Field>
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Enviando..." : "Enviar Enlace de Recuperación"}
                      </Button>

                      <div className="text-center text-sm space-y-2 mt-4">
                        <p>
                          <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                          >
                            Volver a Iniciar Sesión
                          </Link>
                        </p>
                        <p className="text-gray-600">
                          ¿No tienes cuenta?{" "}
                          <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                          >
                            Regístrate
                          </Link>
                        </p>
                      </div>
                    </Field>
                  </FieldGroup>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


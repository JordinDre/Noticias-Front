import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
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

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener parámetros de la URL
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");

    if (!id || !hash) {
      setError("Enlace de verificación inválido");
      setLoading(false);
      return;
    }

    // Llamar al endpoint de verificación
    fetch(
      `${import.meta.env.VITE_API_URL}/auth/email/verify/${id}/${hash}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.email_verified) {
          setVerified(true);
          toast.success(result.message || "¡Email verificado exitosamente!");
        } else {
          setError(result.message || "Error al verificar el email");
          toast.error(result.message || "Error al verificar el email");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError("Error al verificar el email");
        toast.error("Error al verificar el email");
      });
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Verificación de Email</CardTitle>
              <CardDescription>
                {loading
                  ? "Verificando tu correo electrónico..."
                  : verified
                  ? "Tu correo ha sido verificado exitosamente"
                  : "Error en la verificación"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}

              {!loading && verified && (
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-green-800 font-medium">
                      ¡Email verificado exitosamente!
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                      Ahora puedes iniciar sesión con tu cuenta.
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/login">Ir a Iniciar Sesión</Link>
                  </Button>
                </div>
              )}

              {!loading && error && (
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
                    <p className="text-red-800 font-medium">{error}</p>
                    <p className="text-red-700 text-sm mt-2">
                      El enlace puede estar expirado o ser inválido.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link to="/login">Ir a Iniciar Sesión</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/register">Registrarse de nuevo</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


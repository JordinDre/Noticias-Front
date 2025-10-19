import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export default function ResendVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debes iniciar sesión primero");
      navigate("/login");
      return;
    }

    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    fetch(`${import.meta.env.VITE_API_URL}/auth/email/resend`, {
      method: "POST",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        if (result.email_verified) {
          toast.success("Tu email ya está verificado");
          navigate("/");
        } else if (result.message) {
          toast.success(result.message);
          setSent(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Error al reenviar el email de verificación");
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
              <CardTitle>Reenviar Email de Verificación</CardTitle>
              <CardDescription>
                {sent
                  ? "Email enviado. Por favor revisa tu bandeja de entrada."
                  : "Haz clic en el botón para recibir un nuevo email de verificación."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sent ? (
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
                      ¡Email enviado exitosamente!
                    </p>
                    <p className="text-green-700 text-sm mt-2">
                      Por favor revisa tu bandeja de entrada y haz clic en el
                      enlace de verificación.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg
                      className="w-16 h-16 text-blue-500 mx-auto mb-4"
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
                    <p className="text-blue-800 font-medium">
                      ¿No recibiste el email de verificación?
                    </p>
                    <p className="text-blue-700 text-sm mt-2">
                      Podemos enviarte un nuevo enlace de verificación a tu
                      correo electrónico.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleResend}
                  disabled={loading || sent}
                  className="w-full"
                >
                  {loading
                    ? "Enviando..."
                    : sent
                    ? "Email Enviado"
                    : "Reenviar Email de Verificación"}
                </Button>

                <div className="text-center text-sm space-y-2">
                  <p>
                    <Link
                      to="/login"
                      className="text-blue-600 hover:underline"
                    >
                      Volver a Iniciar Sesión
                    </Link>
                  </p>
                  <p>
                    <Link to="/" className="text-blue-600 hover:underline">
                      Volver al Inicio
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}


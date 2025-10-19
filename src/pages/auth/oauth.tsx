import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log(token);
    if (!token) {
      window.location.href = "/";
      return;
    }

    localStorage.setItem("token", token);
    window.location.href = "/";
  }, []);

  return <p className="p-6 text-sm text-gray-600">Autenticando...</p>;
}

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface NoticiaType {
  id: number;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export default function Noticia() {
  const [noticia, setNoticia] = useState<NoticiaType[]>([]);

  const { title } = useParams();

  function fetchNoticia(title: string) {
    fetch(
      `${import.meta.env.VITE_API_URL}/everything?q=${title}&apiKey=${import.meta.env.VITE_TOKEN_API_NEWS}`
    )
      .then((response) => response.json())
      .then((data) => setNoticia(data.articles[0]));
  }

  console.log(noticia);

  useEffect(() => {
    fetchNoticia(title as string);
  }, [title]);

  const token = localStorage.getItem("token");
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    function fetchMe() {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
      };

      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, requestOptions as RequestInit)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.data) {
            setAutenticado(true);
          } else {
            setAutenticado(false);
          }
        })
        .catch((error) => console.error(error));
    }
    fetchMe();
  }, [token]);

  return (
    <>
      <Navbar />

      {autenticado ? (
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold">{noticia.title}</h1>
          <p className="text-gray-600">{noticia.description}</p>
          <img
            src={noticia.urlToImage}
            alt={noticia.title}
            className="w-full h-full object-cover"
          />
          <p className="text-gray-600">{noticia.content}</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold">
            You need to login to view this noticia
          </h1>
          <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
        </div>
      )}
    </>
  );
}

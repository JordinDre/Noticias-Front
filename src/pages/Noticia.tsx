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
  content?: string;
  source?: {
    name: string;
  };
}

export default function Noticia() {
  const [noticia, setNoticia] = useState<NoticiaType | null>(null);
  const [noticiasRelacionadas, setNoticiasRelacionadas] = useState<NoticiaType[]>([]);

  const { title, category } = useParams();

  function fetchNoticia(title: string) {
    fetch(
      `${import.meta.env.VITE_API_NEWS_URL}/everything?q=${title}&apiKey=${import.meta.env.VITE_API_NEWS_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.articles && data.articles.length > 0) {
          setNoticia(data.articles[0]);
        }
      });
  }

  function fetchNoticiasRelacionadas(categoria: string, tituloActual: string) {
    fetch(
      `${import.meta.env.VITE_API_NEWS_URL}/everything?q=${categoria}&apiKey=${import.meta.env.VITE_API_NEWS_TOKEN}&pageSize=5`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.articles) {
          // Filtrar la noticia actual y tomar solo 3
          const filtradas = data.articles
            .filter((n: NoticiaType) => n.title !== tituloActual)
            .slice(0, 3);
          setNoticiasRelacionadas(filtradas);
        }
      });
  }

  useEffect(() => {
    if (title) {
      fetchNoticia(title as string);
    }
  }, [title]);

  useEffect(() => {
    if (category && noticia) {
      fetchNoticiasRelacionadas(category, noticia.title);
    }
  }, [category, noticia]);

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
          {noticia && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{noticia.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{noticia.description}</p>
              {noticia.urlToImage && (
                <img
                  src={noticia.urlToImage}
                  alt={noticia.title}
                  className="w-full h-auto object-cover rounded-lg shadow-md mb-6"
                />
              )}
              {noticia.content && (
                <p className="text-gray-700 leading-relaxed mb-8">{noticia.content}</p>
              )}

              {/* Sección "Te podría interesar también" */}
              {noticiasRelacionadas.length > 0 && (
                <div className="mt-12 border-t pt-8">
                  <h2 className="text-2xl font-bold mb-6">Te podría interesar también</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {noticiasRelacionadas.map((relacionada) => (
                      <Link
                        key={relacionada.title}
                        to={`/noticia/${category}/${relacionada.title.toLowerCase().replace(/ /g, "-")}`}
                        className="border shadow-sm rounded-lg p-4 bg-white hover:shadow-lg transition-shadow duration-300"
                      >
                        {relacionada.urlToImage && (
                          <img
                            src={relacionada.urlToImage}
                            alt={relacionada.title}
                            className="w-full h-48 object-cover rounded-md mb-3"
                          />
                        )}
                        <h3 className="text-lg font-semibold hover:text-blue-700 transition-colors">
                          {relacionada.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                          {relacionada.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold">
            Necesitas iniciar sesión para ver esta noticia
          </h1>
          <Link to="/login" className="text-blue-500 hover:text-blue-700">Iniciar sesión</Link>
        </div>
      )}
    </>
  );
}

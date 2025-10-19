import { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import { Link } from "react-router-dom";

interface NoticiaType {
  id: number;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

const categories = [
  {
    name: "business",
  },
  {
    name: "entertainment",
  },
  {
    name: "general",
  },
  {
    name: "health",
  },
  {
    name: "science",
  },
  {
    name: "sports",
  },
  {
    name: "technology",
  },
];

function App() {
  const [noticias, setNoticias] = useState<NoticiaType[]>([]);
  /* const [page, setPage] = useState(1); */
  const token = localStorage.getItem("token");
  const [sizePage, setSizePage] = useState(10);
  const [category, setCategory] = useState("bitcoin");
  const [autenticado, setAutenticado] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  function fetchNoticias(category: string, page: number, sizePage: number) {
    fetch(
      `${import.meta.env.VITE_API_URL}/everything?q=${category}&apiKey=${import.meta.env.VITE_TOKEN_API_NEWS}&page=${page}&pageSize=${sizePage}`
    )
      .then((response) => response.json())
      .then((data) => setNoticias(data.articles));
  }

  useEffect(() => {
    fetchNoticias("bitcoin", 1, 10);
    fetchMe();
  }, []);

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
          setRoles(
            result.data.roles.map((role: { name: string }) => role.name)
          );
        } else {
          setAutenticado(false);
        }
      })
      .catch((error) => console.error(error));
  }

  console.log(roles);
  return (
    <>
      <Navbar />
      <nav className="justify-center text-center md:flex md:justify-between items-center p-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="cursor-pointer text-sm uppercase hover:underline hover:bg-gray-200 p-2 rounded-md transition-all duration-300"
            onClick={() => {
              setCategory(category.name);
              /* setPage(1); */
              fetchNoticias(category.name, 1, 10);
            }}
          >
            {category.name}
          </button>
        ))}
      </nav>
      <h1 className="text-4xl font-bold text-center my-5 uppercase">
        Noticias de {category}
      </h1>
      <div className=" grid md:grid-cols-3 gap-4 shadow-sm rounded-lg p-4 border bg-gray-100 max-w-7xl mx-auto">
        {noticias.map((noticia: NoticiaType) => (
          <div
            key={noticia.title}
            className="border shadow-sm rounded-lg p-4 bg-white flex flex-col gap-2"
          >
            <h2 className="text-lg font-bold">{noticia.title}</h2>
            <p>{noticia.description}</p>
            <Link to={`/noticia/${noticia.title.toLowerCase().replace(/ /g, '-')}`}>
              <img src={noticia.urlToImage} alt={noticia.title} />
            </Link>
            <div>
              {autenticado && (
                <a
                  href={noticia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Ver noticia
                </a>
              )}
            </div>

            {roles.includes("admin") && (
              <time dateTime={noticia.publishedAt}>{noticia.publishedAt}</time>
            )}
          </div>
        ))}
      </div>
      <button
        className="hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300 my-20 text-center block mx-auto"
        onClick={() => {
          setSizePage(sizePage + 10);
          fetchNoticias(category, 1, sizePage + 10);
        }}
      >
        Cargar más
      </button>
    </>
  );
}

export default App;

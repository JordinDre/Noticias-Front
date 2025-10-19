import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    function fetchMe() {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
      };
      
      fetch("http://noticias.test/api/auth/me", requestOptions as RequestInit)
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
    <nav className="flex justify-around items-center p-4 bg-gray-100 ">
        <Link to="/" className="text-xl font-bold hover:text-2xl cursor-pointer transition-all duration-300">Home</Link>
        {autenticado ? (
          <button onClick={() => {
            localStorage.removeItem("token");

            fetch("http://noticias.test/api/auth/logout", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              if (response.ok) {
                localStorage.removeItem("token");
                navigate("/login");
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }} className="hover:bg-red-700 bg-red-500 text-white px-4 py-2 rounded-md transition-all duration-300">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:bg-blue-700 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300">Login</Link>
            <Link to="/register" className="hover:bg-green-700 bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-300">Register</Link>
          </>
        )}
    </nav>
  )
}

export default Navbar
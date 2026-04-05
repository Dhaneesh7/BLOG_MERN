
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
const Header = () => {
  const navigate = useNavigate();
const [user,setUser]=useState("logout")
const logout= useUserStore((state)=>state.logout)
  const handleLogout = () => {
  logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">My Blog</h1>
      <ul>
      <li> <Link to={`/`} className="text-white-500">home</Link></li>
       <li> <Link to={`/dash`} className="text-white-500">dashboard</Link></li>

      </ul>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
        user
      </button>
    </nav>
  );
};

export default Header;
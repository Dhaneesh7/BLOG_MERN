
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
// const [user,setUser]=useState("logout");
const user = useUserStore((state) => state.user);
const logout= useUserStore((state)=>state.logout);
  const handleLogout = () => {
  logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between fixed w-full">
      <h1 className="text-xl font-bold">My Blog</h1>
      <ul className="hidden md:flex gap-6">
      <li> <Link to={`/`} className="text-white-500">home</Link></li>
       {/* <li> <Link to={`/dash`} className="text-white-500">dashboard</Link></li>
       <li> <Link to={`/profile/${user._id}`} className="text-white-500">profile</Link></li> */}
  {user && (
          <>
            <li><Link to="/dash">Dashboard</Link></li>
            <li>
              <Link to={`/profile/${user._id}`}>Profile</Link>
            </li>
          </>
        )}
      </ul>
      {/* <button onClick={handleLogout} className="hidden md:flex bg-red-500 px-3 py-1 rounded">
        user
      </button> */}
        {user ? (
        <button onClick={handleLogout} className="hidden md:flex bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      ) : (
        <Link to="/login" className="hidden md:flex bg-green-500 px-3 py-1 rounded">
          Login
        </Link>
      )}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
        {menuOpen && (
          <ul className="absolute top-16 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded shadow-lg">
            <li className="mb-2">
              <Link to={`/`} className="text-white-500" onClick={() => setMenuOpen(false)}>home</Link>
            </li>
            {/* <li className="mb-2">
              <Link to={`/dash`} className="text-white-500" onClick={() => setMenuOpen(false)}>dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout} className=" px-3 py-1 rounded w-full text-left">
                user
              </button>
            </li> */}
             {user && (
            <>
              <li>
                <Link to="/dash" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </li>
              <li>
                <Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </li>
            </>
          )}

          <li>
            {user ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
          </ul>
        )}

    </nav>
  );
};

export default Header;
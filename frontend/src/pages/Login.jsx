 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserStore } from "../store/userStore";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login=useUserStore((state)=>state.login);
  const loading=useUserStore((state)=>state.loading);
const handleclear =() =>{
  setEmail("");
  setPassword("");
}

  const handleLogin = async (e) => {
    e.preventDefault();
    	console.log(email, password);
		const success=await login(email, password);
		if (success) {
    // if (email) {
      // setUser({ email });
         navigate("/dash");
      console.log("login successfull")
    }
  };

  return (
    // <div className="p-6">
      
    <div className="flex items-center justify-center min-h-screen">
      <form className="p-6 border rounded" onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold">Login</h2>
      <input className="border p-2 w-full mb-2" 
      id="email" type="email" placeholder="Email" 
      value={email}
      required
      onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 w-full mb-2" type="password" placeholder="password"
      id="password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)} />
 <button className="bg-green-500 hover:bg-red-300 w-1/3 text-white px-4 py-2"
 	disabled={loading}
  //  onClick={handleLogin}>
  >
    {loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
        
      </button>
       <button className="bg-green-500 hover:bg-red-300 w-1/3 ml-3 text-white px-4 py-2"
 	disabled={loading}
   onClick={handleclear}>
  
    {loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									clear
								</>
							)}
        
      </button>
        <p>
      {/* <p className={`mt-8 text-center text-sm  ${theme === 'dark'?'text-gray-300' : 'text-gray-800'}`}> */}
						Not a member?{" "}
						<Link to='/signup' className='font-medium text-blue-400 hover:text-blue-300'>
							Sign up now <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
      </form>
    
    </div>
  );
};

export default Login;
 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const Signup = () => {
  	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone:"",
	});
  const navigate = useNavigate();
  const signup=useUserStore((state)=>state.signup);
  console.log("signup",signup)
  const handleSignup = async(e) => {
    e.preventDefault();
    const success=await signup(formData);
   	if (success) {
			setFormData({
				name: "",
				email: "",
				password: "",
			  phone:"",
        confirmPassword: "",
			});
			navigate("/login");
		}else {
      alert("Please enter valid details!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="p-6 border rounded" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input
  type="password"
  placeholder="Confirm Password"
  onChange={(e) =>
    setFormData({ ...formData, confirmPassword: e.target.value })
  }
/>
          <input
          className="border p-2 w-full mb-2"
          type="phone"
          placeholder="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
            <button className="bg-blue-500 hover:bg-red-300 text-white px-4 py-2 w-full">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
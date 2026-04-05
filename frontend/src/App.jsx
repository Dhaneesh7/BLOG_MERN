import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import Home from "./pages/Home";
// import PostDetails from "./pages/PostDetails";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import { AuthProvider,useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Dashboard from './pages/Dashboard'
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import { useUserStore } from "./store/userStore";
import { User } from "lucide-react";
const PrivateRoute = ({ element }) => {
  const { user } = useUserStore();
  console.log("user",user)
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/home" element={<Home />} /> */}

          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/dash" element={<PrivateRoute element={<Dashboard />} />} />
          {/* <Route path="/dash" element={<Dashboard />}  /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
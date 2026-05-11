import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Login from "./pages/Login";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (token && savedRole) {
      setRole(savedRole);
      setIsLogin(true);
    } else {
      localStorage.clear();
    }
  }, []);

  return (
    <>
      {isLogin ? (
        <Dashboard setIsLogin={setIsLogin} role={role} setRole={setRole} />
      ) : (
        <Login setIsLogin={setIsLogin} setRole={setRole} />
      )}
    </>
  );
}

export default App;

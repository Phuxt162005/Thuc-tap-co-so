import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Login from "./pages/Login";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
      setIsLogin(true);
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

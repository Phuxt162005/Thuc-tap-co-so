import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import Login from "./pages/Login";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <>
      {isLogin ? (
        <Dashboard setIsLogin={setIsLogin} />
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </>
  );
}

export default App;

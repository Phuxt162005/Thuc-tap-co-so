import Dashboard from "./pages/Dashboard";
import { useState } from "react";
import Login from "./pages/Login";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  return <>{isLogin ? <Dashboard /> : <Login setIsLogin={setIsLogin} />}</>;
}

export default App;

import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import { Toaster } from "sonner";
import { Layout } from "./layout/Layout.tsx";
import { useAuthStore } from "./store/useAuthStore.tsx";
import { useEffect } from "react";

function App() {
  const { checkAuth, authUser } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

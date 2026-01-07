import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/CeoDashboard";


const Home = () => {
    return <h1>Home</h1>;
}
// Redirect component for admin users trying to access regular pages
const AdminRedirect = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "ceo") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-800">
      {/* Show navbar on all pages except signup/login */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route
                  path="/"
                  element={
                    <AdminRedirect>
                      <Home />
                    </AdminRedirect>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute adminOnly>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useLanguage } from "./context/LanguageContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const Home = () => {
  const { t } = useLanguage();
  return (
  <main className="min-h-screen pt-10 px-4 max-w-7xl mx-auto">
    <div className="text-center space-y-6">
      <span className="inline-block px-4 py-1.5 text-xs font-bold text-accent bg-green-50 rounded-full border border-green-100 uppercase tracking-widest">
        {t("levelUp")}
      </span>
      <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
        {t("heroTitle")} <span className="text-accent underline decoration-green-100 decoration-8 underline-offset-4">Learnx</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
        {t("heroSubtitle")}
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button className="px-8 py-3.5 bg-accent text-white font-bold rounded-lg shadow-lg shadow-green-200 hover:bg-green-600 hover:translate-y-[-2px] transition-all">
          {t("exploreCourses")}
        </button>
        <button className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
          {t("tryPremium")}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-20 border-t border-gray-100 mt-20">
        {[
          { label: t("activeStudents"), value: "2M+" },
          { label: t("expertInstructors"), value: "15k" },
          { label: t("onlineCourses"), value: "25k+" },
          { label: t("countriesServed"), value: "180+" },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </main>
  );
};

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

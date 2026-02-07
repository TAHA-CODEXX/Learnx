import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/CeoDashboard";
import FormateurDashboard from "./pages/FormateurDashboard";
import Home from "./pages/Home";
import AddCourse from "./pages/AddCourse";
import Wishlist from "./pages/Wishlist";
import CourseDetails from "./pages/CourseDetails";
import Checkout from "./pages/Checkout";
import Purchases from "./pages/Purchases";
import Contact from "./pages/Contact";
import MyCoursePlaceholder from "./pages/MyCoursePlaceholder";
import BecomeInstructor from "./pages/BecomeInstructor";
import Footer from "./components/Footer/Footer";
import About from "./pages/About";
import Help from "./pages/Help";
import Careers from "./pages/Careers";
import Partners from "./pages/Partners";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Sitemap from "./pages/Sitemap";
import Accessibility from "./pages/Accessibility";
import Security from "./pages/Security";


// Redirect component for admin users trying to access regular pages
const AdminRedirect = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "ceo") {
    return <Navigate to="/dashboard/ceo" replace />;
  }

  return children;
};

// Redirect component for formateur users - they don't have access to home page
const FormateurRedirect = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "formateur") {
    return <Navigate to="/dashboard/formateure" replace />;
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
          path="/become-instructor"
          element={
            <>
              <Navbar />
              <BecomeInstructor />
              <Footer />
            </>
          }
        />
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
                      <FormateurRedirect>
                        <Home />
                      </FormateurRedirect>
                    </AdminRedirect>
                  }
                />
                <Route
                  path="/dashboard/ceo"
                  element={
                    <ProtectedRoute requiredRole="ceo">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/formateure"
                  element={
                    <ProtectedRoute requiredRole="formateur">
                      <FormateurDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/instructor/add-course"
                  element={
                    <ProtectedRoute requiredRole="formateur">
                      <AddCourse />
                    </ProtectedRoute>
                  }
                />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-learning-placeholder" element={<MyCoursePlaceholder />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/security" element={<Security />} />
                <Route path="*" element={<div className="p-20 text-center">Page non trouvée (Debug: Route level)</div>} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

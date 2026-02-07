import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { isValidEmail, isEmpty } from "../utils/validation";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual Validation
        if (isEmpty(formData.email)) {
            toast.error("Please enter your email address");
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (isEmpty(formData.password)) {
            toast.error("Please enter your password");
            return;
        }

        setLoading(true);

        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            console.log("Login successful, user:", result.user);
            console.log("User role:", result.user.role);

            toast.success(`Welcome back, ${result.user.name}!`);
            setTimeout(() => {
                // Redirect based on role
                if (result.user.role === "ceo") {
                    console.log("Navigating to CEO dashboard");
                    navigate("/dashboard/ceo");
                } else if (result.user.role === "formateur") {
                    console.log("Navigating to Formateur dashboard");
                    navigate("/dashboard/formateure");
                } else {
                    console.log("Navigating to home");
                    navigate("/");
                }
            }, 1000);
        } else {
            toast.error(result.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 relative">
            <Toaster position="top-center" />
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-accent transition-colors font-medium"
            >
                <FiArrowLeft /> {"Home"}
            </Link>
            <div className="max-w-[380px] w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-7">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Welcome Back</h1>
                    <p className="text-sm text-gray-500">Log in to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-green-50/30 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-accent hover:text-green-600 transition-colors">
                        Sign Up
                    </Link>
                </p>

                <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider mb-3">Test Accounts</p>
                    <div className="space-y-1.5 text-[11px] text-gray-600">
                        <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 flex justify-between">
                            <span><strong className="text-gray-900">Ceo:</strong> admin@learnx.com</span>
                            <span className="text-gray-400 italic">admin123</span>
                        </div>
                        <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 flex justify-between">
                            <span><strong className="text-gray-900">User:</strong> user@learnx.com</span>
                            <span className="text-gray-400 italic">user123</span>
                        </div>
                        <div className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 flex justify-between">
                            <span><strong className="text-gray-900">Formateur:</strong> instructor@learnx.com</span>
                            <span className="text-gray-400 italic">formateur123</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

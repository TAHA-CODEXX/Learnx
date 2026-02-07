import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiPhone, FiGlobe, FiUser, FiArrowLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { isValidEmail, isEmpty } from "../utils/validation";

const SignUp = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        country: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Manual Validation
        if (isEmpty(formData.name)) {
            toast.error("Please enter your full name");
            return;
        }

        if (isEmpty(formData.email)) {
            toast.error("Please enter your email address");
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (isEmpty(formData.password)) {
            toast.error("Please enter a password");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        if (isEmpty(formData.phone)) {
            toast.error("Please enter your phone number");
            return;
        }

        if (isEmpty(formData.country)) {
            toast.error("Please enter your country");
            return;
        }

        setLoading(true);

        const result = await signup(formData);
        setLoading(false);

        if (result.success) {
            toast.success("Account created successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            toast.error(result.error || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 relative">
            <Toaster position="top-center" />
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-accent transition-colors font-medium"
            >
                <FiArrowLeft /> Home
            </Link>
            <div className="max-w-[400px] w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-7">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Join Learnx</h1>
                    <p className="text-sm text-gray-500">Start your journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Phone Number</label>
                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm"
                                placeholder="+1234567890"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Country</label>
                        <div className="relative">
                            <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm"
                                placeholder="USA"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-accent hover:text-green-600 transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;

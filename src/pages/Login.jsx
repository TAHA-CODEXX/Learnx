import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { FiMail, FiLock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t } = useLanguage();
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
        setLoading(true);

        if (!formData.email || !formData.password) {
            toast.error(t("allFieldsRequired"));
            setLoading(false);
            return;
        }

        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            toast.success(`${t("welcomeBackUser")}, ${result.user.name}!`);
            setTimeout(() => {
                // Redirect based on role
                if (result.user.role === "ceo") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
            }, 1000);
        } else {
            toast.error(result.error || t("loginFailed"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
            <Toaster position="top-center" />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("welcomeBack")}</h1>
                    <p className="text-sm text-gray-500">{t("loginSubtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("email")}</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-green-50/30 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t("password")}</label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-green-50/30 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? t("loggingIn") : t("login")}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    {t("dontHaveAccount")}{" "}
                    <Link to="/signup" className="font-semibold text-accent hover:text-green-600 transition-colors">
                        {t("signUp")}
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center mb-3">{t("testAccounts")}</p>
                    <div className="space-y-2 text-xs text-gray-600">
                        <div className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong className="text-accent">{t("admin")}:</strong> admin@learnx.com / admin123
                        </div>
                        <div className="bg-green-50/50 p-2 rounded border border-green-100">
                            <strong className="text-accent">{t("user")}:</strong> user@learnx.com / user123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

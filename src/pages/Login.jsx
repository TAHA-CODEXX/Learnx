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
            toast.error("Veuillez saisir votre adresse e-mail");
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error("Veuillez saisir une adresse e-mail valide");
            return;
        }

        if (isEmpty(formData.password)) {
            toast.error("Veuillez saisir votre mot de passe");
            return;
        }

        setLoading(true);

        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            console.log("Connexion réussie, utilisateur :", result.user);
            console.log("Rôle de l'utilisateur :", result.user.role);

            toast.success(`Bon retour, ${result.user.name} !`);
            setTimeout(() => {
                // Redirection basée sur le rôle
                if (result.user.role === "ceo") {
                    console.log("Navigation vers le tableau de bord CEO");
                    navigate("/dashboard/ceo");
                } else if (result.user.role === "formateur") {
                    console.log("Navigation vers le tableau de bord Formateur");
                    navigate("/dashboard/formateure");
                } else {
                    console.log("Navigation vers l'accueil");
                    navigate("/");
                }
            }, 1000);
        } else {
            toast.error(result.error || "Échec de la connexion");
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Bon Retour</h1>
                    <p className="text-sm text-gray-500">Connectez-vous pour continuer votre parcours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse E-mail</label>
                        <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-green-50/30 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                                placeholder="vous@exemple.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
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
                        {loading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/signup" className="font-semibold text-accent hover:text-green-600 transition-colors">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

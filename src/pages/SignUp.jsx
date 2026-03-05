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

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
        "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
        "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
        "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
        "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
        "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
        "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
        "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation Manuelle
        if (isEmpty(formData.name)) {
            toast.error("Veuillez saisir votre nom complet");
            return;
        }

        if (isEmpty(formData.email)) {
            toast.error("Veuillez saisir votre adresse e-mail");
            return;
        }

        if (!isValidEmail(formData.email)) {
            toast.error("Veuillez saisir une adresse e-mail valide");
            return;
        }

        if (isEmpty(formData.password)) {
            toast.error("Veuillez saisir un mot de passe");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (isEmpty(formData.phone)) {
            toast.error("Veuillez saisir votre numéro de téléphone");
            return;
        }

        if (isEmpty(formData.country)) {
            toast.error("Veuillez sélectionner votre pays");
            return;
        }

        setLoading(true);

        const result = await signup(formData);
        setLoading(false);

        if (result.success) {
            toast.success("Compte créé avec succès !");
            setTimeout(() => navigate("/login"), 1500);
        } else {
            toast.error(result.error || "Échec de l'inscription");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 relative">
            <Toaster position="top-center" />
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-accent transition-colors font-medium"
            >
                <FiArrowLeft /> Accueil
            </Link>
            <div className="max-w-[400px] w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-7">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Rejoindre Learnx</h1>
                    <p className="text-sm text-gray-500">Commencez votre parcours dès aujourd'hui</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nom Complet</label>
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
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Adresse E-mail</label>
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
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Mot de passe</label>
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
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Numéro de Téléphone</label>
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
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Pays</label>
                        <div className="relative">
                            <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm appearance-none"
                            >
                                <option value="">Choisir un pays</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 hover:shadow-lg hover:shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Création du compte..." : "S'inscrire"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Vous avez déjà un compte ?{" "}
                    <Link to="/login" className="font-semibold text-accent hover:text-green-600 transition-colors">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;

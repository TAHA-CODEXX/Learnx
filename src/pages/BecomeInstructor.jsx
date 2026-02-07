import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiCheckCircle, FiZap, FiLayers, FiUsers, FiArrowRight } from "react-icons/fi";
import { FiMonitor } from "react-icons/fi"; // Using FiMonitor instead of FaChalkboardTeacher to be safe
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BecomeInstructor = () => {
    const { user, logout } = useAuth();
    const [isConverting, setIsConverting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (isConverting && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isConverting && timeLeft === 0) {
            finishConversion();
        }
        return () => clearInterval(timer);
    }, [isConverting, timeLeft]);

    const handleBecomeFormateur = () => {
        if (!user) {
            toast.error("Veuillez vous connecter pour devenir formateur");
            navigate("/login");
            return;
        }
        setIsConverting(true);
        setTimeLeft(10);
        toast.loading("Traitement de votre demande...", { id: "conversion-toast", duration: 10000 });
    };

    const finishConversion = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: "formateur",
                    linkedin: "https://www.linkedin.com/in/taha-banouny/",
                    description: "Expert en développement Web et React."
                }),
            });

            if (!response.ok) throw new Error("Échec de la mise à jour du rôle");

            toast.success("Bienvenue dans l'équipe des formateurs !", { id: "conversion-toast" });

            setTimeout(() => {
                logout();
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de la conversion en formateur:", error);
            toast.error("Le processus a échoué. Veuillez réessayer.", { id: "conversion-toast" });
            setIsConverting(false);
        }
    };

    const features = [
        {
            icon: <FiZap className="w-6 h-6 text-accent" />,
            title: "Impact immédiat",
            description: "Partagez vos connaissances avec une communauté passionnée par la tech."
        },
        {
            icon: <FiLayers className="w-6 h-6 text-accent" />,
            title: "Méthodologie flexible",
            description: "Créez vos cours à votre rythme. Notre plateforme s'adapte à votre style."
        },
        {
            icon: <FiUsers className="w-6 h-6 text-accent" />,
            title: "Communauté de test",
            description: "Nous sommes en version de test. Votre feedback aide à construire Learnx."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative py-20 bg-gray-50 overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 mb-6 font-logo">
                        Version Test Platforme
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        Venez enseigner sur <span className="text-accent font-logo">Learnx</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Rejoignez notre plateforme de formation tech et commencez à partager votre expertise dès aujourd'hui.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Methodology Section */}
            <div className="py-24 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-logo">Notre Méthodologie</h2>
                        <div className="space-y-8">
                            <p className="text-gray-600 leading-relaxed">
                                Learnx repose sur un apprentissage pratique. Notre méthodologie favorise la clarté et l'excellence technique.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Apprentissage par la pratique (Hands-on)",
                                    "Contenu tech de haute qualité",
                                    "Parcours pédagogiques structurés"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <FiCheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className={`p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow`}>
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conversion Section */}
            <div className="py-24 bg-gray-900 text-white">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-accent/20 rounded-full mb-8">
                        <FiMonitor className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-logo">Prêt à enseigner ?</h2>
                    <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
                        En version de test, devenez formateur en un clic. D'autres rôles arriveront prochainement.
                    </p>

                    <div className="max-w-md mx-auto">
                        {!user && (
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
                            >
                                Connectez-vous pour commencer
                            </button>
                        )}

                        {user?.role === "user" && !isConverting && (
                            <div className="p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                                <p className="text-accent font-bold uppercase tracking-widest text-sm mb-2 font-logo">Collaborateur</p>
                                <button
                                    onClick={handleBecomeFormateur}
                                    className="group w-full py-4 bg-accent hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                                >
                                    <span>Devenir Collaborateur</span>
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {isConverting && (
                            <div className="p-8 bg-amber-500/10 backdrop-blur-sm rounded-3xl border border-amber-500/20 flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-3xl font-bold text-amber-500">{timeLeft}s restants</p>
                            </div>
                        )}

                        {(user?.role === "formateur" || user?.role === "ceo") && (
                            <div className="p-8 bg-green-500/10 backdrop-blur-sm rounded-3xl border border-green-500/20">
                                <p className="text-accent font-bold mb-4 font-logo">Accès Autorisé</p>
                                <button
                                    onClick={() => navigate(user.role === "ceo" ? "/dashboard/ceo" : "/dashboard/formateure")}
                                    className="w-full py-4 bg-accent hover:bg-green-600 text-white rounded-xl font-bold transition-all"
                                >
                                    Accéder au Dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomeInstructor;

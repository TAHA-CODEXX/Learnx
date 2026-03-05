import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FiCheckCircle, FiZap, FiLayers, FiUsers, FiArrowRight } from "react-icons/fi";
import { FiMonitor } from "react-icons/fi"; // Using FiMonitor instead of FaChalkboardTeacher to be safe
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BecomeInstructor = () => {
    const { user, logout } = useAuth();
    const [step, setStep] = useState(1); // 1: Instructions, 2: Upload CV, 3: Pending
    const [isUploading, setIsUploading] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Veuillez vous connecter pour accéder à cette page.");
            navigate("/login");
            return;
        }
        if (user?.status === "pending") {
            setStep(3);
        }
    }, [user, navigate]);

    const handleNextStep = () => {
        setStep(2);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            setCvFile(file);
        } else {
            toast.error("Veuillez télécharger un fichier PDF ou DOCX uniquement.");
        }
    };

    const handleUploadCV = async () => {
        if (!user) {
            toast.error("Session expirée. Veuillez vous reconnecter.");
            navigate("/login");
            return;
        }

        if (!cvFile) {
            toast.error("Veuillez sélectionner votre CV.");
            return;
        }

        setIsUploading(true);
        const loadingToast = toast.loading("Téléchargement de votre CV...");

        try {
            // 1. Upload the file
            const formData = new FormData();
            formData.append("file", cvFile);

            const uploadRes = await fetch("http://localhost:5000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Échec du téléchargement du fichier");
            const { filePath } = await uploadRes.json();

            // 2. Update user status and cvPath
            const updateRes = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "pending",
                    cvPath: filePath,
                    requestDate: new Date().toISOString()
                }),
            });

            if (!updateRes.ok) throw new Error("Échec de la mise à jour du profil");

            toast.success("Demande envoyée avec succès !", { id: loadingToast });
            setStep(3);

            // Note: We don't automatically logout here yet, we let them see the pending state.
            // But they will need to relogin after acceptance to get the new role.
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Une erreur est survenue lors de l'envoi de votre demande.", { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    const instructions = [
        {
            title: "Expertise Technique",
            desc: "Vous devez maîtriser parfaitement les sujets que vous enseignez."
        },
        {
            title: "Qualité Pédagogique",
            desc: "Vos cours doivent être structurés, clairs et orientés vers la pratique."
        },
        {
            title: "Engagement",
            desc: "Répondre aux questions des étudiants et mettre à jour vos contenus régulièrement."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-accent text-white" : "bg-white text-gray-400 border-2 border-gray-200"}`}>
                            {s}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-logo">Devenir Collaborateur</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Rejoignez l'élite des formateurs tech. Voici les règles et responsabilités pour collaborer avec nous :
                            </p>

                            <div className="grid gap-6 mb-10">
                                {instructions.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-5 bg-green-50/30 rounded-2xl border border-green-50/50">
                                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0">
                                            <FiCheckCircle />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleNextStep}
                                className="w-full py-4 bg-accent hover:bg-green-600 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3"
                            >
                                J'ai compris, suivant
                                <FiArrowRight />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-logo">Soumettez votre CV</h2>
                            <p className="text-gray-600 mb-8">
                                Pour valider votre profil, nous avons besoin de consulter votre parcours professionnel.
                            </p>

                            <div className="border-3 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-accent/50 transition-colors bg-gray-50/50 mb-8">
                                <FiZap className="w-12 h-12 text-accent mx-auto mb-4 opacity-50" />
                                <input
                                    type="file"
                                    id="cv-upload"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.docx"
                                />
                                <label htmlFor="cv-upload" className="block cursor-pointer">
                                    <span className="text-lg font-bold text-gray-900">
                                        {cvFile ? cvFile.name : "Cliquez pour uploader votre CV"}
                                    </span>
                                    <p className="text-sm text-gray-500 mt-1">Format PDF ou DOCX uniquement</p>
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
                                >
                                    Retour
                                </button>
                                <button
                                    onClick={handleUploadCV}
                                    disabled={!cvFile || isUploading}
                                    className="flex-1 py-4 bg-accent hover:bg-green-600 text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? "Envoi en cours..." : "Soumettre ma candidature"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                                <FiZap className="animate-pulse" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-logo">Candidature en attente</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                                Merci de votre intérêt ! Votre candidature est actuellement en cours d'examen par notre équipe (Statut : <span className="text-amber-600 font-bold italic">EN ATTENTE</span>).
                            </p>
                            <p className="text-sm text-gray-500 mb-10">
                                Vous ne pouvez pas renvoyer d'invitation. Veuillez attendre la confirmation du CEO. Nous vous contacterons par e-mail dès qu'une décision sera prise.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-10 py-4 bg-accent hover:bg-green-600 text-white rounded-2xl font-bold transition-all"
                            >
                                Retour à l'accueil
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BecomeInstructor;

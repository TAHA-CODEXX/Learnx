import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiArrowLeft,
    FiUploadCloud,
    FiCheck,
    FiInfo,
    FiDollarSign,
    FiBookOpen,
    FiLayers,
    FiLoader,
    FiX,
    FiTag
} from "react-icons/fi";
import { uploadToCloudinary } from "../services/cloudinaryService";
import toast from "react-hot-toast";
import { isEmpty } from "../utils/validation";

const AddCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Categories must match exactly with Home.jsx filter categories
    const categories = [
        "Développement Logiciel",
        "Développement Mobile",
        "DevOps",
        "IA & Machine Learning",
        "Cloud Computing",
        "Cybersécurité",
        "Blockchain"
    ];

    const [formData, setFormData] = useState({
        skills: "",
        moreabout: "",
        image: ""
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Visual preview before upload
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image: imageUrl }));
            toast.success("Image téléchargée sur le cloud !");
        } catch (error) {
            toast.error("Échec du téléchargement Cloudinary. Assurez-vous d'avoir un preset non signé 'ml_default'.");
            setPreviewImage(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation Personnalisée
        if (isEmpty(formData.title)) {
            return toast.error("Veuillez saisir un titre pour le cours");
        }

        if (isEmpty(formData.shortDesc)) {
            return toast.error("Veuillez saisir une description pour le cours");
        }

        if (isEmpty(formData.image)) {
            return toast.error("Veuillez d'abord télécharger une image de cours");
        }

        if (isEmpty(formData.category)) {
            return toast.error("Veuillez sélectionner une catégorie pour votre cours");
        }

        if (isEmpty(formData.skills)) {
            return toast.error("Veuillez saisir quelques compétences pour le cours");
        }

        if (isEmpty(formData.moreabout)) {
            return toast.error("Veuillez saisir des détails pour 'Ce que vous apprendrez'");
        }

        if (isEmpty(formData.price)) {
            return toast.error("Veuillez saisir un prix pour le cours");
        }

        setPublishing(true);

        const courseData = {
            ...formData,
            instructorId: user.id,
            instructorName: user.name,
            instructorAvatar: user.avatar,
            skills: formData.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
            moreabout: formData.moreabout.split("\n").map(s => s.trim()).filter(s => s !== ""),
            likes: 0,
            students: 0,
            price: Number(formData.price),
            createdAt: new Date().toISOString()
        };

        try {
            const response = await fetch("http://localhost:5000/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(courseData)
            });

            if (response.ok) {
                toast.success("Félicitations ! Votre cours est maintenant en ligne.");
                navigate("/dashboard/formateure");
            } else {
                throw new Error("Failed to save course");
            }
        } catch (error) {
            toast.error("Échec de la publication du cours. Veuillez réessayer.");
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-6 py-4 shadow-sm">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        >
                            <FiArrowLeft className="text-gray-600 group-hover:-translate-x-1 transition-transform" size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Créer un Nouveau Cours</h1>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Étape 1 sur 1 : Informations sur le cours</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            form="add-course-form"
                            type="submit"
                            disabled={uploading || publishing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${publishing ? 'bg-gray-100 text-gray-400' : 'bg-accent text-white hover:bg-green-600 hover:shadow-lg hover:shadow-green-100'
                                }`}
                        >
                            {publishing ? (
                                <><FiLoader className="animate-spin" /> Publication...</>
                            ) : (
                                "Publier le Cours"
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <form id="add-course-form" onSubmit={handleSubmit} className="space-y-8" noValidate>

                            {/* Section 1: Basic Info */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FiInfo size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Informations de base</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Titre du Cours</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                                            placeholder="ex. Maîtrisez le Design UI Moderne avec Figma"
                                        />
                                        <p className="mt-2 text-xs text-gray-400">Le titre doit être accrocheur et expliquer exactement ce que les étudiants apprendront.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Description du Cours</label>
                                        <textarea
                                            value={formData.shortDesc}
                                            onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                                            rows="4"
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                                            placeholder="Présentez votre cours en quelques phrases..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Media */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <FiUploadCloud size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Miniature du Cours</h2>
                                </div>

                                <div className="relative group">
                                    <div className={`relative border-2 border-dashed rounded-3xl overflow-hidden transition-all duration-300 ${previewImage ? 'border-accent' : 'border-gray-200 hover:border-accent hover:bg-gray-50/50'
                                        }`}>
                                        {previewImage ? (
                                            <div className="relative aspect-video w-full">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                                    <div className="flex gap-3">
                                                        <label className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                            Modifier l'image
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => { setPreviewImage(null); setFormData({ ...formData, image: "" }); }}
                                                            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                                        >
                                                            <FiX size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                                        <FiLoader className="animate-spin text-accent mb-2" size={30} />
                                                        <p className="text-sm font-bold text-gray-900 text-center px-4">Cloudinary est magique... <br />Téléchargement de votre image</p>
                                                    </div>
                                                )}
                                                {formData.image && !uploading && (
                                                    <div className="absolute top-4 right-4 bg-accent text-white p-1.5 rounded-full">
                                                        <FiCheck size={16} />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center py-20 cursor-pointer">
                                                <div className="w-16 h-16 bg-green-50 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <FiUploadCloud size={28} />
                                                </div>
                                                <p className="text-base font-bold text-gray-900">Déposez votre image de cours ici</p>
                                                <p className="text-sm text-gray-400 mt-1">PNG, JPG ou WebP (Recommandé 16:9)</p>
                                                <div className="mt-6 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg uppercase tracking-wide">
                                                    Parcourir les fichiers
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Category Selection */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FiTag size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Catégorie du Cours</h2>
                                    <span className="text-xs font-bold text-red-500">* Requis</span>
                                </div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sélectionnez la catégorie du cours <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900 font-semibold appearance-none cursor-pointer pr-10"
                                    >
                                        <option value="">-- Choisissez une catégorie --</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">Cette catégorie sera utilisée pour filtrer les cours sur la page d'accueil.</p>
                            </div>

                            {/* Section 4: Details & Pricing */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                            <FiLayers size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">Tags du Programme</h2>
                                    </div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Compétences (séparez par des virgules)</label>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900"
                                        placeholder="React, Next.js, API Design..."
                                    />
                                </div>

                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                            <FiDollarSign size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">Stratégie de Prix</h2>
                                    </div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prix Cible ($)</label>
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900 font-bold"
                                            placeholder="99"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: More About (What you'll learn) */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <FiCheck size={18} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">Ce que les étudiants apprendront</h2>
                                </div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Points Détaillés (un par ligne)</label>
                                <textarea
                                    value={formData.moreabout}
                                    onChange={(e) => setFormData({ ...formData, moreabout: e.target.value })}
                                    rows="6"
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
                                    placeholder="Point 1 : Maîtrisez les bases...&#10;Point 2 : Créez des projets incroyables...&#10;Point 3 : Prêt pour des emplois dans l'industrie..."
                                ></textarea>
                                <p className="mt-2 text-xs text-gray-400">Ces points apparaîtront dans la section "Ce que vous apprendrez" de la page de détails.</p>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar: Course Preview Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
                                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                                    {previewImage ? (
                                        <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FiBookOpen size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600">
                                        Aperçu
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        {formData.category && (
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                                                {formData.category}
                                            </span>
                                        )}
                                        {formData.skills.split(",").slice(0, 2).map((skill, i) => (
                                            skill.trim() && (
                                                <span key={i} className="px-2 py-0.5 bg-green-50 text-accent text-[10px] font-bold rounded-md">
                                                    {skill.trim()}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 leading-tight min-h-[44px]">
                                        {formData.title || "Le titre de votre cours apparaîtra ici"}
                                    </h3>
                                    <div className="flex items-center gap-3 pt-2">
                                        <img src={user?.avatar} className="w-8 h-8 rounded-full object-cover bg-gray-100" />
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">{user?.name}</p>
                                            <p className="text-gray-400">Instructeur Principal</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-xl font-black text-gray-900">${formData.price || "0"}</span>
                                        <button disabled className="px-4 py-2 bg-accent/10 text-accent text-xs font-bold rounded-xl">
                                            Aperçu en direct
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                                <h4 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
                                    <FiInfo /> Conseils de Publication
                                </h4>
                                <ul className="text-amber-700/80 text-xs space-y-2 font-medium">
                                    <li>• La taille de l'image doit être d'au moins 1280x720.</li>
                                    <li>• Gardez votre titre en dessous de 60 caractères.</li>
                                    <li>• N'oubliez pas d'ajouter des tags pertinents.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;

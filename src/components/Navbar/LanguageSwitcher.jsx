import { useState, useRef, useEffect } from "react";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, changeLanguage } = useLanguage();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
    ];

    const currentLanguage = languages.find((lang) => lang.code === language);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all flex items-center gap-1"
                title="Language"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <FiGlobe className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Language
                        </p>
                    </div>
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    changeLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${language === lang.code
                                        ? "bg-green-50 text-accent font-semibold"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </div>
                                {language === lang.code && (
                                    <FiCheck className="h-4 w-4 text-accent" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;

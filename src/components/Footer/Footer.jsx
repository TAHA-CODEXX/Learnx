import { Link } from "react-router-dom";
import { FaLinkedin, FaFacebook, FaInstagram, FaGlobe } from "react-icons/fa";
import Logo from "../Navbar/Logo";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Ressources",
            links: [
                { label: "Centre d'aide", path: "/help" },
                { label: "Devenir Formateur", path: "/become-instructor" }
            ],
        },
        {
            title: "Entreprise",
            links: [
                { label: "À propos", path: "/about" },
                { label: "Carrières", path: "/careers" },
                { label: "Partenaires", path: "/partners" },
                { label: "Contactez-nous", path: "/contact" },
            ],
        },
        {
            title: "Juridique",
            links: [
                { label: "Conditions d'utilisation", path: "/terms" },
                { label: "Politique de confidentialité", path: "/privacy" },
                { label: "Plan du site", path: "/sitemap" },
            ],
        },
    ];

    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Logo />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mb-8">
                            Learnx est la plateforme leader de formation en ligne, dédiée à l'apprentissage des compétences tech de demain. Rejoignez des milliers d'étudiants et transformez votre carrière.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-6">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-600 hover:text-accent text-sm transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} Learnx, Inc. Tous droits réservés.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-accent text-sm font-medium transition-colors">
                            <FaGlobe size={16} />
                            <span>Français</span>
                        </button>
                        <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                            <Link to="/accessibility" className="hover:text-gray-600">Accessibilité</Link>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <Link to="/security" className="hover:text-gray-600">Sécurité</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

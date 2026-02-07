import React from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StaticPage = ({ title, description, content }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 border-b border-gray-100 py-16 md:py-24">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
                        <Link to="/" className="hover:text-accent flex items-center gap-1 transition-colors">
                            <FiHome className="text-lg" /> Accueil
                        </Link>
                        <FiChevronRight className="text-gray-300" />
                        <span className="text-gray-900 font-semibold">{title}</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-logo tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 md:py-24">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl prose prose-slate prose-green lg:prose-lg">
                        {content || (
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre Vision</h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        Ceci est une page informative pour {title}. Nous travaillons activement pour vous fournir le meilleur contenu possible.
                                    </p>
                                </section>

                                <section className="bg-green-50 rounded-2xl p-8 border border-green-100">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Informations Clés</h3>
                                    <p className="text-gray-700">
                                        Learnx s'engage à la transparence et à l'excellence. Cette page contient des informations importantes concernant nos opérations et nos politiques.
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2">Service Client</h4>
                                        <p className="text-gray-600 text-sm">Notre équipe est disponible 24/7 pour répondre à vos questions concernant {title.toLowerCase()}.</p>
                                    </div>
                                    <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-2">Mises à jour</h4>
                                        <p className="text-gray-600 text-sm">Nous mettons régulièrement à jour nos contenus pour refléter l'évolution de nos services.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaticPage;

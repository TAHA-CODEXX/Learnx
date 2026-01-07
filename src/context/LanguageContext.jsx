import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
    en: {
        // Navbar
        searchPlaceholder: "Search courses by title or domain...",
        login: "Log in",
        joinFree: "Join for Free",
        logout: "Log Out",

        // User Dropdown
        profile: "Profile",
        myPurchases: "My Purchases",
        settings: "Settings",
        updates: "Updates",
        accomplishments: "Accomplishments",
        helpCenter: "Help Center",
        getPlus: "Get Plus",
        unlockCourses: "Unlock 7,000+ courses and certificates.",
        upgradeNow: "Upgrade Now",

        // Home Page
        levelUp: "Level up your future",
        heroTitle: "Master new skills with",
        heroSubtitle: "Choose from over 210,000 online video courses with new additions published every month.",
        exploreCourses: "Explore Courses",
        tryPremium: "Try Premium for $0",
        activeStudents: "Active Students",
        expertInstructors: "Expert Instructors",
        onlineCourses: "Online Courses",
        countriesServed: "Countries Served",

        // Auth
        welcomeBack: "Welcome Back",
        loginSubtitle: "Log in to continue learning",
        joinLearnx: "Join Learnx",
        signupSubtitle: "Create your account to start learning",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        country: "Country",
        allFieldsRequired: "All fields are required",
        passwordMin: "Password must be at least 6 characters",
        accountCreated: "Account created successfully! Please log in.",
        signupFailed: "Signup failed. Please try again.",
        welcomeBackUser: "Welcome back",
        loginFailed: "Login failed. Please try again.",
        invalidCredentials: "Invalid email or password",
        alreadyHaveAccount: "Already have an account?",
        dontHaveAccount: "Don't have an account?",
        signUp: "Sign up",
        loggingIn: "Logging in...",
        creatingAccount: "Creating account...",
        testAccounts: "Test Accounts:",
        admin: "Admin",
        user: "User",

        // Dashboard
        adminDashboard: "Admin Dashboard",
        totalUsers: "Total Users",
        activeCourses: "Active Courses",
        revenue: "Revenue",
        growth: "Growth",
        recentActivity: "Recent Activity",
        topCourses: "Top Courses",
        userEnrolled: "User enrolled in",
        course: "Course",
        hoursAgo: "hours ago",
        students: "students",
    },
    fr: {
        // Navbar
        searchPlaceholder: "Rechercher des cours par titre ou domaine...",
        login: "Se connecter",
        joinFree: "Rejoindre gratuitement",
        logout: "Se déconnecter",

        // User Dropdown
        profile: "Profil",
        myPurchases: "Mes achats",
        settings: "Paramètres",
        updates: "Mises à jour",
        accomplishments: "Réalisations",
        helpCenter: "Centre d'aide",
        getPlus: "Obtenir Plus",
        unlockCourses: "Débloquez 7 000+ cours et certificats.",
        upgradeNow: "Mettre à niveau",

        // Home Page
        levelUp: "Améliorez votre avenir",
        heroTitle: "Maîtrisez de nouvelles compétences avec",
        heroSubtitle: "Choisissez parmi plus de 210 000 cours vidéo en ligne avec de nouveaux ajouts publiés chaque mois.",
        exploreCourses: "Explorer les cours",
        tryPremium: "Essayer Premium pour 0€",
        activeStudents: "Étudiants actifs",
        expertInstructors: "Instructeurs experts",
        onlineCourses: "Cours en ligne",
        countriesServed: "Pays desservis",

        // Auth
        welcomeBack: "Bon retour",
        loginSubtitle: "Connectez-vous pour continuer à apprendre",
        joinLearnx: "Rejoindre Learnx",
        signupSubtitle: "Créez votre compte pour commencer à apprendre",
        email: "Email",
        password: "Mot de passe",
        fullName: "Nom complet",
        phoneNumber: "Numéro de téléphone",
        country: "Pays",
        allFieldsRequired: "Tous les champs sont requis",
        passwordMin: "Le mot de passe doit contenir au moins 6 caractères",
        accountCreated: "Compte créé avec succès ! Veuillez vous connecter.",
        signupFailed: "Échec de l'inscription. Veuillez réessayer.",
        welcomeBackUser: "Bon retour",
        loginFailed: "Échec de la connexion. Veuillez réessayer.",
        invalidCredentials: "Email ou mot de passe invalide",
        alreadyHaveAccount: "Vous avez déjà un compte ?",
        dontHaveAccount: "Vous n'avez pas de compte ?",
        signUp: "S'inscrire",
        loggingIn: "Connexion en cours...",
        creatingAccount: "Création du compte...",
        testAccounts: "Comptes de test :",
        admin: "Administrateur",
        user: "Utilisateur",

        // Dashboard
        adminDashboard: "Tableau de bord administrateur",
        totalUsers: "Utilisateurs totaux",
        activeCourses: "Cours actifs",
        revenue: "Revenu",
        growth: "Croissance",
        recentActivity: "Activité récente",
        topCourses: "Meilleurs cours",
        userEnrolled: "Utilisateur inscrit à",
        course: "Cours",
        hoursAgo: "il y a",
        students: "étudiants",
    },
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("learnx_language") || "en";
    });

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("learnx_language", lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

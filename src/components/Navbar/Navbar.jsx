import Logo from "./Logo";
import SearchInput from "./SearchInput";
import NavActions from "./NavActions";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === "/";

    // Hide navbar for formateur role - they don't have access to see the home page
    if (user?.role === "formateur") {
        return null;
    }

    // Admin navbar: Only logo and specific actions
    if (user?.role === "ceo") {
        const handleLogout = () => {
            logout();
            navigate("/");
        };

        return (
            <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center gap-6">
                            <Logo />
                            <div className="hidden md:flex gap-4">
                                <Link
                                    to="/dashboard/ceo"
                                    className="text-sm font-medium text-gray-600 hover:text-accent transition-colors"
                                >
                                    Tableau de bord
                                </Link>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Regular user navbar: Full navbar
    return (
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4 md:gap-8">
                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Center: Search - Only show on home page */}
                    <div className="flex-1 flex justify-center">
                        {isHomePage && <SearchInput />}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-shrink-0">
                        <NavActions />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

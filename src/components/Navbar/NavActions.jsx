import { FiHeart, FiLayout } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserDropdown from "./UserDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";

const NavActions = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-2 md:gap-5">
            {/* Show dashboard icon only for admin */}
            {user?.role === "ceo" && (
                <Link
                    to="/dashboard"
                    className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all"
                    title="Dashboard"
                >
                    <FiLayout className="h-5 w-5" />
                </Link>
            )}

            <button className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all hidden sm:block" title="Wishlist">
                <FiHeart className="h-5 w-5" />
            </button>

            <LanguageSwitcher />

            {user ? (
                <UserDropdown />
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent transition-colors hidden sm:block"
                    >
                        {t("login")}
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2 text-sm font-semibold bg-accent text-white rounded-md hover:bg-green-600 shadow-sm transition-all"
                    >
                        {t("joinFree")}
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavActions;

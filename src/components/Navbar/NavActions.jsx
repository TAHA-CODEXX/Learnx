import { FiHeart, FiLayout } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import UserDropdown from "./UserDropdown";

const NavActions = () => {
    const { user } = useAuth();
    const wishlistCount = useSelector((state) => state.wishlist.items.length);

    return (
        <div className="flex items-center gap-2 md:gap-5">
            {/* Show dashboard icon only for admin */}
            {user?.role === "ceo" && (
                <Link
                    to="/dashboard/ceo"
                    className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all"
                    title="Dashboard"
                >
                    <FiLayout className="h-5 w-5" />
                </Link>
            )}

            <Link
                to="/wishlist"
                className="p-2 text-gray-600 hover:text-accent hover:bg-gray-50 rounded-full transition-all relative"
                title="Wishlist"
            >
                <FiHeart className="h-5 w-5" />
                {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            {user ? (
                <UserDropdown />
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-accent transition-colors hidden sm:block"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2 text-sm font-semibold bg-accent text-white rounded-md hover:bg-green-600 shadow-sm transition-all"
                    >
                        Join Free
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavActions;

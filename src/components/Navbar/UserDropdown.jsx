import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FiShoppingBag, FiHelpCircle, FiLogOut, FiUserCheck
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);
    const { user, logout } = useAuth();
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
        setIsConverting(true);
        setTimeLeft(10);
        toast.loading("Processing your request...", { id: "conversion-toast", duration: 10000 });
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
                    description: "Expert in Web Development and React."
                }),
            });

            if (!response.ok) throw new Error("Failed to update role");

            toast.success("Welcome to our formateur team!", { id: "conversion-toast" });

            setTimeout(() => {
                logout();
            }, 2000);
        } catch (error) {
            console.error("Error becoming formateur:", error);
            toast.error("Process failed. Please try again.", { id: "conversion-toast" });
            setIsConverting(false);
        }
    };

    const menuItems = [
        { icon: <FiShoppingBag />, label: "My Purchases", link: "/purchases" },
        { icon: <FiHelpCircle />, label: "Help Support", link: "/contact" },
    ];

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-accent rounded-full p-0.5 transition-all"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-gray-200"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-bottom border-gray-100 mb-2">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-accent transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-2 border-t border-gray-100 pt-2">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut className="text-lg" />
                            Logout
                        </button>
                    </div>

                    {user.role === "user" && !isConverting && (
                        <div className="mx-4 mt-3 mb-1 p-3 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Become a Collaborator</p>
                            <p className="text-[10px] text-green-600 mb-2">Share your knowledge and earn with us.</p>
                            <button
                                onClick={handleBecomeFormateur}
                                className="w-full py-1.5 text-xs font-semibold bg-accent text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                Be a Collaborator
                            </button>
                        </div>
                    )}

                    {isConverting && (
                        <div className="mx-4 mt-3 mb-1 p-3 bg-amber-50 rounded-lg border border-amber-100 flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">Processing...</p>
                            <p className="text-sm font-bold text-amber-600">{timeLeft}s remaining</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDropdown;

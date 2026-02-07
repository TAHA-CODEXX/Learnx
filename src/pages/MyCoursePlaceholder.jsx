import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLoader, FiCoffee } from "react-icons/fi";

const MyCoursePlaceholder = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/purchases");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-green-100 mb-8 overflow-hidden">
                        <FiCoffee size={40} className="text-accent animate-bounce" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Course is Ready!</h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        We are currently preparing your learning environment. You're being redirected to the home page to start your journey.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-4 justify-center">
                    <FiLoader className="text-accent animate-spin" size={20} />
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                        Redirecting in 5 seconds...
                    </p>
                </div>

                <button
                    onClick={() => navigate("/Purchases")}
                    className="text-sm font-bold text-gray-400 hover:text-accent transition-colors underline underline-offset-4"
                >
                    Prefer not to wait? Click here to skip.
                </button>
            </div>
        </div>
    );
};

export default MyCoursePlaceholder;

import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-logo font-bold text-gray-900 tracking-tight">
                Learn<span className="text-accent group-hover:text-green-600 transition-colors">x</span>
            </span>
        </Link>
    );
};

export default Logo;

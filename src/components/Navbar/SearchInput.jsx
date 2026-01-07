import { FiSearch } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

const SearchInput = () => {
    const { t } = useLanguage();

    return (
        <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-accent transition-colors " />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-gray-900"
                placeholder={t("searchPlaceholder")}
            />
        </div>
    );
};

export default SearchInput;

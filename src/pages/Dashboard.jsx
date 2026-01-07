import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const Dashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    const stats = [
        { icon: <FiUsers />, label: t("totalUsers"), value: "12,458", change: "+12%" },
        { icon: <FiBookOpen />, label: t("activeCourses"), value: "1,247", change: "+8%" },
        { icon: <FiDollarSign />, label: t("revenue"), value: "$48,392", change: "+23%" },
        { icon: <FiTrendingUp />, label: t("growth"), value: "34%", change: "+5%" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t("adminDashboard")}</h1>
                    <p className="text-gray-500 mt-1">{t("welcomeBackUser")}, {user?.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-lg text-accent text-2xl">
                                    {stat.icon}
                                </div>
                                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">{t("recentActivity")}</h2>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-accent font-semibold">
                                        U{i}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">{t("userEnrolled")} React Course</p>
                                        <p className="text-xs text-gray-500">2 {t("hoursAgo")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">{t("topCourses")}</h2>
                        <div className="space-y-4">
                            {["React Masterclass", "Python for Beginners", "UI/UX Design", "Data Science"].map((course, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{course}</p>
                                        <p className="text-xs text-gray-500">{Math.floor(Math.random() * 500 + 100)} {t("students")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-accent">${Math.floor(Math.random() * 50 + 20)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

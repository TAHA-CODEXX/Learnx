import { useState, useEffect } from "react";
import { FiBookOpen, FiPlayCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";

const Purchases = () => {
    const { user } = useAuth();
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Fetch both courses and purchases
                const [coursesRes, purchasesRes] = await Promise.all([
                    fetch(`http://localhost:5000/courses?_t=${Date.now()}`),
                    fetch(`http://localhost:5000/purchases?_t=${Date.now()}`)
                ]);

                if (!coursesRes.ok || !purchasesRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const allCourses = await coursesRes.json();
                const allPurchases = await purchasesRes.json();

                // Get courses owned by the current user
                const userPurchaseIds = allPurchases
                    .filter(p => p.userId === user.id)
                    .map(p => p.courseId);

                const ownedCourses = allCourses.filter(course => userPurchaseIds.includes(course.id));

                setPurchasedCourses(ownedCourses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching purchases:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
                        <p className="text-gray-500">All courses you've successfully enrolled in.</p>
                    </div>
                    <Link
                        to="/"
                        className="px-6 py-2.5 bg-gray-50 text-gray-900 font-bold rounded-xl border border-gray-100 hover:bg-gray-100 transition-all"
                    >
                        Browse More
                    </Link>
                </div>

                {purchasedCourses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <FiBookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Purchased Yet</h3>
                        <p className="text-gray-500 mb-8 text-center max-w-md mx-auto">
                            You haven't purchased any courses yet. Start your learning journey by exploring our wide range of courses!
                        </p>
                        <Link
                            to="/"
                            className="px-8 py-3.5 bg-accent text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg active:scale-95"
                        >
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pass ownedCourseIds for consistency and to show "Continue Learning" */}
                        <CourseCard
                            courses={purchasedCourses}
                            ownedCourseIds={purchasedCourses.map(c => c.id)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Purchases;

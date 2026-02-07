import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiHeart } from "react-icons/fi";

const Wishlist = () => {
    const wishlistItems = useSelector((state) => state.wishlist.items) || [];
    const [ownedCourseIds, setOwnedCourseIds] = useState([]);

    useEffect(() => {
        const fetchOwned = async () => {
            const userJson = localStorage.getItem("learnx_user");
            if (userJson) {
                const user = JSON.parse(userJson);
                try {
                    const response = await fetch(`http://localhost:5000/purchases?userId=${user.id}`);
                    if (response.ok) {
                        const purchases = await response.json();
                        setOwnedCourseIds(purchases.map(p => p.courseId));
                    }
                } catch (error) {
                    console.error("Error fetching owned courses:", error);
                }
            }
        };
        fetchOwned();
    }, []);

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
                        <p className="text-gray-500">You have {wishlistItems.length} courses in your wishlist</p>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors font-medium border border-gray-100 px-4 py-2 rounded-xl"
                    >
                        <FiArrowLeft /> Back to Home
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Explore our courses and save your favorites!</p>
                        <Link
                            to="/"
                            className="px-8 py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95"
                        >
                            Explore Courses
                        </Link>
                    </div>
                ) : (
                    <CourseCard courses={wishlistItems} ownedCourseIds={ownedCourseIds} />
                )}
            </div>
        </div>
    );
};

export default Wishlist;

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiClock,
    FiGlobe,
    FiCheck,
    FiUsers,
    FiHeart,
    FiInfo,
    FiAward,
    FiPlayCircle,
    FiSmartphone,
    FiRepeat,
    FiLinkedin
} from "react-icons/fi";
import CourseCard from "../components/CourseCard";
import { COLORS } from "../styles/constants";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Fetch course details
                const courseRes = await fetch(`http://localhost:5000/courses/${id}`);
                const courseData = await courseRes.json();
                setCourse(courseData);

                // Fetch instructor details
                if (courseData.instructorId) {
                    const instRes = await fetch(`http://localhost:5000/users/${courseData.instructorId}`);
                    const instData = await instRes.json();
                    setInstructor(instData);
                }

                // Fetch related courses in same category
                const relatedRes = await fetch(`http://localhost:5000/courses?category=${courseData.category}&id_ne=${id}&_limit=3`);
                const relatedData = await relatedRes.json();
                setRelatedCourses(relatedData);

            } catch (error) {
                console.error("Error fetching course details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
                <FiInfo size={64} className="text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
                <Link to="/" className="mt-4 text-accent hover:underline font-semibold">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-inter">
            {/* Dark Hero Section */}
            <div className="bg-[#1c1d1f] text-white py-12 px-4">
                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm font-bold text-accent">
                            <Link to="/" className="hover:text-green-400">Development</Link>
                            <span>&gt;</span>
                            <span className="text-white/80">{course.category}</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-normal">
                            {course.shortDesc}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1.5 text-yellow-400">
                                <span className="font-bold underline cursor-pointer">4.7 ★★★★★</span>
                                <span className="text-white/60">(408,397 ratings)</span>
                            </span>
                            <span className="text-white/60">{course.students || 0} students</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <p>Created by <span className="text-green-400">{course.instructorName}</span> </p>
                            <div className="flex items-center gap-4 text-white/80">
                                <span className="flex items-center gap-1.5"><FiClock size={16} /> Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><FiGlobe size={16} /> English</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-4 py-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* What you'll learn */}
                        <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                {course.moreabout && course.moreabout.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 text-sm text-gray-700 leading-normal">
                                        <FiCheck className="mt-1 text-gray-400 shrink-0" size={16} />
                                        <span>{item}</span>
                                    </div>
                                ))}
                                {!course.moreabout && (
                                    <p className="text-gray-500 italic text-sm">No specific details listed for this course yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                <p>{course.shortDesc}</p>
                            </div>
                        </div>                        {/* Instructor Profile (Dashboard Style) */}
                        {instructor && (
                            <div className="space-y-6 pt-4 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900">Instructor</h2>
                                <div>
                                    <h3 className="text-xl font-bold text-accent underline mb-1">{instructor.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">Expert in Web Development and React</p>

                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shrink-0">
                                            <img
                                                src={instructor.avatar}
                                                alt={instructor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                                <span className="flex items-center gap-1.5 italic"><span className="text-yellow-500">★</span> 4.7 Instructor Rating</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                                <FiAward className="text-gray-400" />
                                                <span>1,031,998 Reviews</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                                <FiUsers className="text-gray-400" />
                                                <span>3,367,190 Students</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                                <FiPlayCircle className="text-gray-400" />
                                                <span>{relatedCourses.length + 12} Courses</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 text-gray-700 text-sm leading-relaxed italic">
                                        "{instructor.description || "Passionate educator dedicated to sharing knowledge and helping students succeed in the tech industry."}"
                                    </div>

                                    {instructor.linkedin && (
                                        <a
                                            href={instructor.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 text-accent hover:underline font-bold text-sm"
                                        >
                                            <FiLinkedin /> View LinkedIn Profile
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Related Courses */}
                        {relatedCourses.length > 0 && (
                            <div className="pt-12 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 font-outfit">Other courses in <span className="text-accent">{course.category}</span></h2>
                                <CourseCard
                                    courses={relatedCourses.slice(0, 3)}
                                    customGridClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    gap="gap-4 md:gap-6 lg:gap-10"
                                />
                            </div>
                        )}
                    </div>

                    {/* Desktop Floating Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden w-[360px] ml-auto">
                            <div className="relative aspect-video group cursor-pointer">
                                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white rounded-full p-4 text-black shadow-lg">
                                        <FiPlayCircle size={32} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold drop-shadow-md">
                                    Preview this course
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                                    <span className="text-gray-500 line-through">${(course.price * 1.5).toFixed(2)}</span>
                                    <span className="text-sm font-bold text-gray-900">50% off</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/checkout?courseId=${id}`)}
                                    className="w-full py-3.5 bg-accent text-white font-bold rounded-lg hover:bg-green-600 transition-all active:scale-[0.98] shadow-md"
                                >
                                    Enroll now
                                </button>

                                <p className="text-center text-xs text-gray-500 pt-2">30-Day Money-Back Guarantee</p>

                                <div className="space-y-3 pt-4">
                                    <p className="text-sm font-bold text-gray-900">This course includes:</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <FiPlayCircle className="text-gray-400" size={16} /> <span>14 hours on-demand video</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <FiSmartphone className="text-gray-400" size={16} /> <span>Access on mobile and TV</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <FiRepeat className="text-gray-400" size={16} /> <span>Full lifetime access</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-700">
                                            <FiAward className="text-gray-400" size={16} /> <span>Certificate of completion</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    <span className="text-xs text-accent font-bold underline">50% Off</span>
                </div>
                <button
                    onClick={() => navigate(`/checkout?courseId=${id}`)}
                    className="flex-1 py-3 bg-accent text-white font-bold rounded-lg hover:bg-green-600 transition-all shadow-md text-sm"
                >
                    Enroll Now
                </button>
            </div>
        </div>
    );
};

export default CourseDetails;


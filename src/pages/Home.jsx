import { useState, useEffect, useRef } from "react";
import { FiBookOpen, FiStar, FiCalendar, FiArrowRight, FiArrowLeft, FiUser, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useSearch } from "../context/SearchContext";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { testimonials, events, partners } from "../data/mockSectionData";

const Home = () => {
    const { searchQuery } = useSearch();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [ownedCourseIds, setOwnedCourseIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "Software Development",
        "Mobile Development",
        "DevOps",
        "AI & Machine Learning",
        "Cloud Computing",
        "Cybersecurity",
        "Blockchain"
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:5000/courses?_t=${Date.now()}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                let coursesArray = Array.isArray(data) ? data : (data.courses || []);
                setCourses(coursesArray);
                applyFilters(coursesArray, activeCategory, searchQuery);

                // Fetch owned courses if user is logged in
                const userJson = localStorage.getItem("learnx_user");
                if (userJson) {
                    const user = JSON.parse(userJson);
                    const pRes = await fetch(`http://localhost:5000/purchases?userId=${user.id}`);
                    if (pRes.ok) {
                        const purchases = await pRes.ok ? await pRes.json() : [];
                        setOwnedCourseIds(purchases.map(p => p.courseId));
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
                setFilteredCourses([]);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        applyFilters(courses, activeCategory, searchQuery);
    }, [searchQuery, activeCategory, courses]);

    const applyFilters = (allCourses, category, query) => {
        let filtered = allCourses;

        // Apply constant category filter
        if (category !== "All") {
            filtered = filtered.filter(course => course.category === category);
        }

        // Apply search query filter
        if (query) {
            const lowQuery = query.toLowerCase();
            filtered = filtered.filter(course =>
                course.title?.toLowerCase().includes(lowQuery) ||
                course.category?.toLowerCase().includes(lowQuery) ||
                (course.skills && course.skills.some(skill => skill.toLowerCase().includes(lowQuery)))
            );
        }

        setFilteredCourses(filtered);
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Courses Section */}
            <section className="py-4">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryFilter(cat)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${activeCategory === cat
                                    ? "bg-accent border-accent text-white shadow-lg shadow-green-100"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-accent hover:text-accent"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && courses.length > 0 ? (
                        <div className="text-center py-20 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200">
                            <FiBookOpen size={48} className="mx-auto text-amber-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No matching courses found</h3>
                            <p className="text-gray-500">Try adjusting your search or category filters.</p>
                            <button
                                onClick={() => {
                                    handleCategoryFilter("All");
                                }}
                                className="mt-4 px-6 py-2 bg-accent text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <FiBookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Available Yet</h3>
                            <p className="text-gray-500 mb-2">Check back later or start by adding your own!</p>
                        </div>
                    ) : (
                        <CourseCard courses={filteredCourses} ownedCourseIds={ownedCourseIds} />
                    )}
                </div>
            </section>

            {/* Most Popular Courses Slider */}
            {courses.length > 0 && !searchQuery && activeCategory === "All" && (
                <section className="py-20 bg-white overflow-hidden">
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <span className="p-2 bg-yellow-100 text-yellow-600 rounded-xl"><FiZap /></span>
                                Most Popular Courses
                            </h2>
                            <p className="text-gray-500 mt-2">Join thousands of students in these top-rated courses</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="popular-prev p-3 rounded-full border-2 border-gray-100 hover:border-accent hover:text-accent transition-all">
                                <FiArrowLeft />
                            </button>
                            <button className="popular-next p-3 rounded-full border-2 border-gray-100 hover:border-accent hover:text-accent transition-all">
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation={{ prevEl: '.popular-prev', nextEl: '.popular-next' }}
                            spaceBetween={24}
                            slidesPerView={1}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 4 }
                            }}
                            className="!pb-10"
                        >
                            {[...courses].sort((a, b) => (b.students || 0) - (a.students || 0)).slice(0, 8).map((course) => (
                                <SwiperSlide key={course.id}>
                                    <CourseCard
                                        courses={[course]}
                                        ownedCourseIds={ownedCourseIds}
                                        customGridClass="grid-cols-1"
                                        gap="gap-0"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* Opinions / Testimonials Section */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">What people say about us</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">Hear from our community of students and world-class collaborators who grow with us every day.</p>
                </div>

                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="!pb-12"
                    >
                        {testimonials.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-accent/20 transition-transform group-hover:scale-105"
                                            />
                                            <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg text-white shadow-lg ${item.type === 'user' ? 'bg-blue-500' : 'bg-accent'}`}>
                                                <FiUser className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500 font-bold">{item.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex gap-1 mb-4 text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((s) => <FiStar key={s} fill="currentColor" />)}
                                        </div>
                                        <p className="text-gray-600 italic leading-relaxed font-medium">
                                            "{item.opinion}"
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${item.type === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-accent'}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-gray-300">"</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Coming Events & Partners Section */}
            <section className="py-24 bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent font-black text-xs uppercase tracking-widest rounded-full mb-6">
                                Upcoming Events
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                Our partners believe in us and <span className="text-accent underline decoration-4 underline-offset-8">invite you</span>.
                            </h2>

                            <div className="space-y-6">
                                {events.map((event) => (
                                    <div key={event.id} className="group relative bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 text-xs font-black text-accent mb-2">
                                                    <FiCalendar />
                                                    <span>{event.date}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{event.partner}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-gray-900 mb-2 group-hover:text-accent transition-colors">{event.title}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 font-medium">{event.description}</p>
                                                <button className="flex items-center gap-2 text-xs font-black group-hover:gap-4 transition-all uppercase tracking-widest">
                                                    Reserve Spot <FiArrowRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                            {/* Glow effect */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"></div>

                            <div className="relative z-10 text-center">
                                <h3 className="text-3xl font-black mb-10">Trusted by Global Partners</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                                    {partners.map((partner) => (
                                        <div key={partner.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl flex items-center justify-center transition-all group">
                                            <img src={partner.logo} alt={partner.name} className="h-8 w-auto object-contain transition-opacity" />
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-accent/10 border border-accent/20 p-8 rounded-[2rem]">
                                    <p className="text-gray-300 italic mb-6 font-medium">
                                        "Learnx is more than just a platform; it's a movement where industry leaders meet tomorrow's talent."
                                    </p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center font-black">L</div>
                                        <div className="text-left">
                                            <p className="font-black">Learnx Partnership</p>
                                            <p className="text-xs text-accent uppercase font-black">Official Network</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

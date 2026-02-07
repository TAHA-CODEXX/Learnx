import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiPlus,
    FiBook,
    FiUsers,
    FiHeart,
    FiDollarSign,
    FiLinkedin,
    FiEdit3,
    FiSave,
    FiCheckCircle,
    FiX,
    FiLoader,
    FiTrash2,
    FiEdit,
    FiLogOut
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { uploadToCloudinary } from "../services/cloudinaryService";
import { isEmpty } from "../utils/validation";

const FormateurDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editForm, setEditForm] = useState({ price: "", image: "", category: "", moreabout: "" });
    const [updatingCourse, setUpdatingCourse] = useState(false);

    const [profile, setProfile] = useState({
        name: user?.name || "",
        linkedin: user?.linkedin || "",
        description: user?.description || "",
        avatar: user?.avatar || ""
    });

    const [selectedProfileFile, setSelectedProfileFile] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch(`http://localhost:5000/courses?instructorId=${user.id}`);
            const data = await response.json();
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        // Validation
        if (isEmpty(profile.linkedin)) {
            return toast.error("Please enter your LinkedIn profile link");
        }
        if (isEmpty(profile.description)) {
            return toast.error("Please enter a short bio");
        }

        setUpdatingProfile(true);
        toast.loading("Updating profile & syncing with cloud...", { id: "updateProfile" });
        let avatarPath = profile.avatar;

        try {
            if (selectedProfileFile) {
                avatarPath = await uploadToCloudinary(selectedProfileFile);
            }

            const response = await fetch(`http://localhost:5000/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...profile, avatar: avatarPath })
            });

            if (response.ok) {
                const updatedUser = { ...user, ...profile, avatar: avatarPath };
                localStorage.setItem("learnx_user", JSON.stringify(updatedUser));
                toast.success("Profile updated perfectly!", { id: "updateProfile" });
                setIsEditingProfile(false);
                setSelectedProfileFile(null);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Failed to update profile. Check your Cloudinary config.", { id: "updateProfile" });
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;

        toast.loading("Deleting course...", { id: "deleteCourse" });
        try {
            console.log("Attempting to delete course ID:", courseId);
            const url = `http://localhost:5000/courses/${courseId}`;
            console.log("Delete URL:", url);

            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            console.log("Delete response status:", response.status);
            console.log("Delete response ok:", response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log("Delete response data:", data);
                toast.success("Course deleted successfully!", { id: "deleteCourse" });
                fetchCourses();
            } else {
                const errorData = await response.json();
                console.error("Delete error response:", errorData);
                throw new Error(errorData.error || "Failed to delete course");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Error deleting course", { id: "deleteCourse" });
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setEditForm({
            price: course.price,
            image: course.image,
            category: course.category || "Software Development",
            moreabout: (course.moreabout || []).join("\n")
        });
        setShowEditModal(true);
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();

        // Validation
        if (isEmpty(editForm.price)) {
            return toast.error("Please enter a course price");
        }
        if (isEmpty(editForm.image)) {
            return toast.error("Please upload a course image");
        }

        setUpdatingCourse(true);
        toast.loading("Updating course...", { id: "updateCourse" });

        try {
            const response = await fetch(`http://localhost:5000/courses/${editingCourse.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    price: Number(editForm.price),
                    image: editForm.image,
                    category: editForm.category,
                    moreabout: editForm.moreabout.split("\n").map(s => s.trim()).filter(s => s !== "")
                })
            });

            if (response.ok) {
                toast.success("Course updated successfully!", { id: "updateCourse" });
                setShowEditModal(false);
                fetchCourses();
            } else {
                throw new Error("Failed to update course");
            }
        } catch (error) {
            toast.error("Error updating course", { id: "updateCourse" });
        } finally {
            setUpdatingCourse(false);
        }
    };

    const handleEditImageUpload = async (file) => {
        if (!file) return;
        toast.loading("Uploading new image...", { id: "uploadEditImage" });
        try {
            const imageUrl = await uploadToCloudinary(file);
            setEditForm(prev => ({ ...prev, image: imageUrl }));
            toast.success("Image uploaded successfully!", { id: "uploadEditImage" });
        } catch (error) {
            toast.error("Image upload failed", { id: "uploadEditImage" });
        }
    };

    const stats = [
        { icon: <FiBook />, label: "Total Courses", value: courses.length },
        { icon: <FiUsers />, label: "Students", value: courses.reduce((acc, c) => acc + (c.students || 0), 0) },
        { icon: <FiHeart />, label: "Likes", value: courses.reduce((acc, c) => acc + (c.likes || 0), 0) },
        { icon: <FiDollarSign />, label: "Earnings", value: `$${courses.reduce((acc, c) => acc + (c.students || 0) * (c.price || 0), 0)}` },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Toaster position="top-center" />
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 hover:border-red-200"
                        >
                            <FiLogOut size={18} /> Log Out
                        </button>
                        <button
                            onClick={() => navigate("/instructor/add-course")}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <FiPlus size={20} /> Create New Course
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-hover hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 rounded-xl text-accent text-xl">
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 font-outfit">My Courses</h2>
                                <span className="text-sm text-gray-500">{courses.length} courses</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">Loading courses...</div>
                                ) : courses.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <p>You haven't created any courses yet.</p>
                                        <button
                                            onClick={() => navigate("/instructor/add-course")}
                                            className="text-accent font-semibold mt-2 hover:underline"
                                        >
                                            Start by creating your first course
                                        </button>
                                    </div>
                                ) : (
                                    courses.map((course) => (
                                        <div key={course.id} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-24 h-24 rounded-xl object-cover border border-gray-100"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditCourse(course)}
                                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Price & Image"
                                                        >
                                                            <FiEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCourse(course.id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Course"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{course.shortDesc}</p>
                                                <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                                                    <span className="flex items-center gap-1"><FiUsers /> {course.students} students</span>
                                                    <span className="flex items-center gap-1"><FiHeart className="text-red-400" /> {course.likes} likes</span>
                                                    <span className="px-2 py-0.5 bg-green-50 text-accent rounded-full">${course.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
                                <button
                                    onClick={() => isEditingProfile ? handleUpdateProfile() : setIsEditingProfile(true)}
                                    className={`p-2 rounded-lg transition-colors ${isEditingProfile ? 'text-accent bg-green-50' : 'text-gray-400 hover:text-accent hover:bg-green-50'}`}
                                >
                                    {updatingProfile ? <FiLoader size={20} className="animate-spin text-accent" /> : (isEditingProfile ? <FiSave size={20} /> : <FiEdit3 size={20} />)}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="relative group">
                                        <img
                                            src={user?.avatar}
                                            alt={user?.name}
                                            className="w-24 h-24 rounded-full border-4 border-green-50 object-cover"
                                        />
                                        {isEditingProfile && (
                                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                <FiPlus className="text-white text-2xl" />
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => setSelectedProfileFile(e.target.files[0])}
                                                />
                                            </label>
                                        )}
                                        <div className="absolute bottom-0 right-0 p-1.5 bg-accent text-white rounded-full border-2 border-white">
                                            <FiCheckCircle size={14} />
                                        </div>
                                    </div>
                                    {selectedProfileFile && (
                                        <p className="text-[10px] text-accent mt-1 font-bold">New image selected!</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">LinkedIn Link</label>
                                    {isEditingProfile ? (
                                        <div className="relative">
                                            <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={profile.linkedin}
                                                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                                                placeholder="https://linkedin.com/..."
                                            />
                                        </div>
                                    ) : (
                                        <a href={user?.linkedin} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline flex items-center gap-2">
                                            <FiLinkedin /> View LinkedIn Profile
                                        </a>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Short Bio</label>
                                    {isEditingProfile ? (
                                        <textarea
                                            value={profile.description}
                                            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none h-32"
                                            placeholder="Write a bit about yourself..."
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-600 leading-relaxed italic">
                                            "{user?.description || "No description added yet."}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Course Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-xl font-bold text-gray-900">Edit Course</h3>
                                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                    <FiX size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateCourse} className="p-6 space-y-6" noValidate>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Update Price ($)</label>
                                    <div className="relative">
                                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent outline-none transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Update Course Image</label>
                                    <div className="space-y-4">
                                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                            <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white rounded-xl cursor-pointer hover:bg-gray-800 transition-colors font-bold text-sm">
                                            <FiPlus /> Change Image
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleEditImageUpload(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Update What you'll learn (One per line)</label>
                                    <textarea
                                        value={editForm.moreabout}
                                        onChange={(e) => setEditForm({ ...editForm, moreabout: e.target.value })}
                                        rows="4"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent outline-none transition-all text-sm resize-none"
                                        placeholder="Enter each point on a new line..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updatingCourse}
                                        className="flex-1 px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {updatingCourse ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormateurDashboard;


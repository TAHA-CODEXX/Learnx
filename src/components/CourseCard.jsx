import React, { useState } from 'react';
import { FiHeart, FiUsers, FiClock, FiCheck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({
  courses = [],
  loading = false,
  ownedCourseIds = [],
  customGridClass = "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  gap = "gap-3 sm:gap-4 md:gap-6"
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items) || [];
  const [hoveredCourseId, setHoveredCourseId] = useState(null);

  const isWishlisted = (courseId) => Array.isArray(wishlistItems) && wishlistItems.some(item => item.id === courseId);
  const isOwned = (courseId) => Array.isArray(ownedCourseIds) && (ownedCourseIds.includes(courseId) || ownedCourseIds.includes(String(courseId)));

  const handleLike = async (e, course) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted(course.id)) {
      dispatch(removeFromWishlist(course.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(course));
      toast.success('Added to wishlist');

      // Increment likes on server
      try {
        const response = await fetch(`http://localhost:5000/courses/${course.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes: (course.likes || 0) + 1 })
        });

        if (!response.ok) {
          console.error('Failed to update likes on server');
        }
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`grid ${customGridClass} ${gap}`}>
      {courses.map((course, index) => {
        const isLastInRow = (index + 1) % 4 === 0;
        return (
          <div
            key={course.id}
            className="relative group "
            onMouseEnter={() => setHoveredCourseId(course.id)}
            onMouseLeave={() => setHoveredCourseId(null)}
          >
            {/* Main Card */}
            <div className="bg-white rounded-lg md:rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-100 transition-all duration-300 flex flex-col h-full overflow-hidden">
              {/* Course Image with Skills Overlay */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Price Badge - Top Right */}
                {!isOwned(course.id) && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 px-2 py-1 md:px-3 md:py-1.5 bg-accent text-white text-[10px] md:text-xs font-bold rounded-full shadow-sm">
                    ${course.price}
                  </div>
                )}

                {/* Like Button - Top Left - HOVER ONLY */}
                <button
                  onClick={(e) => handleLike(e, course)}
                  className={`absolute top-2 left-2 md:top-3 md:left-3 p-1.5 md:p-2 backdrop-blur-sm rounded-full transition-all duration-300 shadow-sm hover:shadow-md transform ${isWishlisted(course.id)
                    ? 'bg-red-500 text-white opacity-100 scale-100'
                    : 'bg-white/90 text-gray-400 hover:text-red-500 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                >
                  <FiHeart className="w-3.5 h-3.5 md:w-[18px] md:h-[18px]" fill={isWishlisted(course.id) ? "currentColor" : "none"} />
                </button>

                {/* Skills Overlay - Bottom of Image */}
                {course.skills && course.skills.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 md:p-3">
                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                      {course.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-white/20 backdrop-blur-sm text-white rounded-md border border-white/30 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-3 md:p-5 flex-1 flex flex-col">
                {/* Course Title */}
                <h3 className="text-xs md:text-base font-bold text-gray-900 mb-1.5 md:mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {course.title}
                </h3>

                {/* Course Description */}
                <p className="text-[10px] md:text-sm text-gray-500 line-clamp-2 mb-2 md:mb-3 flex-1 hidden sm:block">
                  {course.shortDesc}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-50 pt-2 md:pt-3 mt-auto space-y-2 md:space-y-3">
                  {/* Course Stats */}
                  <div className="flex items-center justify-between">
                    {/* Instructor Info - Bottom */}
                    <div className="cursor-pointer flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructorName}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-100 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-bold text-gray-900 truncate">{course.instructorName}</p>
                        <p className="text-[8px] md:text-[10px] text-gray-500 hidden sm:block">Instructor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <span className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-bold text-gray-400">
                        <FiUsers className="text-accent w-3 h-3 md:w-3.5 md:h-3.5" /> {course.students || 0}
                      </span>
                      <span className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-bold text-gray-400">
                        <FiHeart className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isWishlisted(course.id) ? 'text-red-500' : 'text-gray-400'}`} /> {course.likes || 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Button - HOVER ONLY */}
                  <div className={`overflow-hidden transition-all duration-300 ${hoveredCourseId === course.id ? 'max-h-12 opacity-100 mt-1.5 md:mt-2' : 'max-h-0 opacity-0'}`}>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className={`w-full px-3 md:px-4 py-2 md:py-2.5 text-[11px] md:text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300 ${isOwned(course.id) ? 'bg-gray-900 text-white hover:bg-black' : 'bg-accent text-white hover:bg-green-600'
                        }`}
                    >
                      {isOwned(course.id) ? 'Continue Learning' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Popover (Udemy Style) */}
            {hoveredCourseId === course.id && (
              <div className={`absolute top-0 ${isLastInRow ? 'right-full mr-4 animate-in slide-in-from-right-2' : 'left-full ml-4 animate-in slide-in-from-left-2'} w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-[100] hidden xl:block fade-in duration-300`}>
                {/* Bridge to prevent popover from disappearing when moving cursor across the margin */}
                <div className={`absolute top-0 bottom-0 ${isLastInRow ? '-right-4 w-4' : '-left-4 w-4'} bg-transparent`} />

                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">
                    {course.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded-md w-fit">
                    <FiClock size={12} />
                    <span>Updated {new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{course.shortDesc}"
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">What you'll learn</p>
                    {course.skills && course.skills.length > 0 && (
                      <ul className="space-y-1.5">
                        {course.skills.map((skill, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <FiCheck className="text-accent mt-0.5 shrink-0" size={14} />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Triangle pointer */}
                <div className={`absolute top-10 ${isLastInRow ? '-right-2 border-r border-t' : '-left-2 border-l border-b'} w-4 h-4 bg-white border-gray-100 rotate-45`}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseCard;

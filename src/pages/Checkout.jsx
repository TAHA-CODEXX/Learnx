import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiLock, FiInfo, FiGlobe } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Checkout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    // Payment Form State
    const [paymentData, setPaymentData] = useState({
        country: "Morocco",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        nameOnCard: ""
    });

    const [errors, setErrors] = useState({});

    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId");

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/courses/${courseId}`);
                if (!response.ok) throw new Error("Course not found");
                const data = await response.json();
                setCourse(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching course:", error);
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cardNumber") {
            // Remove all non-digits
            const digits = value.replace(/\D/g, "");
            // Limit to 16 digits
            const limited = digits.substring(0, 16);
            // Add space every 4 digits
            formattedValue = limited.replace(/(\d{4})(?=\d)/g, "$1 ");
        } else if (name === "expiryDate") {
            // Remove all non-digits
            const digits = value.replace(/\D/g, "");
            // Limit to 4 digits (MMYY)
            const limited = digits.substring(0, 4);
            // Add / after 2 digits
            if (limited.length > 2) {
                formattedValue = `${limited.substring(0, 2)}/${limited.substring(2)}`;
            } else {
                formattedValue = limited;
            }
        } else if (name === "cvc") {
            // Remove all non-digits and limit to 3
            formattedValue = value.replace(/\D/g, "").substring(0, 3);
        }

        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
        // Clear error when user typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validatePayment = () => {
        const newErrors = {};
        // Card number should have 16 digits (formatted with spaces it's 19 chars)
        const digitsOnly = paymentData.cardNumber.replace(/\D/g, "");
        if (digitsOnly.length < 16) {
            newErrors.cardNumber = "Please enter your full 16-digit card number";
        }

        // Expiry date should be MM/YY (5 chars)
        if (paymentData.expiryDate.length < 5) {
            newErrors.expiryDate = "Please enter your full expiration date (MM/YY)";
        }

        // CVC should be 3 digits
        if (paymentData.cvc.length < 3) {
            newErrors.cvc = "Please enter your 3-digit CVC";
        }

        if (!paymentData.nameOnCard || paymentData.nameOnCard.trim().length < 3) {
            newErrors.nameOnCard = "Please enter your cardholder name";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to enroll in courses");
            navigate("/login");
            return;
        }

        if (!validatePayment()) {
            toast.error("Please fix the errors in the payment form");
            return;
        }

        setEnrolling(true);
        // Simulate payment delay
        setTimeout(async () => {
            try {
                const response = await fetch("http://localhost:5000/purchases", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        courseId: parseInt(courseId),
                        purchaseDate: new Date().toISOString()
                    })
                });

                if (!response.ok) throw new Error("Failed to enroll");

                // Success! Clear inputs and show toast
                setPaymentData({
                    country: "Morocco",
                    cardNumber: "",
                    expiryDate: "",
                    cvc: "",
                    nameOnCard: ""
                });

                toast.success("Successfully enrolled in the course!");

                // Navigate to placeholder page after a short toast delay
                // Note: We keep enrolling as true to prevent the button from popping back
                setTimeout(() => {
                    navigate("/my-learning-placeholder");
                }, 1000);
            } catch (error) {
                console.error("Enrollment error:", error);
                toast.error("Enrollment failed. Please try again.");
                setEnrolling(false); // Only stop loading on error
            }
            // Removing 'finally' so navigation can happen while button stays in 'Processing...'
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!courseId || !course) {
        return (
            <div className="min-h-screen bg-white py-12 px-4 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900 font-outfit">Course not found</h1>
                    <p className="text-gray-500">The course you're looking for doesn't exist or was removed.</p>
                    <Link to="/" className="inline-block px-6 py-2 bg-accent text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-inter pb-12">
            {/* Header / Back Link */}
            <div className="max-w-[1000px] mx-auto px-6 py-6">
                <Link
                    to={`/course/${course.id}`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-accent mb-6 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <FiArrowLeft /> Back to Course
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Checkout Form */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-8">
                            {/* Section Header */}
                            <h1 className="text-3xl font-extrabold text-gray-900 font-outfit tracking-tight">Checkout</h1>

                            {/* Billing Address */}
                            <div className="space-y-5">
                                <h2 className="text-lg font-bold text-gray-900 font-outfit flex items-center gap-2">
                                    Billing address
                                </h2>
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Country</label>
                                    <div className="relative max-w-xs">
                                        <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            name="country"
                                            value={paymentData.country}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl bg-green-50/20 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all appearance-none text-sm"
                                        >
                                            <option value="Morocco">Morocco</option>
                                            <option value="France">France</option>
                                            <option value="United States">United States</option>
                                            <option value="Spain">Spain</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 leading-relaxed max-w-lg italic">
                                        Learnx is required by law to collect applicable transaction taxes for purchases made in certain tax jurisdictions.
                                    </p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-5 pt-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-gray-900 font-outfit">Payment method</h2>
                                    <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
                                        <FiLock size={12} /> Secure and encrypted
                                    </div>
                                </div>

                                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 border-2 border-accent rounded-full flex items-center justify-center bg-white shadow-inner">
                                                <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm">Cards</span>
                                        </div>
                                        <div className="flex gap-1.5 opacity-80">
                                            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-5 w-auto" />
                                            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-5 w-auto" />
                                            <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-5 w-auto" />
                                            <img src="https://img.icons8.com/color/48/discover.png" alt="Discover" className="h-5 w-auto" />
                                            <img src="https://img.icons8.com/color/48/jcb.png" alt="JCB" className="h-5 w-auto" />
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6 bg-white">
                                        {/* Card Number */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase tracking-white">Card number</label>
                                                <FiInfo size={12} className="text-accent" />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={paymentData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-green-50/20 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all font-mono text-sm`}
                                                />
                                            </div>
                                            {errors.cardNumber && <p className="text-[11px] text-red-500 font-bold italic">{errors.cardNumber}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Expiry Date */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Expiry date</label>
                                                    <FiInfo size={12} className="text-accent" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    placeholder="MM/YY"
                                                    value={paymentData.expiryDate}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-green-50/20 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all font-mono text-sm`}
                                                />
                                                {errors.expiryDate && <p className="text-[11px] text-red-500 font-bold italic">{errors.expiryDate}</p>}
                                            </div>

                                            {/* CVC */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">CVC/CVV</label>
                                                    <FiInfo size={12} className="text-accent" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="cvc"
                                                    placeholder="CVC"
                                                    value={paymentData.cvc}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border ${errors.cvc ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-green-50/20 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all font-mono text-sm`}
                                                />
                                                {errors.cvc && <p className="text-[11px] text-red-500 font-bold italic">{errors.cvc}</p>}
                                            </div>
                                        </div>

                                        {/* Name on Card */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Name on card</label>
                                                <FiInfo size={12} className="text-accent" />
                                            </div>
                                            <input
                                                type="text"
                                                name="nameOnCard"
                                                placeholder="Name on card"
                                                value={paymentData.nameOnCard}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border ${errors.nameOnCard ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-green-50/20 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-50 focus:border-accent transition-all text-sm`}
                                            />
                                            {errors.nameOnCard && <p className="text-[11px] text-red-500 font-bold italic">{errors.nameOnCard}</p>}
                                        </div>

                                        <div className="flex items-center gap-3 pt-1">
                                            <input type="checkbox" id="saveCard" defaultChecked className="w-5 h-5 rounded-md border-gray-300 text-accent focus:ring-accent" />
                                            <label htmlFor="saveCard" className="text-xs font-bold text-gray-500 cursor-pointer">
                                                Securely save this card for my later purchase
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-5 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/20 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 font-outfit">Order summary</h3>

                        <div className="space-y-5">
                            <div className="flex justify-between items-center text-gray-500 text-sm font-bold">
                                <span>Original Price:</span>
                                <span>${course.price.toFixed(2)}</span>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="flex justify-between items-end pb-1">
                                <span className="text-lg font-bold text-gray-900 font-outfit">Total:</span>
                                <span className="text-3xl font-extrabold text-gray-900 font-outfit">${course.price.toFixed(2)}</span>
                            </div>

                            <p className="text-[11px] text-gray-400 leading-relaxed font-bold">
                                By completing your purchase, you agree to these <Link to="#" className="text-accent underline">Terms of Use</Link>.
                            </p>

                            <button
                                onClick={handlePay}
                                disabled={enrolling}
                                className="w-full py-4 bg-accent text-white font-extrabold rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-100/50 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait text-sm uppercase tracking-wider"
                            >
                                {enrolling ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiLock /> Pay ${course.price.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <div className="pt-6 space-y-3 text-center">
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Money-Back Guarantee</p>
                                <p className="text-[11px] text-gray-400 font-bold leading-tight px-4 italic">
                                    Not satisfied? Get a full refund within 30 days. Simple and straightforward!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

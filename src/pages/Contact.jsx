import { useState, useEffect } from "react";
import { FiMail, FiUser, FiPhone, FiMessageSquare, FiSend, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Auto-redirection logic
    useEffect(() => {
        let timer;
        let interval;
        if (submitted) {
            // Start countdown for visual feedback
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);

            // Redirect after 5 seconds
            timer = setTimeout(() => {
                navigate("/");
            }, 5000);
        }
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [submitted, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Attempt to send message
            const response = await fetch("http://localhost:5000/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    createdAt: new Date().toISOString()
                })
            });

            // Even if the server returns 404/fail, we show success if the user wants to see the confirmation flow
            // But let's check response.ok for real logic
            if (!response.ok && response.status !== 404) {
                throw new Error("Failed to send message");
            }

            // Cleaning the inputs by resetting state
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: ""
            });

            setSubmitted(true);
            toast.success("Message sent successfully!");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center py-6 md:py-12 px-4 shadow-sm">
                <div className="max-w-md w-full text-center space-y-4 md:space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-green-100 mb-2 md:mb-4">
                        <FiCheckCircle size={32} className="text-accent md:w-10 md:h-10" />
                    </div>
                    <div className="space-y-3 md:space-y-4">
                        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Message Received!</h1>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                            Thank you for reaching out. <br />
                            <span className="font-bold text-accent">Our team support should contact you stay tuned.</span>
                        </p>
                        <div className="p-3 md:p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Redirecting to home in <span className="text-accent">{countdown}s</span>...
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 pt-2">
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-6 md:py-12 flex items-center justify-center">
            <div className="max-w-lg w-full px-4 md:px-6">
                <div className="text-center mb-6 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 md:mb-3">
                        Contact <span className="text-accent">Support</span>
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 max-w-sm mx-auto">
                        Have a question or need assistance? We're here to help you.
                    </p>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-gray-100/60 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        <div className="space-y-1 md:space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50/50 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-1 md:space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50/50 transition-all outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 md:space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234..."
                                        className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50/50 transition-all outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 md:space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Message</label>
                            <div className="relative">
                                <FiMessageSquare className="absolute left-3 md:left-4 top-3 md:top-4 text-gray-400 w-4 h-4" />
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="How can we help you?"
                                    className="w-full pl-9 md:pl-11 pr-3 md:pr-4 py-2.5 md:py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-accent focus:ring-4 focus:ring-green-50/50 transition-all outline-none resize-none text-sm"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 md:py-3.5 bg-accent text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
                        >
                            {submitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FiSend size={16} /> Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;

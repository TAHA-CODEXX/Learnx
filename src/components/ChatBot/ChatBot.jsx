import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiClock, FiCheckCircle } from 'react-icons/fi';
import './ChatBot.css';

const GeminiStar = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.47 8.53L21 11L14.47 13.47L12 20L9.53 13.47L3 11L9.53 8.53L12 2Z" />
        <path d="M18 16L18.88 18.12L21 19L18.88 19.88L18 22L17.12 19.88L15 19L17.12 18.12L18 16Z" />
    </svg>
);

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hello! I'm your Learnx AI Mentor. Ask me about any tech domain and I'll build a roadmap to help you master it in 2026." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulated AI Logic for Roadmap
        setTimeout(() => {
            const botResponse = generateMockRoadmap(input);
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateMockRoadmap = (query) => {
        const q = query.toLowerCase();
        let domain = "this technology";
        let steps = ["Understand the basics", "Build a project", "Join a community"];
        let duration = "2-4 weeks";

        if (q.includes('react')) {
            domain = "React.js";
            steps = [
                "Master JSX and Components",
                "Learn State & Props (useState, useEffect)",
                "Handle Forms and Events",
                "Explore Routing with React Router",
                "State Management (Redux Toolkit)"
            ];
            duration = "4 weeks";
        } else if (q.includes('web')) {
            domain = "Modern Web Development";
            steps = [
                "HTML5 Semantic Structure",
                "CSS3 Flexbox & Grid",
                "JavaScript ES6+ fundamentals",
                "Version Control with Git",
                "Introduction to a Framework (React/Vue)"
            ];
            duration = "8-12 weeks";
        } else if (q.includes('cyber') || q.includes('security')) {
            domain = "Cybersecurity";
            steps = [
                "Networking Fundamentals (TCP/IP)",
                "Operating Systems Security (Linux/Windows)",
                "Learn Ethical Hacking tools",
                "Web Application Security (OWASP Top 10)",
                "Incident Response & Forensics"
            ];
            duration = "6 months";
        }

        return {
            role: 'bot',
            isRoadmap: true,
            domain,
            steps,
            duration
        };
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'active' : ''}`}>
            {/* Floating Trigger */}
            <button
                className="chatbot-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Chat with AI Mentor"
            >
                {isOpen ? <FiX size={24} /> : (
                    <div className="relative">
                        <GeminiStar className="w-8 h-8" />
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="bot-avatar shine-effect">
                            <GeminiStar className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3>Learnx AI Mentor</h3>
                                <span className="px-1.5 py-0.5 bg-white/20 rounded-md text-[9px] font-black uppercase tracking-tighter">Pro 2026</span>
                            </div>
                            <span className="online-indicator">Generative AI Enabled</span>
                        </div>
                    </div>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-wrapper ${msg.role}`}>
                            {msg.role === 'bot' && (
                                <div className="message bot-message">
                                    {msg.isRoadmap ? (
                                        <div className="roadmap-card">
                                            <div className="roadmap-header">
                                                <h4>Roadmap: {msg.domain}</h4>
                                                <div className="roadmap-meta">
                                                    <FiClock className="text-accent" />
                                                    <span>~ {msg.duration} basics</span>
                                                </div>
                                            </div>
                                            <div className="roadmap-steps">
                                                {msg.steps.map((step, i) => (
                                                    <div key={i} className="roadmap-step">
                                                        <span className="step-num">{i + 1}</span>
                                                        <p>{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="roadmap-footer">
                                                <FiCheckCircle className="text-green-500" />
                                                <span>Mastery breakdown generated</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                            )}
                            {msg.role === 'user' && (
                                <div className="message user-message">
                                    <p>{msg.content}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-wrapper bot">
                            <div className="typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Master any domain (e.g. React)..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit" disabled={!input.trim()}>
                        <FiSend />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;

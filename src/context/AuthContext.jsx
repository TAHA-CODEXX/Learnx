import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("learnx_user");
        console.log("Loading user from localStorage:", savedUser);
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            console.log("Parsed user:", parsedUser);
            console.log("User role from storage:", parsedUser.role);
            setUser(parsedUser);
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...userData,
                    role: "user", // Default role
                    status: "active user", // Default status
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=22c55e&color=fff`,
                }),
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }

            const newUser = await response.json();
            return { success: true, user: newUser };
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, error: error.message };
        }
    };

    const login = async (email, password) => {
        try {
            const url = `${API_URL}/users?email=${email}&password=${password}`;
            console.log("Fetching from URL:", url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const users = await response.json();

            console.log("Login response users:", users);
            console.log("User count:", users.length);

            if (users.length === 0) {
                return { success: false, error: "Invalid email or password" };
            }

            const authenticatedUser = users[0];
            console.log("Authenticated user:", authenticatedUser);
            console.log("User role:", authenticatedUser.role);

            if (authenticatedUser.status === 'banned') {
                return { success: false, error: "Your account has been suspended. Please contact support." };
            }

            localStorage.setItem("learnx_user", JSON.stringify(authenticatedUser));
            setUser(authenticatedUser);

            return { success: true, user: authenticatedUser };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem("learnx_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

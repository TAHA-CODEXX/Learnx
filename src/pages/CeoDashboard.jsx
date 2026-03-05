import { useAuth } from "../context/AuthContext";
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Dashboard = () => {
    const { user } = useAuth();
    const [Instructors, setInstructors] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            // Fetch instructors (users with role 'formateur')
            const usersResponse = await fetch('http://localhost:5000/users?role=formateur');
            const usersData = await usersResponse.json();

            // Fetch pending invitations (users with status 'pending')
            const pendingResponse = await fetch('http://localhost:5000/users?status=pending');
            const pendingData = await pendingResponse.json();

            // Fetch all courses
            const coursesResponse = await fetch('http://localhost:5000/courses');
            const coursesData = await coursesResponse.json();

            // Map instructors to include their course count
            const instructorsWithStats = usersData.map(instructor => {
                const courseCount = coursesData.filter(course => course.instructorId === instructor.id).length;
                return {
                    ...instructor,
                    courseCount
                };
            });

            setInstructors(instructorsWithStats);
            setPendingUsers(pendingData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleBanStatus = async (instructorId, currentStatus) => {
        const newStatus = currentStatus === 'banned' ? 'active formateure' : 'banned';
        const action = currentStatus === 'banned' ? 'débanni' : 'banni';
        try {
            const response = await fetch(`http://localhost:5000/users/${instructorId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setInstructors(prev => prev.map(inst => inst.id === instructorId ? { ...inst, status: newStatus } : inst));
                toast.success(`Instructeur ${action} avec succès`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const handleAccept = async (pendingUser) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${pendingUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: "formateur",
                    status: "active formateure",
                    description: "Expert en développement Web et React." // Default description
                }),
            });

            if (response.ok) {
                toast.success(`${pendingUser.name} est maintenant un collaborateur !`);
                fetchAllData();
            }
        } catch (error) {
            console.error("Error accepting user:", error);
            toast.error("Erreur lors de l'acceptation");
        }
    };

    const handleRefuse = async (pendingUser) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${pendingUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: "active user"
                }),
            });

            if (response.ok) {
                toast.error(`Invitation refusée pour ${pendingUser.name}`);
                setPendingUsers(prev => prev.filter(u => u.id !== pendingUser.id));
            }
        } catch (error) {
            console.error("Error refusing user:", error);
            toast.error("Erreur lors du refus");
        }
    };

    const stats = [
        { icon: <FiUsers />, label: "Utilisateurs Totaux", value: "12,458", change: "+12%" },
        { icon: <FiBookOpen />, label: "Cours Actifs", value: "1,247", change: "+8%" },
        { icon: <FiDollarSign />, label: "Revenu", value: "$48,392", change: "+23%" },
        { icon: <FiTrendingUp />, label: "Croissance", value: "34%", change: "+5%" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
                        <p className="text-gray-500 mt-1">Bon retour, {user?.name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-lg text-accent text-2xl">
                                    {stat.icon}
                                </div>
                                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Invitations Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        Invitations - Devenir Collaborateur
                        {pendingUsers.length > 0 && (
                            <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                {pendingUsers.length} En attente
                            </span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingUsers
                            .filter(u => u.status === 'pending') // Explicit filter to be 100% sure
                            .map((pendingUser) => (
                                <div key={pendingUser.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-accent/30 transition-all group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={pendingUser.avatar || `https://ui-avatars.com/api/?name=${pendingUser.name}`}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            alt=""
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-900">{pendingUser.name}</h3>
                                            <p className="text-xs text-gray-500">{pendingUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CV Joint</p>
                                        <a
                                            href={pendingUser.cvPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-accent hover:underline font-semibold"
                                        >
                                            <FiBookOpen className="shrink-0" />
                                            Voir le Curriculum Vitae
                                        </a>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(pendingUser)}
                                            className="flex-1 py-2 bg-accent hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() => handleRefuse(pendingUser)}
                                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-all"
                                        >
                                            Refuser
                                        </button>
                                    </div>
                                </div>
                            ))}
                        {pendingUsers.length === 0 && (
                            <div className="col-span-full py-10 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">Aucune invitation en attente pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Performance des Formateurs</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructeur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours Créés</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Instructors.map((instructor) => (
                                    <tr key={instructor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-full object-cover" src={instructor.avatar || `https://ui-avatars.com/api/?name=${instructor.name}&background=random`} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{instructor.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-bold">{instructor.courseCount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${instructor.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {instructor.status === 'banned' ? 'Banni' : 'Actif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleBanStatus(instructor.id, instructor.status)}
                                                className={`px-4 py-2 rounded-md font-semibold text-white transition-colors ${instructor.status === 'banned'
                                                    ? 'bg-green-500 hover:bg-green-600'
                                                    : 'bg-red-500 hover:bg-red-600'
                                                    }`}
                                            >
                                                {instructor.status === 'banned' ? 'Débannir' : 'Bannir'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {Instructors.length === 0 && !loading && (
                            <p className="text-center text-gray-500 py-4">Aucun formateur trouvé.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h2>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-accent font-semibold">
                                        U{i}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">Utilisateur inscrit au cours React</p>
                                        <p className="text-xs text-gray-500">Il y a 2 heures</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Meilleurs Cours</h2>
                        <div className="space-y-4">
                            {["React Masterclass", "Python for Beginners", "UI/UX Design", "Data Science"].map((course, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{course}</p>
                                        <p className="text-xs text-gray-500">{Math.floor(Math.random() * 500 + 100)} étudiants</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-accent">${Math.floor(Math.random() * 50 + 20)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

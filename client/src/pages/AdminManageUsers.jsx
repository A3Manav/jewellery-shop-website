import { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, Edit3, Save, X, Mail, User, Shield, UserCheck, Crown } from 'lucide-react';

function AdminManageUsers() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [editUser, setEditUser] = useState(null);

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: () =>
            axios
                .get('/api/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(res => res.data),
        enabled: user?.role === 'admin', // Only run query if user is admin
    });

    const updateUser = useMutation({
        mutationFn: ({ id, data }) =>
            axios.put(`/api/users/${id}`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully');
            setEditUser(null);
        },
        onError: () => toast.error('Failed to update user'),
    });

    const handleEdit = (user) => {
        setEditUser({ id: user._id, name: user.name, email: user.email, role: user.role });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser.mutate({ id: editUser.id, data: { role: editUser.role, name: editUser.name, email: editUser.email } });
    };

    // Auth check in useEffect to avoid calling navigate during render
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    // Don't render if user is not admin
    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Users className="w-8 h-8 text-blue-500 mr-3" />
                                    Manage Users
                                </h1>
                                <p className="text-gray-600 mt-1">View and edit user accounts and permissions</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-lg">
                            <span className="text-blue-600 font-semibold text-sm">
                                {users?.length || 0} Total Users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="space-y-4">
                    {users?.map(user => (
                        <div key={user._id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                        }`}>
                                        {user.role === 'admin' ? (
                                            <Crown className="w-6 h-6 text-white" />
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role === 'admin' ? 'Administrator' : 'User'}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Mail className="w-4 h-4 mr-2" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit User Modal */}
                {editUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Edit3 className="w-6 h-6 text-blue-500 mr-2" />
                                    Edit User
                                </h3>
                                <button
                                    onClick={() => setEditUser(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <User className="w-4 h-4 text-gray-500 mr-2" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editUser.name}
                                        onChange={e => setEditUser({ ...editUser, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <Mail className="w-4 h-4 text-gray-500 mr-2" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                                        placeholder="Enter email address"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                        <Shield className="w-4 h-4 text-gray-500 mr-2" />
                                        User Role
                                    </label>
                                    <select
                                        value={editUser.role}
                                        onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300"
                                    >
                                        <option value="user">User - Standard Access</option>
                                        <option value="admin">Admin - Full Access</option>
                                    </select>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updateUser.isPending}
                                        className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditUser(null)}
                                        className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {users && users.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                        <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
                        <p className="text-gray-600">There are currently no users in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminManageUsers;
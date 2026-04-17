import React, { useState, useEffect } from 'react';
import { Search, UserPlus, MoreVertical, Shield, Trash2, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}`, { role });
            fetchUsers();
        } catch (error) {
            alert("Failed to update role");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        try {
            await api.put(`/admin/users/${user._id}`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/auth/register', newUserForm);
            setShowAddModal(false);
            setNewUserForm({ name: '', email: '', password: '', role: 'student' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = !search ||
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight uppercase">User Management</h1>
                    <p className="text-slate-500 font-medium">Manage platform access, roles, and community members.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg active:scale-95 uppercase text-xs tracking-widest">
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="trainer">Trainers</option>
                        <option value="hr">HR Managers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="py-5 px-8">User Details</th>
                                <th className="py-5 px-8">Role</th>
                                <th className="py-5 px-8">Status</th>
                                <th className="py-5 px-8">Joined</th>
                                <th className="py-5 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-600 shadow-inner">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{user.name}</p>
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-none focus:ring-2 transition-all cursor-pointer ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                user.role === 'trainer' ? 'bg-primary-50 text-primary-600' :
                                                    user.role === 'hr' ? 'bg-blue-50 text-blue-600' :
                                                        'bg-emerald-50 text-emerald-600'
                                                }`}
                                        >
                                            <option value="student">Student</option>
                                            <option value="trainer">Trainer</option>
                                            <option value="hr">HR</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 w-fit ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8">
                                        <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleToggleStatus(user)} title="Toggle Status" className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"><Shield size={18} /></button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-10 pb-20 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[40px] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Add New User</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><XCircle size={24} /></button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                <input required type="text" value={newUserForm.name} onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                                <input required type="email" value={newUserForm.email} onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                                <input required type="password" value={newUserForm.password} onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Role</label>
                                <select value={newUserForm.role} onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })} className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-primary-500">
                                    <option value="student">Student</option>
                                    <option value="trainer">Trainer</option>
                                    <option value="hr">HR</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl disabled:opacity-50 transition-all">
                                {isSubmitting ? 'Creating...' : 'Create User'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

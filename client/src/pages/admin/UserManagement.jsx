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
        <div className="animate-fade-in space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-1 tracking-tight uppercase">User Management</h1>
                    <p className="text-slate-400 font-medium">Manage platform access, roles, and community members.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black flex items-center gap-2 hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-widest">
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            {/* Filters and Search */}
            <div className="glass-card-premium p-6 rounded-[32px] border border-white/5 bg-slate-900/40 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none cursor-pointer appearance-none min-w-[160px]"
                    >
                        <option value="all" className="bg-slate-900">All Roles</option>
                        <option value="student" className="bg-slate-900">Students</option>
                        <option value="trainer" className="bg-slate-900">Trainers</option>
                        <option value="hr" className="bg-slate-900">HR Managers</option>
                        <option value="admin" className="bg-slate-900">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card-premium rounded-[40px] border border-white/5 bg-slate-900/40 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="py-6 px-10">User Entity</th>
                                <th className="py-6 px-10">Access Node</th>
                                <th className="py-6 px-10">Status</th>
                                <th className="py-6 px-10">Initialized</th>
                                <th className="py-6 px-10 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-black text-white shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white uppercase tracking-tight">{user.name}</p>
                                                <p className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                                                    <Mail size={12} className="text-accent-500" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none focus:ring-2 transition-all cursor-pointer ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                                                user.role === 'trainer' ? 'bg-blue-500/10 text-blue-400' :
                                                    user.role === 'hr' ? 'bg-indigo-500/10 text-indigo-400' :
                                                        'bg-emerald-500/10 text-emerald-400'
                                                }`}
                                        >
                                            <option value="student" className="bg-slate-900">Student</option>
                                            <option value="trainer" className="bg-slate-900">Trainer</option>
                                            <option value="hr" className="bg-slate-900">HR</option>
                                            <option value="admin" className="bg-slate-900">Admin</option>
                                        </select>
                                    </td>
                                    <td className="py-8 px-10">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                            {user.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="py-8 px-10">
                                        <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                            <Calendar size={14} className="text-accent-500" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => handleToggleStatus(user)} title="Toggle Status" className="p-3 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"><Shield size={18} /></button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
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
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
                    <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 border border-white/10 relative my-auto">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/10 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Onboard User</h2>
                                <p className="text-[10px] font-black text-accent-500 uppercase tracking-widest mt-1">Initialize new member node</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Full Identity Name</label>
                                <input required type="text" value={newUserForm.name} onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Electronic Mail Address</label>
                                <input required type="email" value={newUserForm.email} onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" placeholder="john@skilnexia.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Secure Password</label>
                                <input required type="password" value={newUserForm.password} onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2.5 ml-1">Access Designation</label>
                                <select value={newUserForm.role} onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none cursor-pointer appearance-none">
                                    <option value="student" className="bg-slate-900">Student (Learner)</option>
                                    <option value="trainer" className="bg-slate-900">Trainer (Mentor)</option>
                                    <option value="hr" className="bg-slate-900">HR Manager</option>
                                    <option value="admin" className="bg-slate-900">System Admin</option>
                                </select>
                            </div>
                            <button disabled={isSubmitting} type="submit" className="w-full py-5 mt-4 bg-white text-slate-950 rounded-[24px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white shadow-2xl disabled:opacity-50 transition-all active:scale-95 text-xs">
                                {isSubmitting ? 'Initializing Node...' : 'Complete Onboarding'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

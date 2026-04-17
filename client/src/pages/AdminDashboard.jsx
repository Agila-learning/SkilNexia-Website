import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, DollarSign, ChevronRight, Activity, TrendingUp, Shield, Zap, Layout } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className={`relative overflow-hidden p-8 rounded-[32px] border border-white/5 bg-slate-900 group hover:-translate-y-1 transition-all shadow-2xl`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 shadow-lg`}>
            <Icon size={28} />
        </div>
        <h3 className="text-4xl font-black tracking-tighter text-white mb-2">{value}</h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTrainers: 0,
        activeCourses: 0,
        revenue: '₹0'
    });
    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, enrRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/enrollments') 
                ]);
                setStats(statsRes.data);
                setRecentEnrollments(enrRes.data.slice(0, 5));
            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleGenerateReport = async () => {
        setIsExporting(true);
        try {
            const res = await api.get('/enrollments');
            const data = res.data;
            if (!data || data.length === 0) return;
            const headers = ["Student", "Program", "Date", "Status"];
            const csvRows = [headers.join(','), ...data.map(enr => [enr.student?.name, enr.batch?.course?.title, new Date(enr.createdAt).toLocaleDateString(), enr.status].join(','))];
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.csv';
            a.click();
        } catch (error) {
            console.error("Export error", error);
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) return <div className="flex flex-col items-center justify-center h-64 gap-4"><div className="w-10 h-10 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Secure Node...</p></div>;

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* 1. OPERATIONS HEADER */}
            <div className="relative p-12 rounded-[40px] bg-slate-900 border border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-900 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Ecosystem Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Command Center <br /><span className="text-accent-500">Node Alpha.</span></h1>
                        <p className="text-slate-400 font-medium max-w-lg">Manage elite transitions, academic pipelines, and financial nodes from a unified interface.</p>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isExporting}
                        className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3 disabled:opacity-50"
                    >
                        {isExporting ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <TrendingUp size={18} />}
                        Export Analytics
                    </button>
                </div>
            </div>

            {/* 2. CORE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Global Learners" value={stats.totalStudents} icon={GraduationCap} color="text-blue-500" bg="bg-blue-500/10" />
                <StatCard title="Expert Mentors" value={stats.totalTrainers} icon={Users} color="text-purple-500" bg="bg-purple-500/10" />
                <StatCard title="Active Programs" value={stats.activeCourses} icon={BookOpen} color="text-accent-500" bg="bg-accent-500/10" />
                <StatCard title="Net Revenue" value={stats.revenue} icon={DollarSign} color="text-emerald-500" bg="bg-emerald-500/10" />
            </div>

            {/* 3. ACTIVITY & CONTROL HUB */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 glass-card-premium border border-white/5 rounded-[40px] p-10 bg-slate-900/40">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3"><Activity size={24} className="text-accent-500" /> Pipeline Activity</h3>
                        <button onClick={() => navigate('/admin/payments')} className="text-accent-500 font-black text-xs uppercase tracking-widest hover:underline">Full Audit</button>
                    </div>

                    <div className="overflow-hidden">
                        <table className="w-full text-left order-collapse">
                            <thead>
                                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="pb-4 px-4">Entity</th>
                                    <th className="pb-4 px-4">Program</th>
                                    <th className="pb-4 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentEnrollments.map((enr) => (
                                    <tr key={enr._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xs font-black text-white shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                                                    {enr.student?.name?.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-white uppercase tracking-tight truncate">{enr.student?.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">Node ID: {enr._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-tight">{enr.batch?.course?.title}</p>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                enr.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'
                                            }`}>
                                                {enr.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card-premium p-10 bg-slate-900 border border-white/10 rounded-[40px] relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-500/5 rounded-bl-full pointer-events-none"></div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3"><Zap size={20} className="text-accent-500" /> Quick Actions</h3>
                        
                        <div className="space-y-4">
                            {[
                                { name: 'Launch New Program', path: '/admin/courses', icon: BookOpen, color: 'text-blue-400' },
                                { name: 'Assign Mentors', path: '/admin/courses', icon: Users, color: 'text-purple-400' },
                                { name: 'Financial Audit', path: '/admin/payments', icon: DollarSign, color: 'text-emerald-400' },
                                { name: 'System Settings', path: '/admin/settings', icon: Layout, color: 'text-slate-400' },
                            ].map((act, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(act.path)}
                                    className="w-full p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white hover:text-slate-950 transition-all text-left font-black flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <act.icon size={20} className={act.color} />
                                        <span className="text-[10px] uppercase tracking-widest">{act.name}</span>
                                    </div>
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3 p-4 bg-accent-500/10 rounded-2xl border border-accent-500/20">
                                <Shield className="text-accent-500 shrink-0" size={18} />
                                <p className="text-[10px] font-bold text-accent-500/80 uppercase tracking-widest leading-relaxed">Identity verification protocols active for all new enrollments.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, DollarSign, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, gradient, iconBg }) => (
    <div className={`relative overflow-hidden p-6 rounded-3xl text-white ${gradient} hover:-translate-y-1 transition-all hover:shadow-2xl`}>
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-bl-full pointer-events-none"></div>
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
            <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-4xl font-black tracking-tighter mb-1">{value}</h3>
        <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">{title}</p>
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
                    api.get('/enrollments') // Reusing enrollments for recent activity
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

            if (!data || data.length === 0) {
                alert("No enrollment data available to export.");
                return;
            }

            // Simple CSV generation
            const headers = ["Student Name", "Email", "Program", "Enrollment Date", "Status", "Amount"];
            const csvRows = [
                headers.join(','),
                ...data.map(enr => [
                    `"${enr.student?.name || 'N/A'}"`,
                    `"${enr.student?.email || 'N/A'}"`,
                    `"${enr.batch?.course?.title || 'N/A'}"`,
                    `"${new Date(enr.createdAt).toLocaleDateString()}"`,
                    `"${enr.status}"`,
                    `"${enr.batch?.course?.price || 0}"`
                ].join(','))
            ];

            const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `enrollment_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Export error", error);
            alert("Failed to generate report.");
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-8">
            {/* Hero Header */}
            <div className="relative bg-slate-900 rounded-[32px] p-8 text-white overflow-hidden mb-2">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/40 via-slate-900 to-slate-900 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">All Systems Operational</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Admin Command Center</h1>
                        <p className="text-slate-400 font-medium">Platform metrics, enrollments, and operational controls.</p>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isExporting}
                        className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black flex items-center gap-2 hover:bg-primary-50 transition-all shadow-xl active:scale-95 uppercase text-[10px] tracking-widest whitespace-nowrap disabled:opacity-50"
                    >
                        {isExporting ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : <TrendingUp size={16} />}
                        {isExporting ? 'Generating...' : 'Generate Report'}
                    </button>
                </div>
            </div>

            {/* Gradient Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} gradient="bg-gradient-to-br from-blue-500 to-blue-700" iconBg="bg-white/20" />
                <StatCard title="Total Mentors" value={stats.totalTrainers} icon={Users} gradient="bg-gradient-to-br from-purple-500 to-indigo-700" iconBg="bg-white/20" />
                <StatCard title="Active Programs" value={stats.activeCourses} icon={BookOpen} gradient="bg-gradient-to-br from-primary-500 to-primary-700" iconBg="bg-white/20" />
                <StatCard title="Total Revenue" value={stats.revenue} icon={DollarSign} gradient="bg-gradient-to-br from-emerald-500 to-teal-700" iconBg="bg-white/20" />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card lg:col-span-2 border border-slate-200 rounded-3xl p-8 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"><Activity size={20} className="text-primary-500" /> Recent Enrollments</h3>
                        <button onClick={() => navigate('/admin/payments')} className="text-primary-600 font-bold text-sm hover:underline">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="pb-4 px-4">Student Name</th>
                                    <th className="pb-4 px-4">Program</th>
                                    <th className="pb-4 px-4">Enrollment Date</th>
                                    <th className="pb-4 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentEnrollments.map((enr) => (
                                    <tr key={enr._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-5 px-4 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200">
                                                {enr.student?.name?.charAt(0)}
                                            </div>
                                            <span className="text-xs uppercase tracking-tight">{enr.student?.name}</span>
                                        </td>
                                        <td className="py-5 px-4 text-xs font-bold text-slate-600 uppercase">{enr.batch?.course?.title}</td>
                                        <td className="py-5 px-4 text-[10px] font-black text-slate-400 uppercase">{new Date(enr.createdAt).toLocaleDateString()}</td>
                                        <td className="py-5 px-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${enr.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                {enr.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentEnrollments.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No recent activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col h-full shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-600/20 rounded-bl-full pointer-events-none"></div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-8 flex items-center gap-2"><ChevronRight size={18} className="text-primary-400" /> Quick Actions</h3>
                    <div className="space-y-4 relative z-10 flex-grow">
                        <button
                            onClick={() => navigate('/admin/courses')}
                            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left font-bold text-white transition-all flex items-center gap-4 group"
                        >
                            <div className="p-2.5 bg-primary-500/20 text-primary-400 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-sm uppercase tracking-tight">Create New Program</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/courses')}
                            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left font-bold text-white transition-all flex items-center gap-4 group"
                        >
                            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Users size={20} />
                            </div>
                            <span className="text-sm uppercase tracking-tight">Assign Cohort Mentor</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/payments')}
                            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-left font-bold text-white transition-all flex items-center gap-4 group"
                        >
                            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-sm uppercase tracking-tight">View Financial Reports</span>
                        </button>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Tip: Use the search bar in catalog for faster navigation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

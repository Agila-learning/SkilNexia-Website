import React, { useState } from 'react';
import { Users, BookOpen, GraduationCap, DollarSign, ChevronRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="glass-card flex items-center gap-6 p-6 hover:-translate-y-1 transition-transform border border-slate-200 shadow-sm bg-white">
        <div className={`p-4 rounded-xl ${bg} text-${color} border border-${color.split('-')[0]}-100`}>
            <Icon size={32} />
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 1245,
        totalTrainers: 48,
        activeCourses: 24,
        revenue: '$45,200'
    });

    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Platform Overview</h1>
                    <p className="text-slate-500 font-medium">Welcome to your administrative dashboard. Monitor growth and revenue.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    Generate Report <ChevronRight size={18} />
                </button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} icon={GraduationCap} color="blue-600" bg="bg-blue-50" />
                <StatCard title="Total Mentors" value={stats.totalTrainers} icon={Users} color="purple-600" bg="bg-purple-50" />
                <StatCard title="Active Programs" value={stats.activeCourses} icon={BookOpen} color="primary-600" bg="bg-primary-50" />
                <StatCard title="Total Revenue" value={stats.revenue} icon={DollarSign} color="emerald-600" bg="bg-emerald-50" />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                <div className="glass-card lg:col-span-2 border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Recent Enrollments</h3>
                        <a href="#" className="text-primary-600 font-bold text-sm hover:underline">View All</a>
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
                            <tbody className="text-sm font-medium text-slate-700">
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-4 font-bold text-slate-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">AJ</div>
                                        Alex Johnson
                                    </td>
                                    <td className="py-5 px-4">Full Stack Web Dev</td>
                                    <td className="py-5 px-4 text-slate-500">Oct 24, 2023</td>
                                    <td className="py-5 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-4 font-bold text-slate-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">SS</div>
                                        Sarah Smith
                                    </td>
                                    <td className="py-5 px-4">UI/UX Masterclass</td>
                                    <td className="py-5 px-4 text-slate-500">Oct 23, 2023</td>
                                    <td className="py-5 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-card border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <button className="w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-sm text-left font-bold text-slate-700 transition-all flex items-center gap-4 group">
                            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg group-hover:bg-primary-100 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            Create New Program
                        </button>
                        <button className="w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm text-left font-bold text-slate-700 transition-all flex items-center gap-4 group">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <Users size={20} />
                            </div>
                            Assign Cohort Mentor
                        </button>
                        <button className="w-full p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm text-left font-bold text-slate-700 transition-all flex items-center gap-4 group">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                <DollarSign size={20} />
                            </div>
                            View Financial Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

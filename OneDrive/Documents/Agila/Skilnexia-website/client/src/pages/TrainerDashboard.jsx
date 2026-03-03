import React from 'react';
import { Users, Video, BookOpen, Clock, ChevronRight } from 'lucide-react';

const TrainerDashboard = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Trainer Overview</h1>
                    <p className="text-slate-500 font-medium">Manage your cohorts, lectures, and placements monitoring.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    Upload Lecture <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Premium White Stat Cards */}
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Mentees</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">156</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Cohorts</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">4</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <Video size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Lectures Uploaded</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">42</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Hours Mentored</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">128h</h3>
                    </div>
                </div>
            </div>

            <div className="mt-10 glass-card border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Upcoming Live Sessions</h3>
                    <a href="#" className="text-primary-600 font-bold text-sm hover:underline">View Full Schedule</a>
                </div>

                <div className="space-y-4">
                    {/* Session Items */}
                    <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center text-primary-700 font-bold border border-primary-100">
                                <span className="text-xs uppercase">Oct</span>
                                <span className="text-xl leading-none">25</span>
                            </div>
                            <div>
                                <h4 className="text-slate-900 font-bold text-lg mb-1">Full Stack Web Dev - Cohort A</h4>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" /> 10:00 AM - 12:00 PM • Zoom Live
                                </p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm">Start Session</button>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-700 font-bold border border-blue-100">
                                <span className="text-xs uppercase">Oct</span>
                                <span className="text-xl leading-none">26</span>
                            </div>
                            <div>
                                <h4 className="text-slate-900 font-bold text-lg mb-1">Backend Masterclass - Cohort B</h4>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" /> 2:00 PM - 4:00 PM • Zoom Live
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-lg border border-slate-200">Starting Tomorrow</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;

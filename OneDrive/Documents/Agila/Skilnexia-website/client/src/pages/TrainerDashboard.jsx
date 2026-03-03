import React, { useState, useEffect } from 'react';
import { Users, Video, BookOpen, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';

const TrainerDashboard = () => {
    const [stats, setStats] = useState({ totalMentees: 0, activeCohorts: 0, lecturesUploaded: 0, hoursMentored: 0 });
    const [batches, setBatches] = useState([]);
    const [meetingLinks, setMeetingLinks] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/courses/trainer/dashboard');
                if (res.data) {
                    setStats(res.data.stats || { totalMentees: 0, activeCohorts: 0, lecturesUploaded: 0, hoursMentored: 0 });
                    setBatches(res.data.batches || []);
                    const links = {};
                    (res.data.batches || []).forEach(b => {
                        links[b._id] = b.meetingLink || '';
                    });
                    setMeetingLinks(links);
                }
            } catch (error) {
                console.error("Failed to fetch trainer dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLinkChange = (batchId, value) => {
        setMeetingLinks(prev => ({ ...prev, [batchId]: value }));
    };

    const updateLink = async (courseId, batchId) => {
        try {
            await api.put(`/courses/${courseId}/batches/${batchId}`, { meetingLink: meetingLinks[batchId] });
            alert("Meeting link updated successfully!");
        } catch (error) {
            console.error("Failed to update meeting link", error);
            alert("Error updating meeting link");
        }
    };

    const completeBatch = async (courseId, batchId) => {
        if (!window.confirm("Are you sure you want to mark this batch as completed? Certificates will be generated for all students.")) return;
        try {
            await api.put(`/courses/${courseId}/batches/${batchId}/complete`);
            alert("Batch completed successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Failed to complete batch", error);
            alert("Error completing batch");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }
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
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats.totalMentees}</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-primary-50 text-primary-600 border border-primary-100">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Active Cohorts</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats.activeCohorts}</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                        <Video size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Lectures Uploaded</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats.lecturesUploaded}</h3>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-6 p-6 border border-slate-200 hover:-translate-y-1 transition-transform">
                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Hours Mentored</p>
                        <h3 className="text-3xl font-extrabold text-slate-900">{stats.hoursMentored}h</h3>
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
                    {batches.length === 0 ? (
                        <div className="p-5 text-center text-slate-500 font-medium bg-slate-50 rounded-xl border border-slate-200">
                            You have no upcoming live sessions yet.
                        </div>
                    ) : (
                        batches.map((batch) => {
                            const d = new Date(batch.startDate);
                            const month = d.toLocaleString('en-US', { month: 'short' });
                            const day = d.getDate();
                            const isStartingTomorrow = (d.getTime() - new Date().getTime()) < 86400000 && (d.getTime() - new Date().getTime()) > 0;

                            return (
                                <div key={batch._id} className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center text-primary-700 font-bold border border-primary-100">
                                            <span className="text-xs uppercase">{month}</span>
                                            <span className="text-xl leading-none">{day}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 font-bold text-lg mb-1">{batch.course?.title} - {batch.name}</h4>
                                            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                <Clock size={14} className="text-slate-400" /> {batch.schedule || "Not scheduled"}
                                            </p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Zoom/GMeet Link"
                                                    value={meetingLinks[batch._id] || ''}
                                                    onChange={(e) => handleLinkChange(batch._id, e.target.value)}
                                                    className="w-full sm:w-64 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                                />
                                                <button
                                                    onClick={() => updateLink(batch.course._id, batch._id)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {isStartingTomorrow && <div className="px-4 py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-lg border border-slate-200 text-center">Starting Tomorrow</div>}
                                        <button
                                            onClick={() => meetingLinks[batch._id] ? window.open(meetingLinks[batch._id], '_blank') : alert('Please set a meeting link first')}
                                            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm whitespace-nowrap"
                                        >
                                            Start Session
                                        </button>
                                        <button
                                            onClick={() => completeBatch(batch.course._id, batch._id)}
                                            className="px-6 py-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold rounded-lg text-xs transition-colors shadow-sm whitespace-nowrap"
                                        >
                                            Mark Completed
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;

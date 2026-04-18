import React, { useState, useEffect } from 'react';
import { Users, Calendar, BookOpen, ChevronRight, GraduationCap, Video, FileText } from 'lucide-react';
import api from '../../services/api';

const MyBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await api.get('/courses/trainer/dashboard');
                setBatches(res.data.batches || []);
            } catch (error) {
                console.error("Failed to fetch batches", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBatches();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white mb-1 tracking-tight uppercase">My active Batches</h1>
                <p className="text-slate-400 font-medium">Manage your cohorts, monitor student performance and track curriculum coverage.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {batches.map(batch => (
                    <div key={batch._id} className="glass-card bg-white border border-slate-200 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-primary-200 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[32px] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                                {batch.course?.thumbnail ? (
                                    <img src={batch.course.thumbnail} alt="" className="w-full h-full object-cover rounded-[32px]" />
                                ) : (
                                    <BookOpen size={32} />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">{batch.name}</h3>
                                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">{batch.course?.title}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                                        <Users size={14} /> {batch.students?.length || 0} Mentees
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                                        <Calendar size={14} /> Start: {new Date(batch.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                                <GraduationCap size={16} /> Students
                            </button>
                            <button className="px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
                                <FileText size={16} /> Tasks
                            </button>
                            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-primary-100 flex items-center gap-2">
                                <Video size={16} /> Live Session
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBatches;

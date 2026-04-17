import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Filter, Mail, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const PipelineView = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            setLeads(res.data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (id, status) => {
        try {
            await api.put(`/leads/${id}/status`, { status });
            fetchLeads();
        } catch (error) {
            alert("Update failed");
        }
    };

    const columns = [
        { id: 'New', title: 'Incoming Discovery', bg: 'bg-white/5', text: 'text-white' },
        { id: 'Interview Scheduled', title: 'Tactical Interview', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
        { id: 'Offer Extended', title: 'Final Authorization', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
        { id: 'Payment Pending', title: 'Wait for Pay', bg: 'bg-purple-500/10', text: 'text-purple-400' },
        { id: 'Converted', title: 'Full Conversion', bg: 'bg-emerald-500/10', text: 'text-emerald-400' }
    ];

    if (loading) return <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4"><div className="w-10 h-10 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Pipeline Data...</p></div>;

    return (
        <div className="animate-fade-in space-y-12 h-full flex flex-col pb-10">
            <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight uppercase">Talent Trajectory</h1>
                <p className="text-slate-400 font-medium">Map candidate nodes from initial discovery to final system integration.</p>
            </div>

            <div className="flex-grow flex gap-8 overflow-x-auto pb-8 -mx-4 px-4 custom-scrollbar">
                {columns.map(col => (
                    <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-6">
                        <div className={`p-6 rounded-[28px] ${col.bg} border border-white/5 flex items-center justify-between backdrop-blur-xl shadow-2xl`}>
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${col.text}`}>{col.title}</h3>
                            <span className="text-[10px] font-black bg-white/10 text-white px-3 py-1 rounded-xl border border-white/10">{leads.filter(l => l.status === col.id).length}</span>
                        </div>

                        <div className="flex-grow space-y-6">
                            {leads.filter(l => l.status === col.id).map(lead => (
                                <div key={lead._id} className="glass-card-premium bg-slate-900/40 p-6 rounded-[32px] border border-white/5 shadow-2xl hover:border-white/20 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition-all"></div>
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">{lead.courseId?.title || 'Inquiry Node'}</span>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={14} className="text-accent-500" />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight mb-6 leading-tight truncate">{lead.fullName || lead.name}</h4>

                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                            <button
                                                onClick={() => {
                                                    const currentIndex = columns.findIndex(c => c.id === col.id);
                                                    const next = columns[currentIndex + 1]?.id;
                                                    if (next) updateLeadStatus(lead._id, next);
                                                }}
                                                className="flex-grow py-3 bg-white/5 hover:bg-white text-slate-400 hover:text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10"
                                            >
                                                Advance Node
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-white transition-colors"><AlertCircle size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PipelineView;

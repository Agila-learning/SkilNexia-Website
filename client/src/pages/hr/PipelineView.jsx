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
        { id: 'New', title: 'Incoming', bg: 'bg-slate-100', text: 'text-slate-600' },
        { id: 'Interview Scheduled', title: 'Interviewing', bg: 'bg-blue-100', text: 'text-blue-600' },
        { id: 'Offer Extended', title: 'Offer Made', bg: 'bg-indigo-100', text: 'text-indigo-600' },
        { id: 'Payment Pending', title: 'Awaiting Pay', bg: 'bg-purple-100', text: 'text-purple-600' },
        { id: 'Converted', title: 'Converted', bg: 'bg-emerald-100', text: 'text-emerald-600' }
    ];

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-8 h-full flex flex-col">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight uppercase">Hiring Pipeline</h1>
                <p className="text-slate-500 font-medium">Track candidates from initial inquiry to final enrollment conversion.</p>
            </div>

            <div className="flex-grow flex gap-6 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-thin">
                {columns.map(col => (
                    <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                        <div className={`p-4 rounded-2xl ${col.bg} flex items-center justify-between`}>
                            <h3 className={`text-xs font-black uppercase tracking-widest ${col.text}`}>{col.title}</h3>
                            <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-lg">{leads.filter(l => l.status === col.id).length}</span>
                        </div>

                        <div className="flex-grow space-y-4">
                            {leads.filter(l => l.status === col.id).map(lead => (
                                <div key={lead._id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-grab active:cursor-grabbing group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lead.courseId?.title || 'Inquiry'}</span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight size={14} className="text-slate-300" />
                                        </div>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">{lead.name}</h4>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                        <button
                                            onClick={() => {
                                                const currentIndex = columns.findIndex(c => c.id === col.id);
                                                const next = columns[currentIndex + 1]?.id;
                                                if (next) updateLeadStatus(lead._id, next);
                                            }}
                                            className="flex-grow py-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
                                        >
                                            Move Forward
                                        </button>
                                        <button className="p-2 text-slate-300 hover:text-slate-600"><AlertCircle size={16} /></button>
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

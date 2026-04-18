import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, BookOpen, Clock, CheckCircle, XCircle, ChevronRight, Activity, TrendingUp, Shield, Zap, Search, Filter } from 'lucide-react';
import gsap from 'gsap';
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

const HRDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pipeline, referrals
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
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

        fetchLeads();
    }, []);

    useEffect(() => {
        if (!loading) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.premium-reveal',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, activeTab]);

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await api.put(`/leads/${leadId}`, { status: newStatus });
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const generatePaymentLink = async (leadId) => {
        try {
            await api.put(`/leads/${leadId}`, { status: 'Payment Pending' });
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: 'Payment Pending' } : lead));
            const link = `${window.location.origin}/checkout?leadId=${leadId}`;
            alert(`Payment Link Generated & Sent to Candidate!\n\nLink: ${link}`);
        } catch (error) {
            console.error("Failed to generate link", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Contacted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Converted': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Payment Pending': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'Interview Scheduled': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'Offer Extended': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const filteredLeads = leads.filter(l => {
        const matchesSearch = (l.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (l.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || 
                         (activeTab === 'pipeline' && ['Interview Scheduled', 'Offer Extended', 'Converted'].includes(l.status)) ||
                         (activeTab === 'referrals' && l.source === 'Referral');
        return matchesSearch && matchesTab;
    });

    if (loading) return <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4"><div className="w-10 h-10 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Talent Node...</p></div>;

    return (
        <div className="space-y-12 animate-fade-in pb-20 font-sans">
            
            {/* 1. OPERATIONS HEADER */}
            <div className="premium-reveal relative p-12 rounded-[40px] bg-slate-900 border border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            <Shield className="text-cyan-500" size={12} />
                            <span className="text-cyan-500 text-[10px] font-black uppercase tracking-widest">Recruitment Ops Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Talent Hub <br /><span className="text-accent-500">Pipeline Alpha.</span></h1>
                        <p className="text-slate-400 font-medium max-w-lg">Manage elite candidate transitions, alumni referrals, and enrollment conversion trajectories from a unified node.</p>
                    </div>
                    
                    <div className="flex bg-slate-950/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
                        {['all', 'pipeline', 'referrals'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl ${activeTab === tab ? 'bg-white text-slate-950 shadow-white/5' : 'text-slate-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. CORE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Candidates" value={leads.length} icon={Users} color="text-cyan-500" bg="bg-cyan-500/10" />
                <StatCard title="Active Pipeline" value={leads.filter(l => l.status === 'Interview Scheduled').length} icon={Clock} color="text-indigo-500" bg="bg-indigo-500/10" />
                <StatCard title="Converted Nodes" value={leads.filter(l => l.status === 'Converted').length} icon={CheckCircle} color="text-emerald-500" bg="bg-emerald-500/10" />
                <StatCard title="Awaiting Pay" value={leads.filter(l => l.status === 'Payment Pending').length} icon={BookOpen} color="text-purple-500" bg="bg-purple-500/10" />
            </div>

            {/* 3. SEARCH & FILTERS */}
            <div className="premium-reveal flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search Talent ID or Entity Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-slate-900 border border-white/5 rounded-[24px] text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500 transition-all shadow-2xl"
                    />
                </div>
                <button className="flex items-center gap-3 px-8 py-5 bg-slate-900 border border-white/5 text-slate-400 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:text-white transition-all shadow-2xl">
                    <Filter size={18} /> Advanced Nodes
                </button>
            </div>

            {/* 4. DATA TABLE */}
            <div className="premium-reveal glass-card-premium border border-white/5 rounded-[40px] p-10 bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left order-collapse">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="pb-6 px-4">Entity Identity</th>
                                <th className="pb-6 px-4">Origin Hub</th>
                                <th className="pb-6 px-4 text-center">Protocol Status</th>
                                <th className="pb-6 px-4 text-right">System Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No matching nodes found in current hub.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-8 px-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-sm font-black text-white shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                                                    {lead.fullName?.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-base font-black text-white uppercase tracking-tight truncate leading-none mb-2">{lead.fullName}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{lead.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-4">
                                            <div className="space-y-1.5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${lead.source === 'Referral' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/5' : 'bg-slate-500/10 text-slate-500 border-white/10'}`}>
                                                    {lead.source}
                                                </span>
                                                <p className="text-xs font-bold text-slate-400 capitalize">{lead.courseId?.title || 'General Pipeline'}</p>
                                            </div>
                                        </td>
                                        <td className="py-8 px-4 text-center">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 bg-slate-950 focus:outline-none focus:ring-4 focus:ring-accent-500/20 transition-all cursor-pointer ${getStatusColor(lead.status)} shadow-2xl shadow-black/40`}
                                            >
                                                <option value="New">New Discovery</option>
                                                <option value="Contacted">Outreach Sent</option>
                                                <option value="Interview Scheduled">Interview Stage</option>
                                                <option value="Offer Extended">Offer Phase</option>
                                                <option value="Payment Pending">Wait for Pay</option>
                                                <option value="Converted">Unified Node</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="py-8 px-4 text-right">
                                            {lead.status !== 'Converted' ? (
                                                <button
                                                    onClick={() => generatePaymentLink(lead._id)}
                                                    className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl active:scale-95 group/btn flex items-center gap-2 ml-auto"
                                                >
                                                    <Zap size={14} className="group-hover/btn:fill-current" /> Push Link
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                                                    <CheckCircle size={14} /> Full Conversion
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;

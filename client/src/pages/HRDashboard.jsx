import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';

const HRDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all'); // all, pipeline, referrals

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
        if (!loading && leads.length > 0) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.stat-card',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );
                gsap.fromTo('.lead-row',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, leads, activeTab]);

    const handleStatusChange = async (leadId, newStatus) => {
        try {
            await api.put(`/leads/${leadId}`, { status: newStatus });
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: newStatus } : lead));
            alert(`Lead status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating status");
        }
    };

    const generatePaymentLink = async (leadId) => {
        try {
            // In a real app, this might call a backend to create a Stripe/Razorpay link
            // For now, we update status to Payment Pending and simulate the link
            await api.put(`/leads/${leadId}`, { status: 'Payment Pending' });
            setLeads(leads.map(lead => lead._id === leadId ? { ...lead, status: 'Payment Pending' } : lead));

            const link = `${window.location.origin}/checkout?leadId=${leadId}`;
            alert(`Payment Link Generated & Sent to Candidate!\n\nLink: ${link}`);
            // In real app, send this link via email/whatsapp
        } catch (error) {
            console.error("Failed to generate link", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Contacted': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Converted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Payment Pending': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'Interview Scheduled': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'Offer Extended': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const filteredLeads = leads.filter(l => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pipeline') return ['Interview Scheduled', 'Offer Extended', 'Converted'].includes(l.status);
        if (activeTab === 'referrals') return l.source === 'Referral';
        return true;
    });

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">HR Control Center</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage pipeline dynamics, referrals, and candidate conversion trajectories.</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    {['all', 'pipeline', 'referrals'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-cyan-700 shadow-sm ring-1 ring-cyan-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card bg-slate-900 text-white p-6 flex flex-col items-start justify-between border border-slate-800 rounded-2xl hover:shadow-xl hover:shadow-cyan-900/20 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-0 group-hover:bg-cyan-500/20 transition-colors"></div>
                    <div className="p-3 bg-white/10 rounded-xl text-cyan-400 mb-6 relative z-10"><Users size={24} /></div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-1">{leads.length}</h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Candidates</span>
                    </div>
                </div>
                <div className="stat-card bg-white p-6 flex flex-col items-start justify-between border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-slate-200 transition-all">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 mb-6"><Clock size={24} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">
                            {leads.filter(l => l.status === 'Interview Scheduled').length}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">In Pipeline</span>
                    </div>
                </div>
                <div className="stat-card bg-white p-6 flex flex-col items-start justify-between border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-slate-200 transition-all">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 mb-6"><CheckCircle size={24} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">
                            {leads.filter(l => l.status === 'Converted').length}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Converted</span>
                    </div>
                </div>
                <div className="stat-card bg-white p-6 flex flex-col items-start justify-between border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-slate-200 transition-all">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600 mb-6"><BookOpen size={24} /></div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-1">
                            {leads.filter(l => l.status === 'Payment Pending').length}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Awaiting Payment</span>
                    </div>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                                <th className="p-4 px-6">Candidate</th>
                                <th className="p-4 px-6">Source</th>
                                <th className="p-4 px-6">Course</th>
                                <th className="p-4 px-6 text-center">Status</th>
                                <th className="p-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No candidates found in this view.</td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="lead-row hover:bg-slate-50 transition-colors">
                                        <td className="p-4 px-6">
                                            <div className="font-bold text-slate-900">{lead.fullName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{lead.email}</div>
                                        </td>
                                        <td className="p-4 px-6">
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${lead.source === 'Referral' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                {lead.source}
                                            </span>
                                        </td>
                                        <td className="p-4 px-6 font-medium text-slate-700">
                                            {lead.courseId?.title || 'General'}
                                        </td>
                                        <td className="p-4 px-6 text-center">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border cursor-pointer outline-none ${getStatusColor(lead.status)}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Interview Scheduled">Interview</option>
                                                <option value="Offer Extended">Offer</option>
                                                <option value="Payment Pending">Awaiting Pay</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td className="p-4 px-6 text-right">
                                            {lead.status !== 'Converted' && (
                                                <button
                                                    onClick={() => generatePaymentLink(lead._id)}
                                                    className="px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary-900 transition-all shadow-sm active:scale-95"
                                                >
                                                    Send Payment Link
                                                </button>
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

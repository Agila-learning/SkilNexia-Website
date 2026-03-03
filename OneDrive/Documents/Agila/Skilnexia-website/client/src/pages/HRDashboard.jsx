import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';

const HRDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

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
    }, [loading, leads]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Contacted': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Converted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Payment Pending': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">HR Lead Management</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage consultation requests and track student conversion.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3 border border-blue-100"><Users size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900">{leads.length}</h3>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Leads</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-3 border border-amber-100"><Clock size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900">
                        {leads.filter(l => l.status === 'New').length}
                    </h3>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">New Requests</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-500 mb-3 border border-emerald-100"><CheckCircle size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900">
                        {leads.filter(l => l.status === 'Converted').length}
                    </h3>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Converted</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-purple-50 rounded-full text-purple-500 mb-3 border border-purple-100"><BookOpen size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900">
                        {leads.filter(l => l.status === 'Payment Pending').length}
                    </h3>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Awaiting Payment</span>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                                <th className="p-4 px-6">Candidate</th>
                                <th className="p-4 px-6">Contact Info</th>
                                <th className="p-4 px-6">Course Requested</th>
                                <th className="p-4 px-6">Message</th>
                                <th className="p-4 px-6 text-center">Date</th>
                                <th className="p-4 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">No consultation leads found.</td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead._id} className="lead-row hover:bg-slate-50 transition-colors">
                                        <td className="p-4 px-6 font-bold text-slate-900">
                                            {lead.fullName}
                                        </td>
                                        <td className="p-4 px-6 text-sm text-slate-600 space-y-1">
                                            <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {lead.email}</div>
                                            <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {lead.phone}</div>
                                        </td>
                                        <td className="p-4 px-6 font-medium text-slate-700">
                                            {lead.courseId?.title || 'Unknown Course'}
                                        </td>
                                        <td className="p-4 px-6 text-sm text-slate-500 max-w-[200px] truncate" title={lead.message}>
                                            {lead.message || '-'}
                                        </td>
                                        <td className="p-4 px-6 text-sm text-slate-500 text-center">
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 px-6 text-center">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border cursor-pointer outline-none appearance-none text-center ${getStatusColor(lead.status)}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Payment Pending">Convert (Payment Link)</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
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

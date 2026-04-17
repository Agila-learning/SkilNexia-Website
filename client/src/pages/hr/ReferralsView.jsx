import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Filter, Download, MoreHorizontal, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const ReferralsView = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const res = await api.get('/leads');
                // Filter leads that have a referral note or specific status
                setReferrals(res.data); // Show all referrals so HR can track pipeline across statuses
            } catch (error) {
                console.error("Failed to fetch referrals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, []);

    const exportToCSV = () => {
        if (!referrals.length) return;
        const headers = ['Name', 'Email', 'Phone', 'Program', 'Source', 'Status', 'Date'];
        const csvRows = referrals.map(lead => [
            lead.name || lead.fullName,
            lead.email,
            lead.phone,
            lead.courseId?.title || 'General',
            lead.referralSource || 'Direct',
            lead.status,
            new Date(lead.createdAt).toLocaleDateString()
        ].map(val => `"${val}"`).join(','));

        const csvData = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Candidates_Export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleReview = async (leadId) => {
        try {
            await api.put(`/leads/${leadId}`, { status: 'Payment Pending' });
            setReferrals(referrals.map(l => l._id === leadId ? { ...l, status: 'Payment Pending' } : l));
            alert("Candidate moved to Payment Pending state.");
        } catch (error) {
            console.error("Failed to review lead", error);
            alert("Error updating candidate status.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-1 tracking-tight uppercase">Legacy Referrals</h1>
                    <p className="text-slate-400 font-medium">Verify incoming candidate nodes and audit referral signal quality.</p>
                </div>
                <button onClick={exportToCSV} className="px-8 py-4 bg-white text-slate-950 rounded-[22px] font-black flex items-center gap-3 hover:bg-accent-500 hover:text-white transition-all shadow-2xl text-[10px] uppercase tracking-widest active:scale-95">
                    <Download size={18} /> Export Payload
                </button>
            </div>

            <div className="glass-card-premium border border-white/5 rounded-[48px] bg-slate-900/40 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="py-6 px-10">Candidate Node</th>
                                <th className="py-6 px-10">Program Designation</th>
                                <th className="py-6 px-10">Origin Hub</th>
                                <th className="py-6 px-10">Sync Date</th>
                                <th className="py-6 px-10 text-right">Directive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {referrals.map((lead) => (
                                <tr key={lead._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-sm font-black text-white shadow-xl border border-white/10 group-hover:scale-110 transition-transform">
                                                {lead.fullName?.charAt(0) || lead.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-white uppercase tracking-tight leading-none mb-1.5">{lead.fullName || lead.name}</p>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lead.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10">
                                        <span className="text-[9px] font-black text-accent-500 uppercase tracking-widest bg-accent-500/10 px-4 py-2 rounded-xl border border-accent-500/20 shadow-lg shadow-accent-500/5">
                                            {lead.courseId?.title || 'General Pipeline'}
                                        </span>
                                    </td>
                                    <td className="py-8 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {lead.referralSource || 'Direct Entry'}
                                    </td>
                                    <td className="py-8 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        {lead.status === 'New' ? (
                                            <button onClick={() => handleReview(lead._id)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95 shadow-2xl">
                                                Review Node
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-slate-500 font-black text-[9px] uppercase tracking-[0.2em]">
                                                <CheckCircle size={14} className="text-emerald-500/50" /> {lead.status}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReferralsView;

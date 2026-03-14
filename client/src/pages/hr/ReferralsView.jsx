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
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight uppercase">Candidate Referrals</h1>
                    <p className="text-slate-500 font-medium">Verify incoming applications and manage referral quality.</p>
                </div>
                <button onClick={exportToCSV} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg text-[10px] uppercase tracking-widest">
                    <Download size={18} /> Export List
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="py-5 px-8">Candidate</th>
                                <th className="py-5 px-8">Program</th>
                                <th className="py-5 px-8">Source</th>
                                <th className="py-5 px-8">Date</th>
                                <th className="py-5 px-8 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {referrals.map((lead) => (
                                <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600 uppercase">
                                                {lead.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{lead.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{lead.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                                            {lead.courseId?.title || 'General Inquiry'}
                                        </span>
                                    </td>
                                    <td className="py-6 px-8 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                        {lead.referralSource || 'Direct Search'}
                                    </td>
                                    <td className="py-6 px-8 text-xs font-bold text-slate-400 uppercase">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        {lead.status === 'New' ? (
                                            <button onClick={() => handleReview(lead._id)} className="px-4 py-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-emerald-100">
                                                Review
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lead.status}</span>
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

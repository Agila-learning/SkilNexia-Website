import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, Search, User } from 'lucide-react';
import api from '../services/api';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showGenModal, setShowGenModal] = useState(false);
    const [genData, setGenData] = useState({ email: '', amount: '', purpose: 'Course Enrollment' });
    const [genLink, setGenLink] = useState('');

    const handleGenerateLink = (e) => {
        e.preventDefault();
        // Construct a dummy payment link for demonstration
        const link = `${window.location.origin}/checkout?email=${encodeURIComponent(genData.email)}&amount=${genData.amount}&purpose=${encodeURIComponent(genData.purpose)}`;
        setGenLink(link);
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await api.get('/payments');
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch all payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        (p.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.student?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.enrollment?.batch?.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.razorpayOrderId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Revenue Stream</h1>
                    <p className="text-slate-400 font-medium">Audit platform-wide transaction nodes and verified financial credits.</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                    <button 
                        onClick={() => setShowGenModal(true)}
                        className="px-8 py-4 bg-accent-500 text-white rounded-[22px] font-black text-[11px] uppercase tracking-widest hover:bg-accent-600 transition-all shadow-xl shadow-accent-500/20 active:scale-95 flex items-center gap-3"
                    >
                        Generate Link <CreditCard size={18} />
                    </button>
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search student, email, course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[22px] text-white font-bold placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500 transition-all outline-none text-sm"
                        />
                    </div>
                </div>
            </div>

            {showGenModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowGenModal(false)}></div>
                    <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[40px] p-10 shadow-3xl animate-in-scale">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Generate Payment Node</h3>
                        <form className="space-y-6" onSubmit={handleGenerateLink}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Student Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent-500 transition-all"
                                    placeholder="student@example.com"
                                    value={genData.email}
                                    onChange={(e) => setGenData({...genData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent-500 transition-all"
                                        placeholder="5000"
                                        value={genData.amount}
                                        onChange={(e) => setGenData({...genData, amount: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Purpose</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-accent-500 transition-all"
                                        placeholder="Course Enrollment"
                                        value={genData.purpose}
                                        onChange={(e) => setGenData({...genData, purpose: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            {genLink && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Generated Link Node:</p>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            readOnly 
                                            value={genLink} 
                                            className="flex-grow bg-transparent text-xs font-mono text-emerald-400 focus:outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(genLink);
                                                alert('Link copied to clipboard');
                                            }}
                                            className="text-[10px] font-black text-white uppercase bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowGenModal(false)} className="flex-grow py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                                <button type="submit" className="w-2/3 py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all">Generate Link</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-card-premium border border-white/5 rounded-[48px] bg-slate-900/40 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="py-6 px-10">Transaction ID</th>
                                <th className="py-6 px-10">Entity Node</th>
                                <th className="py-6 px-10">Program</th>
                                <th className="py-6 px-10">Timestamp</th>
                                <th className="py-6 px-10">Value</th>
                                <th className="py-6 px-10 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-24 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <CreditCard size={48} className="mx-auto" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Transactions Vaulted</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-8 px-10 text-[10px] font-mono font-bold text-slate-500 tracking-wider group-hover:text-accent-500 transition-colors">
                                            {payment.razorpayOrderId || payment._id}
                                        </td>
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-black text-white text-xs shadow-lg border border-white/10">
                                                    {payment.student?.name?.charAt(0) || <User size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1.5">{payment.student?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">{payment.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-10 text-xs font-black text-slate-300 uppercase tracking-tight">
                                            {payment.enrollment?.batch?.course?.title || 'System Core'}
                                        </td>
                                        <td className="py-8 px-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-8 px-10 text-base font-black text-white tracking-tighter">
                                            ₹{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="py-8 px-10 text-right">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${payment.status === 'captured' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-slate-500/10 text-slate-500 border-white/5'
                                                }`}>
                                                {payment.status === 'captured' && <CheckCircle size={14} />}
                                                {payment.status}
                                            </div>
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

export default AdminPayments;

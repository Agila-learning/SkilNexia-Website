import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, Search, User } from 'lucide-react';
import api from '../services/api';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        p.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.enrollment?.batch?.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.razorpayOrderId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Ledgers</h1>
                    <p className="text-slate-500 font-medium">System-wide transaction history and financial records.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search student, email, course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full md:w-80 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction ID</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Candidate</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Course</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                                        No payment records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-sm font-bold text-slate-800">
                                            {payment.razorpayOrderId || payment._id}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                    {payment.student?.name?.charAt(0) || <User size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{payment.student?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{payment.student?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-700">
                                            {payment.enrollment?.batch?.course?.title || 'Unknown Course'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm font-black text-slate-900">
                                            ₹{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${payment.status === 'captured' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {payment.status === 'captured' && <CheckCircle size={10} />}
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

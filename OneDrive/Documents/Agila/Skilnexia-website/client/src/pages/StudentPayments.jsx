import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';
import api from '../services/api';
import gsap from 'gsap';

const StudentPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const { data } = await api.get('/payments/my');
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    useEffect(() => {
        if (!loading && payments.length > 0) {
            gsap.fromTo('.payment-row',
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, [loading, payments.length]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment History</h1>
                <p className="text-slate-500 font-medium">View your past transactions and receipts.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Transaction ID</th>
                                <th className="p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Course</th>
                                <th className="p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                                <th className="p-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                                        No payment history found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment._id} className="payment-row border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-sm font-bold text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={16} className="text-primary-500" />
                                                {payment.razorpayOrderId || payment._id}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-slate-700">
                                            {payment.enrollment?.batch?.course?.title || 'Course Enrollment'}
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-black text-slate-900">
                                            ₹{payment.amount.toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'captured' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {payment.status === 'captured' && <CheckCircle size={12} />}
                                                {payment.status.toUpperCase()}
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

export default StudentPayments;

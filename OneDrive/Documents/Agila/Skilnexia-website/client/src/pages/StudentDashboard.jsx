import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Trophy, BarChart, BookOpen, ChevronRight, CreditCard, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

import api from '../services/api';

const CourseCard = ({ title, progress, instructor, thumbnail }) => (
    <div className="glass-card p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200">
        <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
            {thumbnail ? (
                <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <PlayCircle size={48} className="text-slate-400" />
                </div>
            )}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
                <h4 className="font-bold text-white leading-tight mb-1 line-clamp-2">{title}</h4>
                <p className="text-xs text-slate-200 font-medium">By {instructor}</p>
            </div>
        </div>
        <div className="p-5 bg-white">
            <div className="flex justify-between text-xs text-slate-500 font-bold mb-2">
                <span>Progress Overview</span>
                <span className="text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="w-full py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-primary-200">
                <PlayCircle size={18} /> Resume Learning
            </button>
        </div>
    </div>
);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [pendingLeads, setPendingLeads] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [stats, setStats] = useState({ passed: 0, active: 0, time: '0h', avgScore: '0%' });
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [enrRes, leadsRes, certRes] = await Promise.all([
                    api.get('/enrollments'),
                    api.get('/leads/me'),
                    api.get('/certificates/my')
                ]);

                const data = enrRes.data || [];
                setEnrollments(data);

                const myLeads = leadsRes.data || [];
                setPendingLeads(myLeads.filter(l => l.status === 'Payment Pending'));

                setCertificates(certRes.data || []);

                let active = 0;
                let passed = 0;
                let totalProgress = 0;

                data.forEach(enr => {
                    if (enr.progress === 100) passed++;
                    else active++;
                    totalProgress += (enr.progress || 0);
                });

                const avgScore = data.length > 0 ? Math.round(totalProgress / data.length) : 0;
                const timeStr = active > 0 || passed > 0 ? `${(active + passed) * 15}h` : '0h';

                setStats({
                    passed,
                    active,
                    time: timeStr,
                    avgScore: `${avgScore}%`
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.stat-card',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );

                if (enrollments.length > 0) {
                    gsap.fromTo('.dashboard-course-card',
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', delay: 0.2 }
                    );
                }
            });
            return () => ctx.revert();
        }
    }, [loading, enrollments.length]);

    const handlePayment = async (leadId) => {
        try {
            setProcessingPayment(true);

            const loadScript = () => new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });

            const resScript = await loadScript();
            if (!resScript) {
                alert("Razorpay SDK failed to load. Are you offline?");
                setProcessingPayment(false);
                return;
            }

            const { data: { key } } = await api.get('/payments/razorpay-key');
            const orderRes = await api.post('/payments/create-order', { leadId });
            const { amount, orderId, enrollmentId } = orderRes.data;

            const options = {
                key,
                amount: amount.toString(),
                currency: "INR",
                name: "Skilnexia",
                description: `Enrollment Payment`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const result = await api.post('/payments/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            enrollmentId,
                            leadId
                        });

                        if (result.data.success) {
                            alert("Payment successful! Refreshing your dashboard.");
                            window.location.reload();
                        }
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                        console.error(err);
                    }
                },
                prefill: {
                    name: user?.name || "Student",
                    email: user?.email || "",
                },
                theme: { color: "#0f172a" }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert(error.response?.data?.message || "Failed to initiate payment");
        } finally {
            setProcessingPayment(false);
        }
    };

    const downloadCertificate = async (id, title) => {
        try {
            const res = await api.get(`/certificates/${id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}_Certificate.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download certificate", error);
            alert("Error downloading certificate.");
        }
    };

    if (loading || processingPayment) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }
    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Learning Journey</h1>
                    <p className="text-slate-500 font-medium">Continue where you left off and fast-track your career.</p>
                </div>
                <Link to="/courses" className="hidden sm:flex text-primary-600 font-bold items-center gap-1 hover:text-primary-800 transition-colors">
                    Explore New Programs <ChevronRight size={18} />
                </Link>
            </div>

            {/* Quick Stats - Premium Light Look */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-3 border border-amber-100">
                        <Trophy size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">{stats.passed}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Programs Passed</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600 mb-3 border border-primary-100">
                        <PlayCircle size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">{stats.active}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Programs</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3 border border-blue-100">
                        <Clock size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">{stats.time}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Learning Time</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mb-3 border border-emerald-100">
                        <BarChart size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">{stats.avgScore}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Assignment Score</span>
                </div>
            </div>

            {/* Pending Payments Section */}
            {pendingLeads.length > 0 && (
                <div className="pt-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <CreditCard className="text-purple-600" /> Pending Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingLeads.map(lead => (
                            <div key={lead._id} className="p-6 rounded-2xl border-2 border-purple-100 bg-purple-50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <div className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Approved by HR</div>
                                    <h4 className="text-lg font-black text-slate-900">{lead.courseId?.title || 'Course'}</h4>
                                    <p className="text-sm font-medium text-slate-600 mt-1">Complete your payment to join the nearest batch.</p>
                                </div>
                                <button onClick={() => handlePayment(lead._id)} disabled={processingPayment} className="whitespace-nowrap px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors shadow-xl active:scale-95 disabled:opacity-50">
                                    Pay Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enrolled Courses */}
            <div className="pt-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary-600" /> In Progress
                </h2>
                {enrollments.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 mt-4">
                        <p className="text-slate-500 font-medium mb-4">You haven't enrolled in any programs yet.</p>
                        <Link to="/courses" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition">
                            Browse Programs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {enrollments.map(enr => (
                            <div key={enr._id} className="dashboard-course-card">
                                <CourseCard
                                    title={enr.batch?.course?.title || 'Unknown Course'}
                                    progress={enr.progress !== undefined ? enr.progress : 0}
                                    instructor={enr.batch?.trainer?.name || 'Instructor'}
                                    thumbnail={enr.batch?.course?.thumbnail || null}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Certificates Section */}
            {certificates.length > 0 && (
                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Trophy className="text-amber-500" /> My Certificates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map(cert => (
                            <div key={cert._id} className="flex items-center justify-between p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl hover:-translate-y-1 transition-transform border border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 shadow-inner">
                                        <Trophy size={20} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight line-clamp-1">{cert.course?.title}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cert.certificateId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadCertificate(cert._id, cert.course?.title || 'Course')}
                                    className="p-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl transition-colors shrink-0"
                                    title="Download PDF"
                                >
                                    <Download size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentDashboard;

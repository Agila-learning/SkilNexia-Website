import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Trophy, BarChart, BookOpen, ChevronRight, CreditCard, Download, FileText, Send, ExternalLink } from 'lucide-react';
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
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState({ passed: 0, active: 0, time: '0h', avgScore: '0%' });
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Submission modal state
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get('/enrollments'),
                    api.get('/leads/me'),
                    api.get('/certificates/my')
                ]);

                const enrollmentsData = results[0].status === 'fulfilled' ? (results[0].value.data || []) : [];
                setEnrollments(enrollmentsData);

                const leadsData = results[1].status === 'fulfilled' ? (results[1].value.data || []) : [];
                setPendingLeads(leadsData.filter(l => l.status === 'Payment Pending'));

                const certData = results[2].status === 'fulfilled' ? (results[2].value.data || []) : [];
                setCertificates(certData);

                // Fetch assignments for all enrolled courses
                if (enrollmentsData.length > 0) {
                    const assignmentPromises = enrollmentsData.map(enr =>
                        api.get(`/assignments/course/${enr.batch?.course?._id}`)
                            .then(res => res.data.map(a => ({ ...a, courseTitle: enr.batch?.course?.title })))
                            .catch(() => [])
                    );
                    const allAssignments = await Promise.all(assignmentPromises);
                    setAssignments(allAssignments.flat());
                }

                let active = 0;
                let passed = 0;
                let totalProgress = 0;

                enrollmentsData.forEach(enr => {
                    if (enr.progress === 100) passed++;
                    else active++;
                    totalProgress += (enr.progress || 0);
                });

                const avgScore = enrollmentsData.length > 0 ? Math.round(totalProgress / enrollmentsData.length) : 0;
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

    const handleAssignmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/assignments/${selectedAssignment._id}/submit`, { fileUrl: submissionUrl });
            alert("Assignment submitted successfully!");
            setShowSubmitModal(false);
            setSubmissionUrl('');
            // Optionally refresh assignments to show submitted status
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error submitting assignment");
        }
    };

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
                alert("Razorpay SDK failed to load.");
                return;
            }

            let razorpayKey;
            try {
                const keyRes = await api.get('/payments/razorpay-key');
                razorpayKey = keyRes.data.key;
            } catch (err) {
                console.warn("Could not fetch Razorpay key:", err);
            }

            // DEV BYPASS: If no key is set up in backend, simulate a success for testing pipeline
            if (!razorpayKey || razorpayKey === 'undefined') {
                const confirmDev = window.confirm("DEV MODE: Razorpay key is missing. Do you want to simulate a successful payment and bypass checkout?");
                if (confirmDev) {
                    await api.put(`/leads/${leadId}`, { status: 'Converted' }); // Hacky bypass for pipeline demo
                    alert("Payment bypassed! Candidate Converted.");
                    window.location.reload();
                    return;
                } else {
                    alert("Payment cancelled. Setup RAZORPAY_KEY_ID in standard env to test real flow.");
                    return;
                }
            }

            let orderRes;
            try {
                orderRes = await api.post('/payments/create-order', { leadId });
            } catch (err) {
                alert(`Order creation failed: ${err.response?.data?.message || err.message}`);
                return;
            }

            const { amount, orderId, enrollmentId } = orderRes.data;

            const options = {
                key: razorpayKey,
                amount: amount.toString(),
                currency: "INR",
                name: "Skilnexia",
                order_id: orderId,
                handler: async function (response) {
                    try {
                        await api.post('/payments/verify', { ...response, enrollmentId, leadId });
                        alert("Payment successful!");
                        window.location.reload();
                    } catch (verifyErr) {
                        alert(`Verification failed: ${verifyErr.response?.data?.message || verifyErr.message}`);
                    }
                },
                prefill: { name: user?.name, email: user?.email },
                theme: { color: "#0f172a" }
            };
            new window.Razorpay(options).open();
        } catch (error) {
            alert(`Payment setup failed: ${error.message}`);
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
            alert("Error downloading certificate.");
        }
    };

    if (loading || processingPayment) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in font-sans relative">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-emerald-500/10 via-primary-500/5 to-transparent pointer-events-none -z-10 blur-3xl rounded-full"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase drop-shadow-sm">Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-primary-600">{user.name}</span>!</h1>
                    <p className="text-slate-500 font-medium mt-1">Track your progress and access your learning materials.</p>
                </div>
                <Link to="/courses" className="hidden sm:flex text-primary-600 font-bold items-center gap-1 hover:text-primary-800 transition-colors uppercase tracking-widest text-xs">
                    New Programs <ChevronRight size={18} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="stat-card glass-card p-6 flex flex-col items-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-3"><Trophy size={24} /></div>
                    <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{stats.passed}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Passed</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600 mb-3"><PlayCircle size={24} /></div>
                    <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{stats.active}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3"><Clock size={24} /></div>
                    <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{stats.time}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Learning</span>
                </div>
                <div className="stat-card glass-card p-6 flex flex-col items-center border border-slate-200 rounded-2xl">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mb-3"><BarChart size={24} /></div>
                    <span className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{stats.avgScore}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Avg Grade</span>
                </div>
            </div>

            {pendingLeads.length > 0 && (
                <div className="pt-4">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                        <CreditCard className="text-purple-600" /> Pending Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingLeads.map(lead => (
                            <div key={lead._id} className="p-6 rounded-2xl border border-purple-100 bg-purple-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <div className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Approved by HR</div>
                                    <h4 className="text-lg font-black text-slate-900">{lead.courseId?.title}</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Complete payment to join the nearest batch.</p>
                                </div>
                                <button onClick={() => handlePayment(lead._id)} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors uppercase text-sm">Pay Now</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Enrolled Courses Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-emerald-100 pb-2">
                            <BookOpen className="text-emerald-500" size={24} />
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Enrollments</h2>
                        </div>
                        {enrollments.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                <p className="text-slate-400 font-medium">No active programs found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {enrollments.map(enrollment => (
                                    <div key={enrollment._id} className="group bg-white/80 backdrop-blur-xl border border-emerald-100/50 rounded-3xl p-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                        <div className="flex gap-6 items-start">
                                            <div className="w-40 h-28 shrink-0 rounded-2xl overflow-hidden shadow-sm relative group-hover:shadow-md transition-shadow">
                                                <img src={enrollment.batch?.course?.thumbnail || 'https://via.placeholder.com/150'} alt={enrollment.batch?.course?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-white">
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 px-2 py-0.5 rounded-md">Active</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-2">{enrollment.batch?.course?.title || 'Course Title'}</h4>
                                                <p className="text-sm text-slate-500 mb-3">Instructor: {enrollment.batch?.trainer?.name || 'N/A'}</p>
                                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${enrollment.progress || 0}%` }}></div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{enrollment.progress || 0}% Complete</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                            <FileText className="text-blue-600" /> Assignments
                        </h2>
                        {assignments.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                <p className="text-slate-400 font-medium">No tasks assigned yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assignments.map(a => {
                                    const isSubmitted = a.submissions?.some(s => s.student === user?._id);
                                    return (
                                        <div key={a._id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-1">{a.courseTitle}</div>
                                                <h4 className="font-bold text-slate-900">{a.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No deadline'}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {isSubmitted ? (
                                                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-black uppercase rounded-full border border-emerald-100 flex items-center gap-1.5">
                                                        <Send size={12} /> Submitted
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => { setSelectedAssignment(a); setShowSubmitModal(true); }}
                                                        className="px-4 py-1.5 bg-primary-600 text-white text-xs font-black uppercase rounded-full hover:bg-primary-700 transition-colors"
                                                    >
                                                        Submit Work
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {certificates.length > 0 && (
                        <div className="pt-4">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                                <Trophy className="text-amber-500" /> Milestones
                            </h2>
                            <div className="space-y-4">
                                {certificates.map(cert => (
                                    <div key={cert._id} className="p-5 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
                                        <h4 className="font-bold leading-tight mb-2 line-clamp-1">{cert.course?.title}</h4>
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {cert.certificateId}</div>
                                            <button onClick={() => downloadCertificate(cert._id, cert.course?.title)} className="p-2 bg-white/10 hover:bg-white hover:text-slate-900 rounded-lg transition-colors">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
                            <ChevronRight className="text-slate-400" /> Quick Links
                        </h2>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <Link to="/courses" className="block p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><BookOpen size={16} /></div>
                                    <span className="text-sm font-bold text-slate-700">Course Catalog</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                            </Link>
                            <a href="https://discord.gg/skilnexia" target="_blank" rel="noreferrer" className="block p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors"><Users size={16} /></div>
                                    <span className="text-sm font-bold text-slate-700">Join Community</span>
                                </div>
                                <ExternalLink size={16} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Submit Work</h2>
                        <p className="text-sm font-medium text-slate-500 mb-6">{selectedAssignment?.title}</p>
                        <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Submission Link (GitHub/Drive)</label>
                                <input
                                    required
                                    type="url"
                                    value={submissionUrl}
                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all uppercase text-sm">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

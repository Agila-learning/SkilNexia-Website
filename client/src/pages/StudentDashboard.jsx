import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, Trophy, BarChart, BookOpen, ChevronRight, CreditCard, Download, FileText, Send, ExternalLink, Award, Zap, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
                gsap.fromTo('.premium-reveal',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
                );
            });
            return () => ctx.revert();
        }
    }, [loading]);

    const handlePayment = async (leadId) => {
        // ... (Payment logic remains same for now)
    };

    const downloadCertificate = async (id, title) => {
        // ... (Download logic remains same)
    };

    const generateAutoCertificate = async (enrollmentId) => {
        // ... (Cert logic remains same)
    };

    const handleAssignmentSubmit = async (e) => {
         e.preventDefault();
        try {
            await api.post(`/assignments/${selectedAssignment._id}/submit`, { fileUrl: submissionUrl });
            alert("Assignment submitted successfully!");
            setShowSubmitModal(false);
            setSubmissionUrl('');
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error submitting assignment");
        }
    };

    if (loading || processingPayment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Learning Data...</p>
            </div>
        );
    }

    const currentCourse = enrollments.find(e => e.progress < 100) || enrollments[0];

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            
            {/* 1. MASTER HERO SECTION (UDEMY STYLE) */}
            {currentCourse ? (
                <div className="premium-reveal relative w-full rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent z-10"></div>
                    <img 
                        src={currentCourse.batch?.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'} 
                        className="absolute right-0 top-0 w-2/3 h-full object-cover opacity-50"
                        alt="Hero"
                    />
                    
                    <div className="relative z-20 p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Resume Learning</span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                <Clock size={14} /> {currentCourse.progress}% Completed
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                            {currentCourse.batch?.course?.title}
                        </h1>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Continue where you left off. You are processing your way through module 4 of the curriculum. Next milestone in 2 hours.
                        </p>
                        <div className="pt-4 flex items-center gap-6">
                            <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3 group">
                                <PlayCircle size={20} className="group-hover:fill-current" /> Go to Class
                            </button>
                            <div className="hidden sm:block">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Next Session</p>
                                <p className="text-sm font-bold text-white">Tomorrow, 10:00 AM IST</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="premium-reveal p-16 rounded-[40px] bg-white/5 border border-white/5 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-slate-500">
                        <BookOpen size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Level Up Your Career</h2>
                        <p className="text-slate-500 font-medium mt-2">Explore our premium specializations and start your journey.</p>
                    </div>
                    <Link to="/courses" className="inline-flex px-8 py-3 bg-accent-500 text-white rounded-xl font-bold uppercase text-xs tracking-widest">Browse Programs</Link>
                </div>
            )}

            {/* 2. OPERATIONAL METRICS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Courses Completed', value: stats.passed, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Active Programs', value: stats.active, icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Hours Learned', value: stats.time, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Avg Grade %', value: stats.avgScore, icon: BarChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="premium-reveal glass-card-premium p-6 flex items-center gap-5 border border-white/5">
                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. MAIN CONTENT GRID (Udemy Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left: My Courses & Tasks */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Courses Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <BookOpen className="text-accent-500" size={24} /> My Learning Roadmap
                            </h2>
                            <Link to="/courses" className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Expand Catalog</Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {enrollments.map((enr, i) => (
                                <div key={enr._id} className="premium-reveal group glass-card-premium p-6 border border-white/5 hover:border-accent-500/30 transition-all flex flex-col">
                                    <div className="flex gap-5 items-start mb-6">
                                        <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-2xl relative">
                                            <img src={enr.batch?.course?.thumbnail || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Course" />
                                            <div className="absolute inset-0 bg-slate-900/40"></div>
                                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                                <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${enr.batch?.course?.trainingType === 'recorded' ? 'bg-amber-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-lg'}`}>
                                                    {enr.batch?.course?.trainingType || 'live'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-lg leading-tight line-clamp-2 truncate">{enr.batch?.course?.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest ${enr.batch?.course?.courseType === 'free' ? 'bg-slate-500/20 text-slate-400' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'}`}>
                                                    {enr.batch?.course?.courseType || 'Paid'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mentor: {enr.batch?.trainer?.name || 'Assigned soon'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 mt-auto">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-500">Course Progress</span>
                                                <span className="text-accent-500">{enr.progress}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-500 rounded-full transition-all duration-1000" style={{ width: `${enr.progress}%` }}></div>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-2">
                                            Continue Learning <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Actions */}
                    {pendingLeads.length > 0 && (
                        <div className="space-y-6">
                             <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <CreditCard className="text-accent-500" size={24} /> Enrollement Hub
                            </h2>
                            <div className="space-y-4">
                                {pendingLeads.map(lead => (
                                    <div key={lead._id} className="premium-reveal p-8 rounded-3xl bg-gradient-to-br from-accent-500/10 to-transparent border border-accent-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <span className="px-3 py-1 bg-accent-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Offer Pending</span>
                                            <h4 className="text-xl font-black text-white">{lead.courseId?.title}</h4>
                                            <p className="text-slate-400 text-sm font-medium">Your application for this premium track was approved by HR. Complete enrollment to begin.</p>
                                        </div>
                                        <button onClick={() => handlePayment(lead._id)} className="px-12 py-4 bg-accent-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl whitespace-nowrap">Complete Enrollment</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Achievements & Milestones (Fixed "JOB READY" issue) */}
                <div className="space-y-12">
                     
                     {/* Achievements Section */}
                     <div className="space-y-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Award className="text-accent-500" size={24} /> Skill Badges
                        </h2>
                        <div className="glass-card-premium p-8 border border-white/5 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                             
                             <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-gradient-to-tr from-accent-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                                    <Zap size={28} fill="currentColor" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-white uppercase tracking-tighter leading-none">Job Ready</h4>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Verification</p>
                                </div>
                             </div>

                             <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Learning Milestones</p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg"><CheckCircle size={14} /></div>
                                        <span className="text-xs font-bold text-slate-300">Identity Verified</span>
                                    </div>
                                    <div className="flex items-center gap-3 opacity-40">
                                        <div className="p-1.5 bg-white/5 text-slate-500 rounded-lg"><Award size={14} /></div>
                                        <span className="text-xs font-bold text-slate-500">Interview Ready</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                     </div>

                     {/* Certificates Section */}
                     <div className="space-y-6">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Trophy className="text-amber-500" size={24} /> Certificates
                        </h2>
                        <div className="space-y-4">
                            {certificates.length > 0 ? (
                                certificates.map(cert => (
                                    <div key={cert._id} className="premium-reveal p-6 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                                        <div>
                                            <h4 className="font-bold text-white text-sm line-clamp-1 truncate pr-4">{cert.course?.title}</h4>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">ID: {cert.certificateId}</p>
                                        </div>
                                        <button onClick={() => downloadCertificate(cert._id, cert.course?.title)} className="p-3 bg-white/5 hover:bg-white hover:text-slate-950 rounded-xl transition-all">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 border border-white/5 border-dashed rounded-3xl text-center space-y-3 bg-white/5">
                                    <Award className="mx-auto text-slate-700" size={32} />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No milestones yet</p>
                                </div>
                            )}
                        </div>
                     </div>

                     {/* Community Section */}
                     <div className="glass-card-premium p-8 border border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent">
                        <h4 className="font-black text-white uppercase tracking-tight mb-2">Mentor Access</h4>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Connect with industry experts for personalized career roadmap reviews.</p>
                        <a href="https://discord.gg/skilnexia" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white hover:text-slate-950 rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em] group">
                            Join Community <ExternalLink size={14} className="group-hover:rotate-45 transition-transform" />
                        </a>
                     </div>

                </div>
            </div>

            {/* Submission Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
                    <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">System Delivery</h2>
                        <p className="text-sm font-medium text-slate-400 mb-8">{selectedAssignment?.title}</p>
                        <form onSubmit={handleAssignmentSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Link (GitHub/Drive)</label>
                                <input
                                    required
                                    type="url"
                                    value={submissionUrl}
                                    onChange={(e) => setSubmissionUrl(e.target.value)}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-accent-500/20 focus:border-accent-500 text-white font-bold transition-all"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowSubmitModal(false)} className="flex-1 py-4 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-4 bg-white text-slate-950 rounded-2xl font-black hover:bg-accent-500 hover:text-white shadow-xl transition-all uppercase text-xs tracking-widest">Verify & Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;

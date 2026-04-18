import React, { useState, useEffect } from 'react';
import { 
    PlayCircle, Clock, Trophy, BarChart, BookOpen, ChevronRight, 
    CreditCard, Download, FileText, Send, ExternalLink, Award, 
    Zap, CheckCircle, Bell, Target, Users, Layout, Medal, Crown 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [pendingLeads, setPendingLeads] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ passed: 0, active: 0, time: '0h', avgScore: '0%', badgesCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [enrRes, leadsRes, certRes, notifRes] = await Promise.all([
                api.get('/enrollments'),
                api.get('/leads/me'),
                api.get('/certificates/my'),
                api.get('/notifications')
            ]);

            const enrData = enrRes.data || [];
            setEnrollments(enrData);
            setPendingLeads((leadsRes.data || []).filter(l => l.status === 'Payment Pending'));
            setCertificates(certRes.data || []);
            setNotifications(notifRes.data || []);

            // Calculate stats
            let active = 0;
            let passed = 0;
            let totalProgress = 0;
            let badges = 0;

            enrData.forEach(enr => {
                if (enr.progress === 100) passed++;
                else active++;
                totalProgress += (enr.progress || 0);
                badges += (enr.badges?.length || 0);
            });

            const avgScore = enrData.length > 0 ? Math.round(totalProgress / enrData.length) : 0;
            
            setStats({
                passed,
                active,
                time: `${(active + passed) * 15}h`,
                avgScore: `${avgScore}%`,
                badgesCount: badges
            });

            // Fetch leaderboard for the first active course
            if (enrData.length > 0) {
                const lbRes = await api.get(`/enrollments/leaderboard/${enrData[0].batch.course._id}`);
                setLeaderboard(lbRes.data);
            }

            // Animation
            gsap.fromTo('.premium-reveal',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
            );

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Intelligence...</p>
        </div>
    );

    const currentCourse = enrollments.find(e => e.progress < 100) || enrollments[0];

    return (
        <div className="space-y-12 animate-fade-in pb-20 max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* 1. HERO SECTION */}
            {currentCourse ? (
                <div className="premium-reveal relative w-full rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-10"></div>
                    <img 
                        src={currentCourse.batch?.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'} 
                        className="absolute right-0 top-0 w-2/3 h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                        alt="Hero"
                    />
                    <div className="relative z-20 p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Active Roadmap</span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                <Clock size={14} /> {currentCourse.progress}% Processed
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                            {currentCourse.batch?.course?.title}
                        </h1>
                        <div className="pt-4 flex items-center gap-6">
                            <Link to={`/course-player/${currentCourse.batch?.course?._id}`} className="btn-premium">
                                <PlayCircle size={20} className="group-hover:fill-current" /> Continue Class
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="premium-reveal p-16 rounded-[40px] bg-white/5 border border-white/5 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-slate-500">
                        <BookOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Begin Your Evolution</h2>
                    <Link to="/courses" className="inline-flex px-8 py-3 bg-accent-500 text-white rounded-xl font-bold uppercase text-xs tracking-widest">Browse Programs</Link>
                </div>
            )}

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Courses Completed', value: stats.passed, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Badges Earned', value: stats.badgesCount, icon: Award, color: 'text-accent-500', bg: 'bg-accent-500/10' },
                    { label: 'Hours Learned', value: stats.time, icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Avg Progress', value: stats.avgScore, icon: BarChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="premium-reveal stat-badge">
                        <div className={`p-5 rounded-[22px] ${stat.bg} ${stat.color} mb-6 shadow-xl`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white tracking-tighter leading-none mb-2">{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Courses & Payments */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* Enrollments */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Layout className="text-primary-500" size={24} /> My Curriculum
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {enrollments.map((enr) => (
                                <div key={enr._id} className="premium-reveal group glass-card-premium p-6 border border-white/5 hover:border-white/10 transition-all flex flex-col">
                                    <div className="flex gap-4 items-start mb-6">
                                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                                            <img src={enr.batch?.course?.thumbnail || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-lg leading-tight truncate">{enr.batch?.course?.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{enr.batch?.course?.category}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mt-auto">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-slate-500">Progress</span>
                                            <span className="text-accent-500">{enr.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-primary-600 to-accent-500 transition-all duration-1000" style={{ width: `${enr.progress}%` }}></div>
                                        </div>
                                        <Link to={`/course-player/${enr.batch?.course?._id}`} className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all flex items-center justify-center gap-2">
                                            Enter Player <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending Payments */}
                    {pendingLeads.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <CreditCard className="text-accent-500" size={24} /> Pending Enrollment
                            </h3>
                            <div className="space-y-4">
                                {pendingLeads.map(lead => (
                                    <div key={lead._id} className="premium-reveal p-8 rounded-3xl bg-accent-500/5 border border-accent-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <span className="px-3 py-1 bg-accent-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Action Required</span>
                                            <h4 className="text-xl font-black text-white mt-2">{lead.courseId?.title}</h4>
                                            <p className="text-slate-500 text-sm font-medium">Complete payment to unlock your curriculum.</p>
                                        </div>
                                        <button className="px-8 py-3 bg-accent-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all shadow-xl">Complete Now</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Leaderboard, Badges, Notifications */}
                <div className="lg:col-span-4 space-y-12">
                    
                    {/* Leaderboard */}
                    <div className="premium-reveal glass-card-premium border border-white/5 overflow-hidden">
                        <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                                <Trophy size={14} className="text-amber-500" /> Team Ranking
                            </h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {leaderboard.length === 0 ? (
                                <div className="p-8 text-center text-slate-600 text-[10px] uppercase font-black">No rankings yet</div>
                            ) : (
                                leaderboard.map((player, i) => (
                                    <div key={i} className={`p-4 flex items-center gap-4 ${player.userId === user?._id ? 'bg-primary-500/5' : ''}`}>
                                        <div className="w-6 h-6 shrink-0 flex items-center justify-center font-black text-[10px] text-slate-500">
                                            {i === 0 ? <Crown size={14} className="text-amber-500" /> : i + 1}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className={`text-xs font-black uppercase truncate ${player.userId === user?._id ? 'text-primary-500' : 'text-slate-300'}`}>{player.name}</p>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{player.progress}% Comp.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white">{player.score}</p>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">pts</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="premium-reveal glass-card-premium p-6 border border-white/5 space-y-6">
                        <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                            <Medal size={16} className="text-accent-500" /> Achievements
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {enrollments.flatMap(e => e.badges || []).length === 0 ? (
                                <div className="col-span-4 p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">No badges</p>
                                </div>
                            ) : (
                                enrollments.flatMap(e => e.badges || []).map((badge, i) => (
                                    <div key={i} className="aspect-square bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-accent-500 shadow-lg group relative cursor-help">
                                        <Award size={20} fill={i % 2 === 0 ? "currentColor" : "none"} />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-2xl">
                                            <p className="text-[9px] font-black text-white uppercase tracking-widest text-center">{badge.title}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="premium-reveal glass-card-premium p-6 border border-white/5 space-y-6">
                        <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                            <Bell size={16} className="text-blue-500" /> Intelligence Feed
                        </h3>
                        <div className="space-y-4">
                            {notifications.length === 0 ? (
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center py-4 italic">Feed clear.</p>
                            ) : (
                                notifications.map((notif, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => !notif.isRead && markRead(notif._id)}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${notif.isRead ? 'bg-transparent border-white/5 opacity-50' : 'bg-blue-500/5 border-blue-500/20'}`}
                                    >
                                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${notif.type === 'badge' ? 'bg-accent-500/10 text-accent-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {notif.type === 'badge' ? <Award size={14} /> : <Zap size={14} />}
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <p className="text-[11px] font-medium text-slate-300 leading-tight truncate">{notif.message}</p>
                                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Certificates */}
                    <div className="premium-reveal space-y-6">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Shield className="text-emerald-500" size={24} /> Certifications
                        </h3>
                        <div className="space-y-4">
                            {certificates.length > 0 ? (
                                certificates.map(cert => (
                                    <div key={cert._id} className="p-6 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white text-sm truncate pr-4 uppercase">{cert.course?.title}</h4>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">ID: {cert.certificateId}</p>
                                        </div>
                                        <button className="p-3 bg-white/5 hover:bg-white hover:text-slate-950 rounded-xl transition-all">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 border border-white/5 border-dashed rounded-3xl text-center space-y-3 bg-white/5">
                                    <Award className="mx-auto text-slate-700" size={32} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No milestones yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

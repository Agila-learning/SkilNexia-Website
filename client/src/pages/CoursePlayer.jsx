import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Play, Lock, MessageSquare, Book, FileText, ChevronRight, BookOpen, Star, Info, Zap, Award } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [enrollment, setEnrollment] = useState(null);
    const [course, setCourse] = useState(null);
    const [activeLecture, setActiveLecture] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('syllabus');
    const [showBadgePopup, setShowBadgePopup] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            // Find enrollment for this course
            const enrRes = await api.get('/enrollments');
            const myEnr = enrRes.data.find(e => e.batch?.course?._id === courseId);
            
            if (!myEnr) {
                // If not enrolled, redirect to detail
                navigate(`/courses/${courseId}`);
                return;
            }

            setEnrollment(myEnr);
            const courseData = myEnr.batch.course;
            setCourse(courseData);
            
            // Initial active lecture
            setActiveLecture(courseData.modules?.[0] || null);
            
            // Mock completed lessons based on progress for now
            const total = courseData.modules?.length || 1;
            const completedCount = Math.floor((myEnr.progress / 100) * total);
            setCompletedLessons(Array.from({ length: completedCount }, (_, i) => i));

        } catch (err) {
            console.error("Failed to load course player data", err);
        } finally {
            setLoading(false);
        }
    };

    const markLessonComplete = async (index) => {
        if (completedLessons.includes(index)) return;
        
        const newCompleted = [...completedLessons, index];
        setCompletedLessons(newCompleted);
        
        const total = course?.modules?.length || 1;
        const progress = Math.min(100, Math.round((newCompleted.length / total) * 100));
        
        try {
            const res = await api.put(`/enrollments/${enrollment._id}/progress`, { progress });
            
            // Check if a new badge was awarded
            if (res.data.badges?.length > enrollment.badges?.length) {
                const newBadge = res.data.badges[res.data.badges.length - 1];
                setShowBadgePopup(newBadge);
                setTimeout(() => setShowBadgePopup(null), 5000);
            }
            
            setEnrollment(res.data);
            
            if (progress >= 95 && course?.courseType === 'free') {
                alert("🎓 Congratulations! You've completed the course. Your certificate has been generated!");
            }
        } catch (err) {
            console.error("Failed to update progress", err);
        }
    };

    if (loading) return (
        <div className="bg-[#0a0c10] min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/10 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!course) return <div className="p-20 text-center text-white">Course not found.</div>;

    const progressPercent = Math.round((completedLessons.length / (course.modules?.length || 1)) * 100);

    return (
        <div className="bg-[#0a0c10] min-h-screen text-slate-300 font-sans flex flex-col relative">
            
            {/* Badge Popup Notification */}
            {showBadgePopup && (
                <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-right duration-500">
                    <div className="glass-card-premium p-6 border border-accent-500/30 bg-slate-900/90 backdrop-blur-xl flex items-center gap-6 shadow-2xl rounded-[24px]">
                        <div className="w-16 h-16 bg-gradient-to-tr from-accent-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                            <Award size={32} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-accent-500 uppercase tracking-[0.2em] mb-1">New Badge Earned!</p>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{showBadgePopup.title}</h4>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <nav className="w-full bg-[#111318] border-b border-white/5 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        <BookOpen className="text-primary-500 w-6 h-6" />
                        <span className="font-black text-xl text-white tracking-tight">Skilnexia</span>
                    </Link>
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                    <h1 className="text-sm font-bold text-slate-400 hidden md:block truncate max-w-xs">{course.title}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Link to={`/courses/${courseId}`} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Exit Course</Link>
                    {progressPercent >= 95 && (
                        <Link to="/student" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                            Claim Certificate
                        </Link>
                    )}
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-grow flex flex-col bg-black">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video w-full relative bg-slate-900 group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                <button 
                                    onClick={() => markLessonComplete(course.modules.indexOf(activeLecture))}
                                    className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl mb-4 mx-auto hover:bg-primary-500 transition-all active:scale-90"
                                >
                                    <Play fill="white" size={32} className="ml-1" />
                                </button>
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                    {completedLessons.includes(course.modules.indexOf(activeLecture)) ? 'Reviewing Module' : 'Start Session'}
                                </p>
                            </div>
                        </div>
                        <div className="absolute top-8 left-8 opacity-20 pointer-events-none">
                            <p className="text-6xl font-black text-white italic">SKILNEXIA AI</p>
                        </div>
                    </div>

                    {/* Interaction Area */}
                    <div className="p-10 bg-[#0f1116] flex-grow overflow-y-auto">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-accent-500/10 text-accent-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-accent-500/20 flex items-center gap-2">
                                    <Zap size={12} /> AI Assisted Node
                                </span>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">{activeLecture?.title}</h2>
                            </div>
                            <p className="text-slate-400 font-medium mb-12 leading-relaxed">
                                {activeLecture?.content || `Welcome to this comprehensive session on ${activeLecture?.title}. In this module, we will explore core concepts and practical implementations.`}
                            </p>

                            <div className="flex gap-8 border-b border-white/5 mb-10">
                                {['overview', 'resources', 'discussion'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"></div>}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="glass-card-premium p-8 border border-white/5 space-y-4">
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest">Key Takeaways</h4>
                                            <ul className="space-y-3">
                                                {[1,2,3].map(i => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-400">
                                                        <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><CheckCircle size={12} /></div>
                                                        Architectural principle implementation {i}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="glass-card-premium p-8 border border-white/5 space-y-4">
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest">Pre-requisites</h4>
                                            <p className="text-sm text-slate-400">Ensure you have completed the previous module and have your development environment synced with the repository.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Syllabus/Lectures) */}
                <div className="w-full lg:w-96 bg-[#111318] border-l border-white/5 flex flex-col h-full lg:h-[calc(100vh-64px)] overflow-y-auto">
                    <div className="p-8 border-b border-white/5 bg-[#16181d]">
                        <h3 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-3">Sync Progress</h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{completedLessons.length} of {course.modules?.length} Lessons</p>
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">{progressPercent}%</p>
                        </div>
                    </div>

                    <div className="flex-grow divide-y divide-white/5">
                        {course.modules?.map((lecture, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveLecture(lecture)}
                                className={`w-full text-left p-6 transition-all hover:bg-white/5 flex items-start gap-4 ${activeLecture?.title === lecture.title ? 'bg-primary-900/10 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${completedLessons.includes(idx) ? 'bg-emerald-500/10 text-emerald-500' : activeLecture?.title === lecture.title ? 'bg-primary-600 text-white shadow-lg' : 'bg-white/5 text-slate-500'}`}>
                                    {completedLessons.includes(idx) ? <CheckCircle size={18} /> : <Play size={18} />}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h4 className={`text-sm font-black truncate uppercase tracking-tight ${activeLecture?.title === lecture.title ? 'text-white' : 'text-slate-400'}`}>{lecture.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{lecture.duration}</span>
                                        {idx === 0 && <span className="px-1.5 py-0.5 rounded-md bg-accent-500/10 text-accent-500 text-[8px] font-black uppercase tracking-widest border border-accent-500/20">Intro</span>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;

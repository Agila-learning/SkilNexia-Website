import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import { CheckCircle, Play, Lock, MessageSquare, Book, FileText, ChevronRight, BookOpen, Star, Info, Zap } from 'lucide-react';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const course = COURSE_CATEGORIES.find(c => c.id === courseId) || COURSE_CATEGORIES[0];
    const [activeLecture, setActiveLecture] = useState(course.lectures?.[0] || { title: 'Intro to Program', type: 'ai', videoUrl: 'https://v-player.vercel.app/video.mp4' });
    const [activeTab, setActiveTab] = useState('syllabus');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#0a0c10] min-h-screen text-slate-300 font-sans flex flex-col">
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
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-black transition-all">Claim Certificate</button>
                </div>
            </nav>

            <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                {/* Main Player Area */}
                <div className="flex-grow flex flex-col bg-black">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video w-full relative bg-slate-900 group">
                        {/* Static Video Overlay Simulated */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-2xl mb-4 mx-auto">
                                    <Play fill="white" size={32} className="ml-1" />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Playing: {activeLecture.type === 'ai' ? 'AI Lecture' : 'Recorded Session'}</p>
                            </div>
                        </div>
                        {/* Content Watermark */}
                        <div className="absolute top-8 left-8 opacity-20 pointer-events-none">
                            <p className="text-6xl font-black text-white italic">SKILNEXIA AI</p>
                        </div>
                    </div>

                    {/* Interaction Area */}
                    <div className="p-10 bg-[#0f1116] flex-grow">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 mb-4">
                                {activeLecture.type === 'ai' && (
                                    <span className="px-3 py-1 bg-accent-500/10 text-accent-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-accent-500/20 flex items-center gap-2">
                                        <Zap size={12} /> AI Generated
                                    </span>
                                )}
                                <h2 className="text-3xl font-black text-white">{activeLecture.title}</h2>
                            </div>
                            <p className="text-slate-400 font-medium mb-12">
                                Welcome to this comprehensive session on {activeLecture.title}. In this module, we will explore the core concepts and practical implementations of {course.title}.
                            </p>

                            <div className="flex gap-8 border-b border-white/5 mb-10">
                                {['overview', 'notes', 'resources'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full"></div>}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h4 className="text-white font-bold">About this Session</h4>
                                    <p className="text-sm leading-relaxed text-slate-400">
                                        This lesson covers everything from foundational principles to advanced techniques. We've utilized our proprietary AI Lecture system to provide a concise, high-impact learning experience tailored to the modern tech environment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Syllabus/Lectures) */}
                <div className="w-full lg:w-96 bg-[#111318] border-l border-white/5 flex flex-col h-full lg:h-[calc(100vh-64px)] overflow-y-auto">
                    <div className="p-6 border-b border-white/5 bg-[#16181d]">
                        <h3 className="text-white font-black uppercase text-xs tracking-widest mb-2">Course Progress</h3>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-primary-600 w-1/4"></div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500">2 of 8 Lessons Completed (25%)</p>
                    </div>

                    <div className="flex-grow">
                        {course.lectures?.map((lecture, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveLecture(lecture)}
                                className={`w-full text-left p-6 border-b border-white/5 transition-all hover:bg-white/5 flex items-start gap-4 ${activeLecture.title === lecture.title ? 'bg-primary-900/10 border-l-4 border-l-primary-600' : ''}`}
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activeLecture.title === lecture.title ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                                    {lecture.type === 'ai' ? <Zap size={16} /> : <Play size={16} />}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h4 className={`text-sm font-black truncate ${activeLecture.title === lecture.title ? 'text-white' : 'text-slate-400'}`}>{lecture.title}</h4>
                                        <span className="text-[10px] font-bold text-slate-600 shrink-0">{lecture.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{lecture.type === 'ai' ? 'AI Lecture' : 'Recorded'}</span>
                                        {idx < 2 && <CheckCircle size={12} className="text-emerald-500" />}
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

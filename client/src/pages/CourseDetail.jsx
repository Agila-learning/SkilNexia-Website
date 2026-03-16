import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Clock, BookOpen, Award, CheckCircle, ArrowRight, Star,
    Shield, Zap, Users, PlayCircle, ChevronRight, Globe,
    Target, Rocket, Briefcase, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';
import { COURSE_CATEGORIES } from '../data/coursesData.jsx';

gsap.registerPlugin(ScrollTrigger);

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isExpertOpen, setIsExpertOpen] = useState(false);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchCourseDetail = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                if (res.data) {
                    setCourse(res.data);
                } else {
                    const staticCourse = COURSE_CATEGORIES.find(c => c.id === courseId);
                    setCourse(staticCourse || null);
                }
            } catch (error) {
                console.error("Failed to fetch course detail from API, trying static fallback:", error);
                const staticCourse = COURSE_CATEGORIES.find(c => c.id.toLowerCase() === courseId.toLowerCase());
                if (staticCourse) {
                    setCourse(staticCourse);
                } else {
                    setCourse(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [courseId]);

    useEffect(() => {
        if (!course) return;

        const ctx = gsap.context(() => {
            // Hero Animations
            gsap.fromTo('.detail-hero-content',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out'
                }
            );

            // Roadmap Line Animation
            gsap.fromTo('.roadmap-line-progress',
                { height: 0 },
                {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.roadmap-container',
                        start: 'top 30%',
                        end: 'bottom 70%',
                        scrub: 1
                    }
                }
            );

            // Roadmap Cards Stagger
            gsap.utils.toArray('.roadmap-step').forEach((el, i) => {
                const xOffset = i % 2 === 0 ? -40 : 40;
                gsap.fromTo(el,
                    { x: xOffset, opacity: 0 },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%',
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [course]);

    const handleEnrollment = () => {
        setIsExpertOpen(true);
    };

    if (loading || processingPayment) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Roadmap Not Found</h2>
                    <Link to="/courses" className="btn-primary">Back to Roadmaps</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfdfe] min-h-screen pt-32 pb-24 font-sans text-slate-900">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <ConsultationModal
                isOpen={isExpertOpen}
                onClose={() => setIsExpertOpen(false)}
                defaultCourseId={courseId}
            />

            {/* 1. Detail Hero */}
            <section className="max-w-7xl mx-auto px-4 mb-24">
                <div className="relative rounded-[60px] bg-slate-950 overflow-hidden p-12 md:p-24 text-white shadow-3xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/20 to-transparent"></div>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                    <div className="detail-hero-content relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-accent-500">
                                <Award size={14} /> Global Standard Curriculum
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter uppercase">
                                {course.title.split(' ').map((word, i) => (
                                    <span key={i} className={i === course.title.split(' ').length - 1 ? "text-accent-500" : ""}>{word} </span>
                                ))}
                            </h1>
                            <div className="flex flex-wrap gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-accent-500">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                                        <p className="text-lg font-black">{course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-emerald-400">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</p>
                                        <p className="text-lg font-black">100% Practical</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-blue-400">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment</p>
                                        <p className="text-lg font-black">500+ Active</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-6 pt-6">
                                <button onClick={handleEnrollment} disabled={processingPayment} className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                                    Enroll in Roadmap <ArrowRight size={22} />
                                </button>
                                <button onClick={() => setIsExpertOpen(true)} className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                                    Speak to Expert <Phone size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-5 hidden lg:block">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-accent-500/20 blur-2xl rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative rounded-[60px] overflow-hidden shadow-3xl border-[20px] border-white/5 aspect-square bg-slate-900">
                                    <img src={course.thumbnail || course.banner || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Premium Vertical Roadmap */}
            <section className="max-w-7xl mx-auto px-4 py-20 bg-white rounded-[80px] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#00000003_1px,transparent_1px)] [background-size:30px_30px]"></div>

                <div className="text-center mb-32 space-y-6 relative z-10">
                    <div className="inline-flex gap-2 text-primary-900 font-black uppercase tracking-[0.3em] text-[10px] items-center">
                        <div className="w-12 h-1 bg-primary-900 rounded-full"></div> Phase-by-Phase <div className="w-12 h-1 bg-primary-900 rounded-full"></div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-none">Your Career <br /><span className="text-accent-500">Lifecycle</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Transform from foundations to industry expertise</p>
                </div>

                <div className="roadmap-container relative max-w-5xl mx-auto pb-40">
                    {/* Background Line */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-1.5 bg-slate-100 -translate-x-1/2 rounded-full overflow-hidden hidden md:block">
                        <div className="roadmap-line-progress w-full bg-gradient-to-b from-primary-900 via-accent-500 to-emerald-400 h-0 rounded-full shadow-[0_0_20px_rgba(30,58,138,0.5)]"></div>
                    </div>

                    <div className="space-y-40">
                        {(course.modules || course.syllabus || []).map((phase, idx) => (
                            <div key={idx} className="roadmap-step relative group">
                                <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Content side */}
                                    <div className="w-full md:w-1/2 space-y-8">
                                        <div className={`p-10 md:p-14 rounded-[50px] bg-white border border-slate-100 shadow-xl group-hover:shadow-3xl transition-all duration-500 relative ${idx % 2 === 0 ? 'md:mr-4' : 'md:ml-4'}`}>
                                            <div className="absolute top-0 right-10 -translate-y-1/2 w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-12 transition-transform">
                                                0{idx + 1}
                                            </div>

                                            <div className="space-y-6">
                                                <div className="w-16 h-16 bg-slate-50 text-primary-900 rounded-2xl flex items-center justify-center group-hover:bg-primary-900 group-hover:text-white transition-all">
                                                    <Globe size={32} />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{phase.title || phase.step}</h3>
                                                <p className="text-slate-500 text-lg font-medium leading-relaxed">{phase.content || phase.description || phase.desc || "In-depth training module."}</p>

                                                <ul className="space-y-4 pt-4">
                                                    {["Project-led Learning", "Weekly Assessments", "Code Reviews"].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                            <CheckCircle size={18} className="text-emerald-500" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image side - Animated Reveal */}
                                    <div className="w-full md:w-1/2 relative group/img">
                                        <div className="absolute inset-0 bg-accent-500/10 blur-3xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000"></div>
                                        <div className="relative rounded-[50px] overflow-hidden border-[16px] border-white shadow-2xl aspect-[4/3] bg-slate-50">
                                            <img src={"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400"} alt={phase.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Center Node (Mobile Hidden) */}
                                    <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-[6px] border-slate-100 rounded-full z-20 hidden md:flex items-center justify-center transition-all duration-500 group-hover:border-primary-900 group-hover:scale-150 group-hover:shadow-[0_0_20px_rgba(30,58,138,0.3)]">
                                        <div className="w-2 h-2 bg-slate-200 rounded-full group-hover:bg-primary-900"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Road to Hire CTA */}
                <div className="max-w-4xl mx-auto mt-20 p-12 md:p-20 bg-slate-950 rounded-[60px] text-center text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-transparent"></div>
                    <div className="relative z-10 space-y-10">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Rocket size={40} />
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">Ready to Kickstart <br /><span className="text-accent-500">Your Transition?</span></h3>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
                            Our placement engine is waiting for your portfolio. Start your journey today and get hired in top-tier tech firms.
                        </p>
                        <div className="pt-6">
                            <button onClick={handleEnrollment} disabled={processingPayment} className="px-16 py-6 bg-white text-slate-950 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95">
                                Join The Movement
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Sidebar replacement or bottom section */}
            <section className="max-w-7xl mx-auto px-4 mt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                    { title: "Placement Help", desc: "Dedicated resume building & mock interviews.", icon: <Briefcase className="text-blue-500" /> },
                    { title: "Elite Mentors", desc: "Learn from specialists working at Google & Meta.", icon: <Star className="text-accent-500" /> },
                    { title: "Premium Access", desc: "Life-time access to roadmap updates and community.", icon: <Shield className="text-emerald-500" /> }
                ].map((card, i) => (
                    <div key={i} className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl hover:shadow-3xl transition-all duration-300 space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                            {card.icon}
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight">{card.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default CourseDetail;

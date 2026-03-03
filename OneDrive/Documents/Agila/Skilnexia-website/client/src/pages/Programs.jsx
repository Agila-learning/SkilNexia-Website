import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, ChevronRight, Search, Target, Code, Database,
    Shield, Cpu, Briefcase, ArrowRight, Award, TrendingUp,
    Users, Star, Clock, Zap, Globe, Rocket
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { COURSE_CATEGORIES as COURSES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';

gsap.registerPlugin(ScrollTrigger);

const Programs = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.reveal-up').forEach(el => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%'
                        }
                    }
                );
            });

            // Card stagger
            gsap.utils.toArray('.program-card').forEach(el => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 95%',
                            toggleActions: "play none none none"
                        }
                    }
                );
            });
        });
        return () => ctx.revert();
    }, []);

    // Filter for "Placement" oriented courses
    const placementPrograms = COURSES.filter(c =>
        c && c.category && ['Development', 'Data Science', 'Cloud', 'Security'].includes(c.category)
    );

    return (
        <div className="bg-[#fcfdfe] min-h-screen text-slate-900 font-sans overflow-x-hidden">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

            {/* Premium Header Content */}
            <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-primary-600/20 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-accent-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 reveal-up">
                        <Zap size={14} className="animate-pulse" /> Career Launchpad 2026
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[0.95] tracking-tighter uppercase reveal-up">
                        High Impact <br /><span className="inline-block pr-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-400">Placement</span> <br />Programs.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl font-medium mb-16 leading-relaxed reveal-up">
                        Elite vocational tracks co-engineered with global industry leaders. Not just a course, but a guaranteed transition into the world's most innovative tech ecosystems.
                    </p>

                    <div className="flex flex-wrap gap-12 reveal-up border-t border-white/5 pt-12">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent-500 shadow-2xl transition-transform hover:rotate-12"><Users size={28} /></div>
                            <div>
                                <p className="font-black text-3xl leading-none tracking-tighter uppercase">50K+</p>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Alumni Network</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-2xl transition-transform hover:rotate-12"><Briefcase size={28} /></div>
                            <div>
                                <p className="font-black text-3xl leading-none tracking-tighter uppercase">500+</p>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Hiring Partners</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl transition-transform hover:rotate-12"><Globe size={28} /></div>
                            <div>
                                <p className="font-black text-3xl leading-none tracking-tighter uppercase">15+</p>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Global Locations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Program Cards */}
            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 programs-grid">
                    {placementPrograms.map((course) => (
                        <div key={course.id} className="program-card group bg-white rounded-[60px] overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-700 border-2 border-slate-200 flex flex-col h-full hover:-translate-y-4 opacity-100">
                            <div className="h-72 relative overflow-hidden bg-slate-900 mx-4 mt-4 rounded-[45px]">
                                <img src={course.banner || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-transparent"></div>
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-xl">
                                    {course.category}
                                </div>
                                <div className="absolute bottom-6 left-8 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex text-accent-500">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <span className="text-xs font-black italic">4.9+</span>
                                    </div>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] uppercase">Elite Rated</p>
                                </div>
                            </div>

                            <div className="p-10 md:p-12 flex flex-col flex-grow">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-950 mb-6 leading-tight group-hover:text-primary-900 transition-colors uppercase tracking-tight">{course.title}</h3>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors group-hover:bg-primary-50/50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Duration</p>
                                        <div className="flex items-center gap-2 font-black text-slate-900 text-sm"><Clock size={16} className="text-accent-500" /> {course.duration}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors group-hover:bg-emerald-50/50">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Peak Hike</p>
                                        <div className="flex items-center gap-2 font-black text-emerald-600 text-sm"><TrendingUp size={16} /> 150%</div>
                                    </div>
                                </div>

                                <div className="bg-slate-950 p-6 rounded-3xl mb-10 border border-slate-900 transition-all group-hover:scale-105 group-hover:shadow-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Award size={18} className="text-accent-500" />
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Job Guarantee Program</p>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                                        Includes direct resume shortlisting at top product firms.
                                    </p>
                                </div>

                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between gap-4">
                                    <Link to={`/courses/${course.id}`} className="px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                                        Learn More
                                    </Link>
                                    <button onClick={() => setIsRegisterOpen(true)} className="flex-grow px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-primary-900 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group/btn">
                                        Secure Seat <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Hiring Section */}
            <section className="bg-white py-32 border-t border-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-50/50 -skew-y-3 origin-center"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="space-y-6 mb-24">
                        <div className="inline-flex gap-2 text-primary-900 font-black uppercase tracking-[0.3em] text-[10px] items-center justify-center">
                            <div className="w-12 h-1 bg-primary-900 rounded-full"></div> Global Hire Network
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-none">The Skilnexia <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-900 to-accent-600">Alumni Reach</span></h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12 items-center opacity-100 transition-all font-black text-slate-400">
                        {['GOOGLE', 'AMAZON', 'MICROSOFT', 'NETFLIX', 'META'].map(brand => (
                            <span key={brand} className="text-3xl md:text-5xl tracking-tighter italic cursor-default hover:text-slate-900 transition-colors">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 px-4">
                <div className="max-w-6xl mx-auto rounded-[80px] bg-slate-950 p-16 md:p-32 text-center relative overflow-hidden group shadow-3xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 blur-[150px] rounded-full"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 text-accent-500 group-hover:scale-110 transition-transform">
                            <Rocket size={40} />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight">Ready for a <br /><span className="text-accent-500">Peak Performance</span> Shift?</h3>
                        <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                            Don't wait for opportunities—create them. Join our premium placement hub today.
                        </p>
                        <div className="pt-6">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-16 py-6 bg-white text-slate-950 rounded-3xl font-black text-xl uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95">
                                Join the Movement
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Programs;

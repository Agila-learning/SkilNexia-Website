import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, ChevronRight, Search, Target, Code, Database,
    Shield, Cpu, Briefcase, ArrowRight, Award, TrendingUp,
    Users, Star, Clock, Zap, Globe, Rocket, Layers
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';
import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';

gsap.registerPlugin(ScrollTrigger);

const Programs = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [coursesList, setCoursesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            // Card stagger
            const cards = gsap.utils.toArray('.program-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.programs-grid',
                            start: 'top 95%',
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });

        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                if (res.data && res.data.length > 0) {
                    setCoursesList(res.data);
                } else {
                    setCoursesList(COURSE_CATEGORIES.map(c => ({ ...c, _id: c.id })));
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
                setCoursesList(COURSE_CATEGORIES.map(c => ({ ...c, _id: c.id })));
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();

        return () => ctx.revert();
    }, []);

    // Show all courses as roadmaps
    const placementPrograms = coursesList;

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans overflow-x-hidden relative">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

            {/* Premium Header Content */}
            <div className="bg-slate-950 pt-32 pb-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-primary-600/10 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-accent-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10 reveal-up">
                        <Zap size={14} className="animate-pulse" /> Career Launchpad 2026
                    </div>
                    <h1 className="font-black uppercase tracking-tighter leading-[1.1] text-5xl md:text-8xl text-white mb-10">
                        High Impact <br /><span className="inline-block pr-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-primary-400 to-emerald-400">Execution</span> <br />Programs.
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


            {/* View Mode Toggle & Premium Program Cards */}
            <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-32">
                {/* Advanced Control Bar for Programs */}
                <div className="mb-12 glass-card-premium p-5 rounded-[32px] overflow-hidden flex flex-col lg:flex-row gap-6 items-center justify-between border-t border-white/10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white ml-4">Elite Roadmaps</h2>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="hidden sm:flex bg-white/5 rounded-2xl p-1.5 border border-white/10">
                            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                <LayoutGrid size={22} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                                <List size={22} />
                            </button>
                        </div>
                    </div>
                </div>


                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 programs-grid" : "space-y-8 programs-grid"}>
                    {placementPrograms.map((course) => (
                        <div key={course._id} className={`program-card group overflow-hidden transition-all duration-700 glass-card-premium border border-white/5 hover:border-blue-500/30 hover:-translate-y-4 opacity-100 ${viewMode === 'list' ? 'rounded-[40px] flex flex-col md:flex-row h-auto p-4' : 'rounded-[60px] flex flex-col h-full'}`}>
                            <div className={`relative overflow-hidden bg-slate-900 ${viewMode === 'list' ? 'h-64 md:h-full md:w-[400px] shrink-0 rounded-[30px]' : 'h-72 mx-2 mt-2 rounded-[45px]'}`}>
                                <img src={course.thumbnail || course.banner || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" />
                                <div className="absolute inset-0 bg-transparent"></div>
                                <div className="absolute top-6 left-6 px-4 py-2 bg-slate-950 border border-white/20 rounded-xl text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-xl">
                                    {course.category}
                                </div>
                                <div className="absolute bottom-6 left-8 text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex text-accent-500">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <span className="text-xs font-black italic">4.9+</span>
                                    </div>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Elite Performance</p>
                                </div>
                            </div>

                            <div className={`flex flex-col flex-grow ${viewMode === 'list' ? 'p-8 md:p-10 justify-center' : 'p-10 md:p-12'}`}>
                                <h3 className="font-black uppercase tracking-tighter leading-[1.1] text-2xl md:text-3xl mb-6 text-white">{course.title}</h3>

                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors group-hover:bg-blue-500/10">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Duration</p>
                                        <div className="flex items-center gap-2 font-black text-white text-sm"><Clock size={16} className="text-accent-500" /> {course.duration}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors group-hover:bg-emerald-500/10">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Peak Hike</p>
                                        <div className="flex items-center gap-2 font-black text-emerald-400 text-sm"><TrendingUp size={16} /> 150%</div>
                                    </div>
                                </div>

                                <div className="bg-slate-950/50 p-6 rounded-3xl mb-10 border border-white/5 transition-all group-hover:scale-105 group-hover:shadow-2xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Award size={18} className="text-accent-500" />
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Job Guarantee Program</p>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                                        Includes direct resume shortlisting and elite network access.
                                    </p>
                                </div>

                                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between gap-4">
                                    <Link to={`/courses/${course._id}`} className="px-6 py-4 bg-white/5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5">
                                        Details
                                    </Link>
                                    <button onClick={() => setIsRegisterOpen(true)} className="flex-grow px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group/btn">
                                        Secure Seat <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Premium Hiring Section */}
            <section className="bg-slate-950 py-32 border-t border-white/5 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="space-y-6 mb-20">
                        <div className="inline-flex gap-2 text-primary-400 font-black uppercase tracking-[0.3em] text-[10px] items-center justify-center">
                            <div className="w-12 h-1 bg-primary-400 rounded-full"></div> Global Hire Network
                        </div>
                        <h2 className="font-black uppercase tracking-tighter leading-[1.1] text-5xl md:text-7xl text-white">The Skilnexia <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">Alumni Reach</span></h2>
                        <p className="text-slate-500 font-medium">Our graduates work at the world's most innovative companies.</p>
                    </div>


                    {/* Animated dual-axis horizontal logo marquees */}
                    <div className="relative overflow-hidden py-10 before:absolute before:left-0 before:top-0 before:z-10 before:w-24 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:w-24 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent">
                        <div className="flex gap-20 items-center animate-marquee whitespace-nowrap mb-12">
                            {[
                                { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                                { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                                { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
                                { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                                { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
                                { name: 'IBM', src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
                                { name: 'Intel', src: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg' },
                                { name: 'Salesforce', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
                            ].map(({ name, src }) => (
                                <div key={name} className="inline-flex items-center justify-center h-12 px-6 opacity-40 hover:opacity-100 transition-all grayscale hover:grayscale-0 scale-100 hover:scale-110 shrink-0">
                                    <img src={src} alt={name} className="h-10 max-w-[140px] object-contain" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-20 items-center animate-[marquee_30s_linear_infinite_reverse] whitespace-nowrap pb-4">
                            {[
                                { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                                { name: 'Nvidia', src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
                                { name: 'Tesla', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
                                { name: 'SpaceX', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg' },
                                { name: 'OpenAI', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
                                { name: 'Airbnb', src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg' },
                                { name: 'Spotify', src: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_with_text.svg' },
                            ].map(({ name, src }) => (
                                <div key={name} className="inline-flex items-center justify-center h-12 px-6 opacity-40 hover:opacity-100 transition-all grayscale hover:grayscale-0 scale-100 hover:scale-110 shrink-0">
                                    <img src={src} alt={name} className="h-10 max-w-[140px] object-contain" />
                                </div>
                            ))}
                        </div>
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
                        <h3 className="font-black uppercase tracking-tighter leading-[1.1] text-4xl md:text-6xl text-white">Ready for a <br /><span className="text-accent-500">Peak Performance</span> Shift?</h3>
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

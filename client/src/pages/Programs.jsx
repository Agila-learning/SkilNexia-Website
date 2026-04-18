import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, ChevronRight, Search, Target, Code, Database,
    Shield, Cpu, Briefcase, ArrowRight, Award, TrendingUp,
    Users, Star, Clock, Zap, Globe, Rocket, Layers, LayoutGrid, List
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
        fetchCourses();
    }, []);

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

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.program-card');
            if (cards.length > 0) {
                gsap.fromTo(cards,
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.05,
                        ease: 'power2.out'
                    }
                );
            }
        });

        return () => ctx.revert();
    }, [loading, viewMode, coursesList]);

    // Show all courses as roadmaps
    const placementPrograms = coursesList;

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans overflow-x-hidden relative">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

            {/* Premium Header Content */}
            <div className="bg-slate-950 pt-24 md:pt-32 pb-40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-primary-600/10 blur-[150px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-500 text-[9px] font-black uppercase tracking-[0.2em] mb-8">
                        <Zap size={12} className="animate-pulse" /> Career Launchpad 2026
                    </div>
                    <h1 className="font-black uppercase tracking-tighter leading-[1.1] text-4xl md:text-7xl text-white mb-8">
                        High Impact <br /><span className="inline-block pr-6 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-primary-400 to-emerald-400">Execution</span> <br />Programs.
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl font-medium mb-12 leading-relaxed">
                        Elite vocational tracks co-engineered with global industry leaders. Not just a course, but a guaranteed transition into the world's most innovative tech ecosystems.
                    </p>

                    <div className="flex flex-wrap gap-10 border-t border-white/5 pt-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-accent-500"><Users size={24} /></div>
                            <div>
                                <p className="font-black text-2xl leading-none tracking-tighter uppercase">50K+</p>
                                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">Alumni</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Briefcase size={24} /></div>
                            <div>
                                <p className="font-black text-2xl leading-none tracking-tighter uppercase">500+</p>
                                <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">Partners</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* View Mode Toggle & Premium Program Cards */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10 pb-32">
                {/* Advanced Control Bar for Programs */}
                <div className="mb-8 glass-card-premium p-3 md:p-5 rounded-[28px] flex flex-row items-center justify-between border-t border-white/10">
                    <h2 className="text-base md:text-lg font-black uppercase tracking-tighter text-white ml-2">Elite Roadmaps</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm no-invert' : 'text-slate-400 hover:text-white'}`}>
                                <LayoutGrid size={16} />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 md:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm no-invert' : 'text-slate-400 hover:text-white'}`}>
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>


                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 programs-grid" : "flex flex-col gap-6 md:gap-8 programs-grid"}>
                    {placementPrograms.map((course) => (
                        <div key={course._id} className={`program-card group overflow-hidden transition-all duration-500 glass-card-premium border border-white/5 hover:border-accent-500/30 hover:-translate-y-1 ${viewMode === 'list' ? 'rounded-[24px] md:rounded-[32px] flex flex-col lg:flex-row p-3 md:p-6' : 'rounded-[32px] md:rounded-[40px] flex flex-col h-full'}`}>
                            <div className={`relative overflow-hidden bg-slate-900 ${viewMode === 'list' ? 'h-48 md:h-56 lg:h-auto lg:w-72 shrink-0 rounded-xl md:rounded-2xl' : 'h-48 md:h-56 mx-1 md:mx-1.5 mt-1 md:mt-1.5 rounded-2xl md:rounded-[32px]'}`}>
                                <img src={course.thumbnail || course.banner || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-slate-950 border border-white/20 rounded-md text-white font-black text-[7px] uppercase tracking-widest shadow-xl">
                                    {course.category}
                                </div>
                            </div>

                            <div className={`flex flex-col flex-grow ${viewMode === 'list' ? 'p-4 md:p-8 lg:p-10 justify-center' : 'p-6 md:p-8'}`}>
                                <div className="flex flex-col mb-4 md:mb-6">
                                    <h3 className="font-black uppercase tracking-tighter leading-tight text-xl md:text-2xl text-white mb-1.5 break-words">{course.title}</h3>
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-accent-500" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{course.duration} Intensive</span>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 md:mb-8 line-clamp-2">
                                    Master {course.title} through hyper-focused execution nodes and direct mentorship.
                                </p>

                                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                    <div className="bg-slate-950/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                                        <Award size={14} className="text-accent-500 mb-1.5" />
                                        <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none mb-1">Guaranteed</p>
                                        <p className="text-slate-500 text-[9px] font-medium leading-tight italic">Job Pairing</p>
                                    </div>
                                    <div className="bg-slate-950/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
                                        <Zap size={14} className="text-emerald-500 mb-1.5" />
                                        <p className="text-[8px] font-black text-white uppercase tracking-widest leading-none mb-1">Peak Hike</p>
                                        <p className="text-slate-500 text-[9px] font-medium leading-tight italic">Avg 150%</p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 md:gap-4">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="flex -space-x-1.5">
                                            {[1,2,3].map(i => (
                                                <img key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-slate-900 object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                                            ))}
                                        </div>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Nodes</p>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                                        <Link to={`/courses/${course._id}`} className="px-4 py-2 bg-white/5 text-white rounded-lg md:rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                                            Specs
                                        </Link>
                                        <button onClick={() => setIsRegisterOpen(true)} className="flex-grow sm:flex-none px-6 py-2.5 bg-white text-slate-950 rounded-lg md:rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 group/btn">
                                            Enroll <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
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
                    <div className="relative overflow-hidden py-10 before:absolute before:left-0 before:top-0 before:z-10 before:w-24 before:h-full before:bg-gradient-to-r before:from-slate-950 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:w-24 after:h-full after:bg-gradient-to-l after:from-slate-950 after:to-transparent">
                        <div className="flex gap-6 items-center animate-marquee whitespace-nowrap mb-6">
                            {[
                                { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                                { name: 'Amazon', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                                { name: 'Microsoft', src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
                                { name: 'Netflix', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                                { name: 'Meta', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
                                { name: 'IBM', src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
                                { name: 'Intel', src: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg' },
                                { name: 'Salesforce', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
                                { name: 'Google_', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                                { name: 'Amazon_', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                                { name: 'Microsoft_', src: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
                                { name: 'Netflix_', src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                            ].map(({ name, src }) => (
                                <div key={name} className="inline-flex items-center justify-center h-16 px-6 min-w-[140px] bg-white/8 hover:bg-white border border-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] shrink-0 group/logo">
                                    <img src={src} alt={name.replace(/_/g, '')} className="h-8 max-w-[120px] object-contain brightness-0 invert opacity-60 group-hover/logo:brightness-100 group-hover/logo:invert-0 group-hover/logo:opacity-100 transition-all duration-300" />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-6 items-center animate-[marquee_35s_linear_infinite_reverse] whitespace-nowrap pb-4">
                            {[
                                { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                                { name: 'Nvidia', src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
                                { name: 'Tesla', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
                                { name: 'SpaceX', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg' },
                                { name: 'OpenAI', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
                                { name: 'Spotify', src: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
                                { name: 'Uber', src: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
                                { name: 'Apple_', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                                { name: 'Nvidia_', src: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
                                { name: 'Tesla_', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
                                { name: 'SpaceX_', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg' },
                            ].map(({ name, src }) => (
                                <div key={name} className="inline-flex items-center justify-center h-16 px-6 min-w-[140px] bg-white/8 hover:bg-white border border-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] shrink-0 group/logo">
                                    <img src={src} alt={name.replace(/_/g, '')} className="h-8 max-w-[120px] object-contain brightness-0 invert opacity-60 group-hover/logo:brightness-100 group-hover/logo:invert-0 group-hover/logo:opacity-100 transition-all duration-300" />
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

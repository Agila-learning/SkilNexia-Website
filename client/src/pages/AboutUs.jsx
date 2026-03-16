import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Award, Shield, Briefcase, Globe, Star, CheckCircle, Clock, Heart, Lightbulb, TrendingUp, Zap, ArrowRight, Phone, Rocket, Code, Search } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isExpertOpen, setIsExpertOpen] = useState(false);

    // AI Assets Paths (Relative to public folder)
    const HERO_IMG = "/images/about_hero.png";
    const WHO_WE_ARE_IMG = "/images/who_we_are.png";
    const VISION_IMG = "/images/mission_vision.png";

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            // Initial Hero Animation
            gsap.from('.hero-content', {
                y: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'power4.out',
                delay: 0.2
            });

            // Reveal animations
            gsap.utils.toArray('.reveal-up').forEach((elem) => {
                gsap.from(elem, {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 92%',
                    }
                });
            });

            // Trainers stagger reveal
            gsap.utils.toArray('.trainer-item').forEach(el => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
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

            // Ecosystem Stagger Reveal
            gsap.utils.toArray('.eco-step').forEach((elem) => {
                gsap.from(elem, {
                    x: -50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });
        });
        return () => ctx.revert();
    }, []);

    const trainers = [
        { name: "Dr. Arvan Sharma", role: "Head of AI", exp: "15+ Years", bio: "Former DeepMind Researcher and Principal Architect at tech giants. Dr. Arvan leads our AI Research division and curriculum design.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
        { name: "Priya Varma", role: "Full Stack CTO", exp: "12+ Years", bio: "Leading architect for high-scale microservices and cloud ecosystems. Priya specializes in distributed systems and React architecture.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400" },
        { name: "Suresh Mani", role: "Cyber Security lead", exp: "14+ Years", bio: "Certified security master protecting Fortune 500 digital assets. Suresh brings deep domain expertise in penetration testing and Chennai-based tech infrastructure.", img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400" }
    ];

    return (
        <div className="bg-white min-h-screen font-sans overflow-x-hidden">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <ConsultationModal isOpen={isExpertOpen} onClose={() => setIsExpertOpen(false)} />

            {/* 1. ULTRA PREMIUM HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 z-0">
                    <img src={HERO_IMG} className="w-full h-full object-cover opacity-90 scale-105" alt="Skilnexia Tech Lab" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center hero-content">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-500/20 border border-accent-500/50 text-white text-[11px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-xl">
                        <Zap size={14} className="animate-pulse text-accent-400" /> The Skilnexia Identity
                    </div>
                    <h1 className="text-5xl md:text-9xl font-black text-white mb-10 leading-[0.9] tracking-tighter uppercase">
                        Architecting <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-primary-400 to-emerald-400">Human Logic.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-16 opacity-90">
                        We don't just teach code; we engineer the cognitive infrastructure required to lead in the global tech hierarchy. Welcome to the elite tier of career evolution.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <button onClick={() => setIsRegisterOpen(true)} className="px-14 py-6 bg-white text-slate-950 rounded-[32px] font-black text-lg uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95">Enter Ecosystem</button>
                        <Link to="/contact" className="px-14 py-6 bg-white/5 border border-white/20 text-white rounded-[32px] font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-xl">Talk to Visionaries</Link>
                    </div>
                </div>
            </section>

            {/* 2. WHO WE ARE - THE CORE NARRATIVE */}
            <section className="py-20 lg:py-40 bg-white px-4 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                    <div className="reveal-up relative">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent-500/10 rounded-full blur-[80px]"></div>
                        <div className="relative border-[32px] border-slate-50 rounded-[80px] overflow-hidden shadow-3xl">
                            <img src={WHO_WE_ARE_IMG} alt="Elite Collaboration" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-20 -right-10 bg-slate-950 p-12 rounded-[40px] shadow-3xl hidden xl:block border border-white/10 max-w-[320px]">
                            <p className="text-5xl font-black text-white mb-4 tracking-tighter">Gold Standard<span className="text-accent-500">.</span></p>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Certified by global hiring partners as the premier skill aggregator.</p>
                        </div>
                    </div>
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h4 className="text-primary-900 font-black uppercase tracking-[0.4em] text-[10px] reveal-up">Identity Check</h4>
                            <h2 className="text-4xl md:text-7xl font-black text-slate-950 leading-none uppercase tracking-tighter reveal-up">Who We <br /><span className="text-slate-300">Actually Are.</span></h2>
                        </div>
                        <div className="space-y-8 text-xl text-slate-900 leading-relaxed font-bold reveal-up">
                            <p>
                                Skilnexia isn't a training center. We are a <span className="text-slate-950 font-black border-b-4 border-accent-500">Tech Performance Lab</span>. Born from the need for pure execution expertise, we strips away the fluff of academic theory to provide hyper-focused, industry-ready roadmaps.
                            </p>
                            <p>
                                Our team consists of active leads and architects from FAANG and high-growth startups. We don't just know the stack; we built the stack.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. VISION & MISSION - ABSTRACT HIGH-END */}
            <section className="py-40 bg-slate-950 text-white px-4 relative overflow-hidden rounded-[100px] mx-4 mb-40">
                <img src={VISION_IMG} className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110 pointer-events-none" alt="" />
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-20">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center text-accent-500 backdrop-blur-2xl">
                            <Target size={48} />
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">The Vision <br /><span className="text-slate-500">& The Mission.</span></h2>
                        <p className="text-2xl text-slate-400 font-medium leading-relaxed">
                            “To architect a world where raw potential is never wasted by outdated systems, and where every motivated mind has access to the gold-standard of career evolution.”
                        </p>
                    </div>
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: "Mission Alpha", desc: "Build the most rigorous, project-centric curriculum on the planet.", icon: <Zap size={24} /> },
                            { title: "Mission Beta", desc: "Forge direct hiring bridges with the top 500 global tech giants.", icon: <Shield size={24} /> },
                            { title: "Mission Gamma", desc: "Democratize elite mentorship through our Evolution LMS.", icon: <Users size={24} /> },
                            { title: "Mission Delta", desc: "Eradicate the 'Skill Gap' for the next generation of architects.", icon: <Trophy size={24} /> }
                        ].map((m, i) => (
                            <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/10 transition-all backdrop-blur-xl group">
                                <div className="text-accent-500 mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
                                <h4 className="text-xl font-black uppercase mb-4 tracking-tight">{m.title}</h4>
                                <p className="text-slate-400 font-medium leading-relaxed text-sm">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. ECOSYSTEM FLOW - ANIMATED STEP BY STEP */}
            <section className="py-40 bg-white px-4 ecosystem-section">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 lg:mb-32 space-y-6">
                        <h2 className="text-4xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-none">How We <br /><span className="text-accent-500">Deploy Excellence.</span></h2>
                    </div>

                    <div className="space-y-20 relative">
                        <div className="absolute left-[54px] top-0 bottom-0 w-1 bg-slate-100 hidden lg:block"></div>

                        {[
                            { title: "Phase 1: Diagnosis", desc: "We audit your current skill matrix and align it with a curated industry roadmap.", icon: <Search /> },
                            { title: "Phase 2: Deep Immersion", desc: "High-intensity builds on real enterprise tech stacks under expert scrutiny.", icon: <Code /> },
                            { title: "Phase 3: Forge Mastery", desc: "Rigorous assessment and project defense before industry architects.", icon: <Award /> },
                            { title: "Phase 4: Global Deployment", desc: "Direct placement pairing with premium global hiring partners.", icon: <Rocket /> }
                        ].map((step, i) => (
                            <div key={i} className="eco-step flex flex-col lg:flex-row gap-12 items-center bg-slate-50 p-12 rounded-[50px] border border-slate-100 hover:shadow-2xl transition-all">
                                <div className="w-28 h-28 shrink-0 bg-slate-950 text-accent-500 rounded-[35px] flex items-center justify-center shadow-3xl border-8 border-white">
                                    {React.cloneElement(step.icon, { size: 40 })}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Step 0{i + 1}: {step.title}</h4>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. EXPERTS & PLACEMENTS HIGHLIGHT */}
            <section className="py-40 bg-slate-50 px-4 border-t border-slate-100">
                <div className="max-w-7xl mx-auto space-y-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <h2 className="text-5xl font-black text-slate-950 uppercase tracking-tight leading-none reveal-up">The Titans <br /><span className="text-primary-900">Who Train You.</span></h2>
                            <div className="space-y-8 trainers-grid">
                                {trainers.map((t, i) => (
                                    <div key={i} className="trainer-item flex gap-8 items-start group">
                                        <img src={t.img} className="w-24 h-24 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-xl mt-1" alt={t.name} />
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black text-slate-900 uppercase">{t.name}</h4>
                                            <p className="text-accent-600 font-black text-[10px] uppercase tracking-widest">{t.role} • {t.exp}</p>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">{t.bio}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-950 rounded-[60px] p-16 text-white space-y-10 relative overflow-hidden shadow-3xl">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-900/20 blur-[100px] rounded-full"></div>
                            <h2 className="text-4xl font-black uppercase tracking-tight relative z-10 leading-none">Elite <br /><span className="text-emerald-400">Placements.</span></h2>
                            <p className="text-slate-400 text-lg font-medium relative z-10 leading-relaxed">
                                Our graduates don't apply for jobs; they are invited into roles. 98% of our alumni secure senior-tier roles within 4 months of roadmap completion.
                            </p>
                            <div className="grid grid-cols-2 gap-10 relative z-10">
                                <div>
                                    <p className="text-4xl font-black text-white">₹45,00,000</p>
                                    <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] mt-2">Highest Package Secured</p>
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-white">500+</p>
                                    <p className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] mt-2">Premium Hiring Partners</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="pb-40 px-4">
                <div className="max-w-7xl mx-auto rounded-[80px] bg-slate-950 p-20 md:p-32 text-center relative overflow-hidden group shadow-3xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto border border-white/10 text-accent-500 group-hover:scale-110 transition-transform">
                            <Rocket size={48} />
                        </div>
                        <h2 className="text-4xl md:text-8xl font-black text-white leading-tight uppercase tracking-tighter">Are You Ready For <br /><span className="text-accent-500">The Next Phase?</span></h2>
                        <div className="pt-6">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-16 py-7 bg-white text-slate-950 rounded-[35px] font-black text-xl uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95">
                                Join the Movement
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Internal icon fix
const Trophy = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default AboutUs;

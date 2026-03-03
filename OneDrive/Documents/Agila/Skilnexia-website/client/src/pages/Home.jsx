import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    PlayCircle, Award, Users, BookOpen, ArrowRight, Zap, Target, Star,
    ChevronLeft, ChevronRight, Globe, Code, Database, Cpu, Menu, X,
    ArrowUp, CheckCircle, Shield, Briefcase, ChevronDown, Rocket,
    Smartphone, PenTool, BarChart, Terminal, Heart, Lightbulb, TrendingUp
} from 'lucide-react';

import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
    { id: 1, name: 'Sarah Jenkins', role: 'Data Scientist @ Google', text: 'Skilnexia transformed my career. The project-based learning closely mimics actual industry workflows.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'David Chen', role: 'Security Analyst @ Cisco', text: 'The curriculum is incredibly modern. I\'m now securing networks I never thought possible before this platform.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: 'Elena Rodriguez', role: 'Cloud Arch @ Netflix', text: 'Best investment I made. The placement assistance program directly connected me with my current employer.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
];

const PARTNER_COMPANIES = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
];

const FAQS = [
    { q: "Do I need prior coding experience?", a: "No, our programs start from the absolute basics and progressively build your skills towards advanced concepts." },
    { q: "Is placement guaranteed?", a: "We provide 100% placement assistance, including dedicated career coaching, mock interviews, and direct referrals to our 500+ hiring partners." },
    { q: "Can I pay in installments?", a: "Yes, we offer flexible EMI options up to 12 months with 0% interest for eligible candidates." },
    { q: "Will I get a certificate?", a: "Yes, upon successful completion of the course and assignments, you will receive an industry-recognized digital certificate." }
];

const MASTERY_STEPS = [
    {
        title: "01. Choose Your Roadmap",
        desc: "Select a specialized career path curated by industry veterans. Whether it's AI, Full Stack, or Cyber Security, we have a premium roadmap for you.",
        icon: <Target size={48} />,
        bg: "bg-slate-950",
        accent: "text-accent-500",
        btnText: "Explore All Maps",
        btnLink: "/courses"
    },
    {
        title: "02. Master Through Projects",
        desc: "Move beyond theory. Build real-world enterprise applications that simulate actual work environments. 100% Practical. 100% Professional.",
        icon: <Code size={48} />,
        bg: "bg-primary-900",
        accent: "text-emerald-400",
        btnText: "View Curriculum",
        btnLink: "/programs"
    },
    {
        title: "03. 1-on-1 Mentorship",
        desc: "Get direct access to mentors working at top-tier tech companies. Weekly doubt sessions and code reviews to ensure you never get stuck.",
        icon: <Users size={48} />,
        bg: "bg-slate-900",
        accent: "text-blue-400",
        btnText: "Meet the Mentors",
        btnLink: "/about"
    },
    {
        title: "04. Global Certification",
        desc: "Earn an industry-recognized certificate that validates your expertise. Share it with potential employers and stand out in the global tech market.",
        icon: <Award size={48} />,
        bg: "bg-black",
        accent: "text-accent-500",
        btnText: "Learn About Certification",
        btnLink: "/programs"
    }
];

const Home = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isExpertOpen, setIsExpertOpen] = useState(false);

    const stackRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animations
            gsap.fromTo('.hero-anim',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );

            // Stacking Cards Animation
            const cards = gsap.utils.toArray('.stack-card');
            cards.forEach((card, i) => {
                if (i !== cards.length - 1) {
                    gsap.to(card, {
                        scale: 0.9,
                        opacity: 0.3,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 15%',
                            endTrigger: cards[i + 1],
                            end: 'top 15%',
                            scrub: true,
                        }
                    });
                }
            });

            // Counter Animations
            gsap.from('.counter', {
                textContent: 0,
                duration: 2,
                ease: 'power1.inOut',
                snap: { textContent: 1 },
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.counter-section',
                    start: 'top 80%',
                }
            });

            const animSelectors = ['.category-card', '.why-card', '.testimonial-card', '.reveal-up'];
            animSelectors.forEach(selector => {
                gsap.utils.toArray(selector).forEach(el => {
                    gsap.fromTo(el,
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top 98%',
                                toggleActions: "play none none none"
                            }
                        }
                    );
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-[#fcfdfe] text-slate-900 font-sans overflow-x-hidden">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <ConsultationModal isOpen={isExpertOpen} onClose={() => setIsExpertOpen(false)} />

            {/* 1. High-End Hero Section */}
            <section className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -skew-x-12 translate-x-1/4 -z-10 border-l border-slate-100"></div>
                <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-primary-600/5 blur-[120px] rounded-full"></div>

                <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="hero-anim inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-black tracking-[0.2em] text-accent-500 uppercase">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-accent-500 animate-pulse"></span>
                            Accelerated Career Mastery
                        </div>
                        <h1 className="hero-anim text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black uppercase opacity-100">
                            Own Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-900 via-primary-700 to-accent-600">Evolution.</span>
                        </h1>
                        <p className="hero-anim text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                            Premium tech programs designed for the ambitious. Master high-demand skills through expert-led industry roadmaps.
                        </p>
                        <div className="hero-anim flex flex-wrap gap-6">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-12 py-6 bg-slate-950 text-white rounded-3xl font-black text-lg hover:bg-primary-900 transition-all shadow-3xl shadow-slate-900/20 active:scale-95 uppercase tracking-widest flex items-center gap-3 border border-slate-800">
                                Start Learning <ArrowRight size={22} />
                            </button>
                            <Link to="/courses" className="px-12 py-6 bg-white border border-slate-200 text-slate-900 rounded-3xl font-black text-lg hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest flex items-center gap-3">
                                View Roadmaps
                            </Link>
                        </div>

                        <div className="hero-anim flex items-center gap-8 pt-8 border-t border-slate-100">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-100">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Student" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-white bg-accent-500 flex items-center justify-center text-white text-xs font-black">+50K</div>
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest leading-tight">
                                Joined by 50K+ <br /><span className="text-slate-900">Success Stories</span>
                            </p>
                        </div>
                    </div>
                    <div className="hero-anim relative hidden lg:block">
                        <div className="relative z-10 rounded-[60px] overflow-hidden shadow-3xl border-[16px] border-white bg-slate-50 group aspect-[4/5] flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Tech Excellence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[40px] shadow-3xl z-20 flex items-center gap-6 border border-slate-100 hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Award size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placement Assist</p>
                                <p className="text-2xl font-black text-slate-950 tracking-tighter">100% Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Scroll-Based Stacking Cards: The Journey */}
            <section ref={stackRef} className="py-32 bg-[#0a0c10] text-white overflow-visible">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-32 space-y-6">
                        <div className="inline-flex gap-2 text-accent-500 font-black uppercase tracking-[0.3em] text-[10px] items-center">
                            <div className="w-12 h-0.5 bg-accent-500"></div> Step-by-Step Evolution
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">The Mastery <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-400">Path</span></h2>
                    </div>

                    <div className="space-y-[40vh] pb-[40vh]">
                        {MASTERY_STEPS.map((step, idx) => (
                            <div key={idx} className="stack-card w-full max-w-5xl mx-auto opacity-100">
                                <div className={`relative ${step.bg} rounded-[60px] p-12 md:p-24 border-2 border-white/20 shadow-3xl overflow-hidden min-h-[500px] flex flex-col justify-center opacity-100`}>
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
                                        <div className="md:col-span-8 space-y-8">
                                            <div className={`${step.accent} mb-4`}>{step.icon}</div>
                                            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">{step.title}</h3>
                                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">{step.desc}</p>
                                            <div className="pt-6">
                                                {step.action === 'expert' ? (
                                                    <button
                                                        onClick={() => setIsExpertOpen(true)}
                                                        className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all"
                                                    >
                                                        {step.btnText}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={step.btnLink || "/courses"}
                                                        className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all inline-block"
                                                    >
                                                        {step.btnText || "Start This Step"}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:block md:col-span-4 text-center opacity-10">
                                            <div className="text-[200px] font-black leading-none">{idx + 1}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Global Certification Section (Stats/Counters) */}
            <section className="py-32 bg-white counter-section overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                    {[
                        { label: "Talent Hub", value: 50000, suffix: "+", sub: "Global Learners" },
                        { label: "Elite Partners", value: 500, suffix: "+", sub: "Hiring Now" },
                        { label: "Peak Offer", value: 45, suffix: " LPA", sub: "Highest Package" },
                        { label: "Career Spike", value: 150, suffix: "%", sub: "Average Hike" }
                    ].map((stat, i) => (
                        <div key={i} className="reveal-up space-y-4 text-center group">
                            <div className="text-6xl md:text-7xl font-black text-slate-950 tracking-tighter mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                                <span className="counter">{stat.value}</span>{stat.suffix}
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-primary-600 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-sm font-bold text-slate-400">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. Course Categories: Dynamic Grid */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:40px_40px]"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                        <div className="space-y-6">
                            <div className="inline-flex gap-2 text-primary-900 font-black uppercase tracking-[0.3em] text-[10px] items-center">
                                <div className="w-12 h-1 bg-primary-900 rounded-full"></div> Domain Mastery
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-[0.9]">Explore <br />Roadmaps</h2>
                        </div>
                        <Link to="/courses" className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 border-b-4 border-accent-500 pb-2 hover:border-primary-900 transition-all">
                            View All Roadmaps
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {COURSE_CATEGORIES.slice(0, 8).map((cat, idx) => (
                            <Link key={idx} to={`/courses?category=${cat.category}`} className="category-card relative group">
                                <div className="h-full bg-white p-12 rounded-[50px] border-2 border-slate-200 group-hover:border-primary-100 group-hover:shadow-3xl transition-all duration-500 flex flex-col items-center text-center">
                                    Reference text: domain mastery grid cards
                                    <div className="w-20 h-20 bg-slate-50 text-slate-900 rounded-[30px] flex items-center justify-center mb-10 group-hover:bg-primary-900 group-hover:text-white transition-all group-hover:rotate-12 group-hover:scale-110">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-950 mb-3 uppercase tracking-tight">{cat.title}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Master 20+ Skills</p>

                                    <div className="mt-10 w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-accent-500 group-hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Visionary Section - FIXED Half-Empty Bug */}
            <section className="py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-slate-950 rounded-[80px] p-12 md:p-32 relative overflow-hidden text-white flex flex-col lg:flex-row items-center gap-24 shadow-3xl border border-slate-900">
                        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-primary-600/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="lg:w-1/2 space-y-12 relative z-10 text-center lg:text-left">
                            <div className="reveal-up space-y-6">
                                <h3 className="text-accent-500 text-xs font-black uppercase tracking-[0.4em]">The Skilnexia Vision</h3>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[1.1]">Bridge the <br />Gap Between <br />Dreams & Skill.</h2>
                            </div>
                            <p className="reveal-up text-xl font-medium text-slate-400 leading-relaxed italic border-l-0 lg:border-l-4 border-accent-500 pl-0 lg:pl-8 mx-auto lg:mx-0 max-w-2xl">
                                “We're not just an edtech platform. We're an engine of transformation for those who dare to master the modern enterprise.”
                            </p>
                            <Link to="/about" className="reveal-up pt-10 flex justify-center lg:justify-start">
                                <button className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95">
                                    Join the Movement
                                </button>
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative z-10 w-full">
                            <div className="grid grid-cols-2 gap-6 sm:gap-8">
                                {[
                                    { label: "Job-Ready", text: "Curriculum designed for the now.", icon: <Rocket className="text-emerald-400" /> },
                                    { label: "1:1 Expert", text: "Direct mentorship for every learner.", icon: <Users className="text-blue-400" /> },
                                    { label: "Global Ops", text: "Scale your skills everywhere.", icon: <Globe className="text-accent-500" /> },
                                    { label: "Placement", text: "End-to-end career transition.", icon: <Briefcase className="text-primary-400" /> }
                                ].map((item, i) => (
                                    <div key={i} className="reveal-up bg-white/5 p-8 rounded-[40px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all space-y-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-black uppercase tracking-tight">{item.label}</h4>
                                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Partner/Hiring Section - Brand Updated to ALUMNI REACH */}
            <section className="py-32 bg-slate-50 overflow-hidden relative border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-24 space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-primary-900 font-black uppercase tracking-[0.5em] text-[12px] reveal-up">The Skilnexia</span>
                            <h2 className="text-6xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-none reveal-up">Alumni <span className="text-primary-900">Reach.</span></h2>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs reveal-up mt-8">Engineering careers at the world's most innovative tech giants</p>
                    </div>
                    <div className="relative group p-12 bg-white rounded-[60px] shadow-2xl border border-slate-100">
                        <div className="flex w-max gap-20 animate-scroll-left hover:[animation-play-state:paused] transition-all items-center">
                            {[...PARTNER_COMPANIES, ...PARTNER_COMPANIES].map((company, i) => (
                                <div key={i} className="partner-logo shrink-0 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 hover:scale-110">
                                    <img src={company.logo} alt={company.name} className="h-10 md:h-14 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Student Stories */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-24 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase leading-[1.1]">Elite Success <br />Gallery</h2>
                        <div className="flex justify-center gap-1 text-accent-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} fill="currentColor" />)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.id} className="testimonial-card relative group h-full">
                                <div className="h-full bg-slate-50 rounded-[60px] p-12 hover:bg-white border border-slate-50 hover:border-primary-100 hover:shadow-3xl transition-all duration-500 flex flex-col">
                                    <div className="mb-10 w-20 h-20 rounded-[30px] overflow-hidden border-4 border-white shadow-xl">
                                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-slate-600 font-medium italic leading-relaxed mb-12">"{t.text}"</p>
                                    <div className="mt-auto">
                                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">{t.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-1">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. Global FAQ */}
            <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-5xl font-black tracking-tighter uppercase">Knowledge Base</h2>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">Everything you need to know about starting your evolution.</p>
                    </div>
                    <div className="space-y-6">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`reveal-up rounded-[35px] border transition-all duration-500 ${activeFaq === i ? 'bg-white border-transparent' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 md:p-10 text-left"
                                >
                                    <span className={`text-xl font-black uppercase tracking-tighter ${activeFaq === i ? 'text-slate-950' : 'text-white'}`}>{faq.q}</span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeFaq === i ? 'bg-slate-900 text-white rotate-180' : 'bg-white/10 text-white'}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </button>
                                <div className={`transition-all duration-500 ${activeFaq === i ? 'max-h-[300px] opacity-100 p-10 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                    <p className="text-slate-600 text-lg font-medium leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. Final CTA: Conversion Engine */}
            <section className="py-40 px-4 bg-white">
                <div className="max-w-7xl mx-auto rounded-[80px] bg-slate-950 p-16 md:p-32 text-center relative overflow-hidden group border border-slate-900 shadow-3xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 blur-[150px] rounded-full"></div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">Elevate Your <br /><span className="text-accent-500">Industry</span> Value.</h2>
                            <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto">Don't just learn. Evolve with Skilnexia's elite mentorship ecosystem. Join 50K+ leaders.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            <button onClick={() => setIsRegisterOpen(true)} className="px-16 py-6 bg-white text-slate-950 rounded-3xl font-black text-xl hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95 uppercase tracking-widest">
                                Start Free Now
                            </button>
                            <button onClick={() => setIsExpertOpen(true)} className="px-16 py-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xl hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest">
                                Speak to Expert
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

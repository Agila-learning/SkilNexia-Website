import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Briefcase, TrendingUp, Building2, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARTNER_COMPANIES = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
    { name: 'Tesla', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
    { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg' },
    { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
    { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' },
    { name: 'Nvidia', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg' },
    { name: 'Salesforce', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg' },
];

const Placements = () => {

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.stagger-item',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans pt-24 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="text-center mb-24 stagger-item">
                    <span className="section-subtitle">Impact Report</span>
                    <h1 className="section-title">
                        Placement <span className="text-brand-gradient">Statistics</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium">
                        Our career transition programs do not just stop at education. We provide an end-to-end recruitment bridge to the world's most innovative companies.
                    </p>
                </div>

                {/* Stat Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 stagger-item">
                    <div className="glass-card-premium p-10 flex flex-col items-center justify-center text-center border-t-4 border-t-blue-500/50 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">98%</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Placement Rate</p>
                    </div>
                    <div className="glass-card-premium p-10 flex flex-col items-center justify-center text-center border-t-4 border-t-accent-500/50 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 text-accent-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">₹12 LPA</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Average Salary</p>
                    </div>
                    <div className="glass-card-premium p-10 flex flex-col items-center justify-center text-center border-t-4 border-t-emerald-500/50 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 text-emerald-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Building2 size={32} />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">500+</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hiring Partners</p>
                    </div>
                    <div className="glass-card-premium p-10 flex flex-col items-center justify-center text-center border-t-4 border-t-indigo-500/50 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 text-indigo-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Award size={32} />
                        </div>
                        <h3 className="text-5xl font-black text-white mb-2 tracking-tighter">₹45 LPA</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Highest CTC</p>
                    </div>
                </div>

                {/* Reports / Analytics Section */}
                <div className="mb-24 stagger-item">
                    <div className="text-center mb-16">
                        <span className="section-subtitle">Analytics Hub</span>
                        <h2 className="section-title">Career <span className="text-brand-gradient">Trajectory</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Bar Chart Mockup (CSS) */}
                        <div className="glass-card-premium p-10">
                            <h3 className="text-xl font-black mb-8 text-white uppercase tracking-tight">Salary Growth Analysis</h3>
                            <div className="space-y-8">
                                {[
                                    { label: 'Baseline', percent: 30, value: '₹4 LPA' },
                                    { label: 'Skilnexia Average', percent: 75, value: '₹12 LPA' },
                                    { label: 'Elite Tier', percent: 100, value: '₹45 LPA' }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                                            <span>{item.label}</span>
                                            <span className="text-white">{item.value}</span>
                                        </div>
                                        <div className="w-full bg-white/5 border border-white/5 rounded-full h-4 overflow-hidden p-1">
                                            <div 
                                                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-accent-500 h-full rounded-full transition-all duration-1000 origin-left shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                                                style={{ width: `${item.percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Domain Distribution Mockup */}
                        <div className="glass-card-premium p-10 flex flex-col justify-center">
                            <h3 className="text-xl font-black mb-10 text-white text-center uppercase tracking-tight">Ecosystem Penetration</h3>
                            <div className="flex flex-wrap gap-6 justify-center">
                                {[
                                    { domain: 'Full Stack', percent: '40%', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
                                    { domain: 'Data Science', percent: '25%', color: 'border-accent-500/30 text-accent-400 bg-accent-500/5' },
                                    { domain: 'Cloud/DevOps', percent: '20%', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
                                    { domain: 'Cyber Security', percent: '15%', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' }
                                ].map((item, i) => (
                                    <div key={i} className={`flex-1 min-w-[130px] text-center p-6 border rounded-3xl backdrop-blur-xl ${item.color} hover:scale-105 transition-transform`}>
                                        <p className="text-4xl font-black mb-1 tracking-tighter">{item.percent}</p>
                                        <p className="text-[9px] uppercase tracking-[0.2em] font-black opacity-60">{item.domain}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hiring Partners Marquee */}
                <div className="mb-24 stagger-item overflow-hidden relative">
                    <div className="text-center mb-16">
                        <span className="section-subtitle">Networks</span>
                        <h2 className="section-title">Hiring <span className="text-brand-gradient">Partners</span></h2>
                    </div>

                    {/* Edge fades - dark bg matching */}
                    <div className="absolute left-0 top-24 bottom-0 w-32 bg-gradient-to-r from-slate-950/90 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-24 bottom-0 w-32 bg-gradient-to-l from-slate-950/90 to-transparent z-10 pointer-events-none"></div>

                    <div className="relative group overflow-hidden">
                        <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] items-center py-8 pr-8">
                            {[...PARTNER_COMPANIES, ...PARTNER_COMPANIES, ...PARTNER_COMPANIES].map((company, i) => (
                                <div
                                    key={i}
                                    className="shrink-0 flex items-center justify-center px-6 py-4 bg-white/10 hover:bg-white border border-white/10 hover:border-white/40 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] group/card min-w-[140px] h-16"
                                >
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="h-7 md:h-8 w-auto object-contain brightness-0 invert opacity-60 group-hover/card:brightness-100 group-hover/card:invert-0 group-hover/card:opacity-100 transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="glass-card-premium p-16 md:p-24 text-center text-white relative overflow-hidden stagger-item shadow-3xl border-t-4 border-t-accent-500/50 group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-accent-500/20 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase leading-[0.9]">Ready to <br />Transform?</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl mx-auto font-medium text-lg leading-relaxed">Enroll in our programs today and get access to exclusive placement opportunities and career coaching.</p>
                        <Link to="/register" className="px-14 py-6 bg-white text-slate-950 rounded-[35px] font-black text-xl uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-3xl active:scale-95 inline-block">
                            Enter Ecosystem
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Placements;

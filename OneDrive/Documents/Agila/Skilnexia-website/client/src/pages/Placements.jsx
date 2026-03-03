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
    { name: 'IBM', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' },
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
        <div className="bg-slate-50 text-slate-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16 stagger-item">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Placement <span className="text-primary-600">Statistics</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Our career transition programs do not just stop at education. We provide an end-to-end recruitment bridge to the world's most innovative companies.
                    </p>
                </div>

                {/* Stat Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 stagger-item">
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-t-4 border-t-primary-500 hover:-translate-y-2">
                        <div className="p-4 bg-primary-50 text-primary-600 rounded-full mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-2">98%</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Placement Rate</p>
                    </div>
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-t-4 border-t-accent-500 hover:-translate-y-2">
                        <div className="p-4 bg-accent-50 text-accent-600 rounded-full mb-4">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-2">₹12 LPA</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Average Salary</p>
                    </div>
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-t-4 border-t-emerald-500 hover:-translate-y-2">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                            <Building2 size={32} />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-2">500+</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hiring Partners</p>
                    </div>
                    <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-t-4 border-t-blue-500 hover:-translate-y-2">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
                            <Award size={32} />
                        </div>
                        <h3 className="text-4xl font-extrabold text-slate-900 mb-2">₹42 LPA</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Highest CTC</p>
                    </div>
                </div>

                {/* Hiring Partners Marquee */}
                <div className="mb-20 stagger-item overflow-hidden relative">
                    <h2 className="section-title text-center mb-10">Our Top Recruiters</h2>

                    {/* Fades for smooth edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                    <div className="relative group overflow-hidden">
                        <div className="flex w-max gap-20 animate-scroll-left hover:[animation-play-state:paused] items-center py-6 pr-20">
                            {[...PARTNER_COMPANIES, ...PARTNER_COMPANIES].map((company, i) => (
                                <div key={i} className="shrink-0 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100 hover:scale-110">
                                    <img src={company.logo} alt={company.name} className="h-12 md:h-16 w-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-primary-900 rounded-3xl p-12 text-center text-white relative overflow-hidden stagger-item shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-accent-500 to-transparent rounded-full mix-blend-screen opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                    <h2 className="text-3xl font-extrabold mb-4 relative z-10">Ready to transform your career?</h2>
                    <p className="text-primary-200 mb-8 max-w-2xl mx-auto relative z-10">Enroll in our programs today and get access to exclusive placement opportunities and career coaching.</p>
                    <Link to="/register" className="btn-primary bg-white text-primary-900 hover:bg-slate-100 relative z-10 inline-block px-8 py-4">
                        Explore Programs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Placements;

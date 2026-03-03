import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Github, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.footer-reveal').forEach((elem) => {
                gsap.from(elem, {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 95%',
                    }
                });
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <footer className="bg-slate-950 border-t border-white/5 text-slate-400 pt-24 pb-12 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8 footer-reveal">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all duration-500">
                                <span className="text-slate-950 font-black text-2xl">S</span>
                            </div>
                            <span className="text-3xl font-black tracking-tighter text-white uppercase">
                                Skil<span className="text-accent-500">nexia</span>
                            </span>
                        </Link>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            The world's premier EdTech ecosystem for industry-ready evolution. We bridge the gap between ambition and enterprise mastery at global scale.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Programs Links - Enhanced with Micro-animations */}
                    <div className="footer-reveal">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Elite Roadmaps</h4>
                        <ul className="space-y-6">
                            {[
                                'Full Stack Web Dev',
                                'Data Science & AI',
                                'Cloud Architecture',
                                'Cyber Security Ops',
                                'UI/UX Design Strategy'
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link to="/courses" className="text-slate-400 hover:text-accent-500 transition-all font-bold text-sm flex items-center gap-2 group">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-500" />
                                        <span className="relative pb-1">
                                            {item}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-500 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Support - Enhanced with Micro-animations */}
                    <div className="footer-reveal">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Ecosystem</h4>
                        <ul className="space-y-6">
                            {[
                                { name: 'About Our Vision', path: '/about' },
                                { name: 'Placement Analytics', path: '/placements' },
                                { name: 'Enterprise Solutions', path: '/contact' },
                                { name: 'Student Portal', path: '/login' },
                                { name: 'Join The Movement', path: '/register' }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link to={item.path} className="text-slate-400 hover:text-white transition-all font-bold text-sm flex items-center gap-2 group">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary-500" />
                                        <span className="relative pb-1">
                                            {item.name}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-reveal">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Global HQ</h4>
                        <ul className="space-y-8">
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-500 group-hover:scale-110 transition-transform">
                                    <MapPin size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Innovation Hub</p>
                                    <p className="text-sm text-slate-300 font-bold leading-relaxed">123 Tech Avenue, <br />Silicon Valley, CA 94025</p>
                                </div>
                            </li>
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Phone size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Callback Support</p>
                                    <p className="text-sm text-slate-300 font-bold tracking-tight">+1 (555) 000-1111</p>
                                </div>
                            </li>
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                                    <Mail size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Admissions</p>
                                    <p className="text-sm text-slate-300 font-bold tracking-tight">evolve@skilnexia.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em]">
                            &copy; {new Date().getFullYear()} <span className="text-white">Skilnexia Global Ltd.</span> All rights reserved.
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Developed by <a href="https://forgeindiaconnect.com" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:text-white transition-colors">FIC Team</a>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-widest text-white">
                        <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy & Data Ethics</Link>
                        <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">User Experience Agreement</Link>
                        <Link to="/compliance" className="text-slate-400 hover:text-white transition-colors">ISO & Global Compliance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

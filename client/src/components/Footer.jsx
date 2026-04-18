import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ChevronRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-white/5 text-slate-400 pt-24 pb-12 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src="/images/logo.png"
                                alt="Skilnexia Logo"
                                className="h-12 w-auto object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
                            />
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

                    {/* Programs Links */}
                    <div>
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
                                    <Link to="/courses" className="text-slate-400 hover:text-blue-400 transition-all font-bold text-sm flex items-center gap-2 group">
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                                        <span className="relative pb-1">
                                            {item}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ecosystem Links */}
                    <div>
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
                                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-200" />
                                        <span className="relative pb-1">
                                            {item.name}
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-slate-200 transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-10">Global HQ</h4>
                        <ul className="space-y-8">
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <MapPin size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global HQ</p>
                                    <p className="text-sm text-slate-300 font-bold leading-relaxed">22, VVM Towers, 3rd Floor, <br />Pattullos Rd, Anna Salai,<br />Royapettah, Chennai,<br />Tamil Nadu 600002</p>
                                </div>
                            </li>
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Phone size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Callback Support</p>
                                    <p className="text-sm text-slate-300 font-bold tracking-tight">+91 93422 34028</p>
                                </div>
                            </li>
                            <li className="flex gap-5 group">
                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <Mail size={22} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Admissions</p>
                                    <p className="text-sm text-slate-300 font-bold tracking-tight">skilnexia@gmail.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-slate-300 text-[11px] font-black uppercase tracking-[0.1em]">
                            &copy; {new Date().getFullYear()} <span className="text-white">Skilnexia Global Ltd.</span> All rights reserved.
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                            Developed by{' '}
                            <a
                                href="https://forgeindiaconnect.com"
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400 hover:text-white transition-colors"
                            >
                                FIC Tech team
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-10 gap-y-4 text-[10px] font-black uppercase tracking-widest">
                        <Link to="/privacy" className="relative group overflow-hidden px-4 py-2 rounded-lg text-emerald-400 border border-emerald-400/20 hover:text-white transition-colors duration-500">
                            <span className="relative z-10">Privacy &amp; Data Ethics</span>
                            <span className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                        </Link>
                        <Link to="/terms" className="relative group overflow-hidden px-4 py-2 rounded-lg text-amber-400 border border-amber-400/20 hover:text-white transition-colors duration-500">
                            <span className="relative z-10">User Experience Agreement</span>
                            <span className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                        </Link>
                        <Link to="/compliance" className="relative group overflow-hidden px-4 py-2 rounded-lg text-blue-400 border border-blue-400/20 hover:text-white transition-colors duration-500">
                            <span className="relative z-10">ISO &amp; Global Compliance</span>
                            <span className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, Code, Database, Cpu, Globe, Shield, Zap, Search, ArrowRight, LayoutDashboard } from 'lucide-react';
import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCoursesMenu, setShowCoursesMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Group categories for Mega Menu
    const categories = Array.from(new Set(COURSE_CATEGORIES.map(c => c.category))).slice(0, 6);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const ctx = gsap.context(() => {
            // Brand reveal
            gsap.set(['.nav-brand-reveal', '.nav-link-item', '.nav-auth-reveal'], { opacity: 0 });

            gsap.to('.nav-brand-reveal', {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out'
            });

            // Nav links stagger
            gsap.to('.nav-link-item', {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.2
            });

            // Auth buttons reveal
            gsap.to('.nav-auth-reveal', {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.4
            });
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            ctx.revert();
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Programs', path: '/programs' },
        { name: 'About Us', path: '/about' },
        { name: 'Placements', path: '/placements' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className="fixed top-0 w-full z-[100] bg-white border-b border-slate-100 shadow-sm py-4"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">

                    {/* Brand/Logo - Image Update */}
                    <Link to="/" className="flex items-center gap-3 group nav-brand-reveal">
                        <img 
                            src="/images/logo.png" 
                            alt="Skilnexia Logo" 
                            className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`nav-link-item text-[12px] font-black uppercase tracking-widest transition-all duration-300 relative group py-2 ${isActive(link.path)
                                    ? 'text-primary-600'
                                    : 'text-slate-500 hover:text-primary-600'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-full h-1 bg-accent-500 rounded-full transition-transform duration-500 origin-left ${isActive(link.path) ? 'scale-x-100 opacity-100' : 'scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100'
                                    }`}></span>
                            </Link>
                        ))}

                        {/* Mega Menu Link (Moved here from the left) */}
                        <div
                            className="relative group py-2"
                            onMouseEnter={() => setShowCoursesMenu(true)}
                            onMouseLeave={() => setShowCoursesMenu(false)}
                        >
                            <button className={`flex items-center gap-1.5 text-[13px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive('/courses') ? 'text-primary-900' : 'text-slate-500 hover:text-slate-950'}`}>
                                Explore Maps <ChevronDown size={14} className={`transition-transform duration-500 ${showCoursesMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Menu Dropdown - Glassmorphism Refined */}
                            <div className={`absolute top-full right-0 w-[850px] bg-white rounded-[40px] shadow-3xl border border-slate-100 p-10 transition-all duration-500 origin-top overflow-hidden ${showCoursesMenu ? 'opacity-100 scale-100 pointer-events-auto mt-0 pt-10' : 'opacity-0 scale-95 pointer-events-none mt-2'}`}>
                                <div className="absolute top-0 left-0 w-full h-8 bg-transparent -translate-y-full"></div> {/* Bridge to prevent premature closing */}
                                <div className="grid grid-cols-12 gap-10">
                                    <div className="col-span-4 border-r border-slate-50 pr-10">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                                            <Search size={14} /> Domain Filters
                                        </h3>
                                        <div className="space-y-2">
                                            {categories.map(cat => (
                                                <Link
                                                    key={cat}
                                                    to={`/courses?category=${cat}`}
                                                    onClick={() => setShowCoursesMenu(false)}
                                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 text-slate-600 font-black text-xs transition-all uppercase tracking-tight group/item"
                                                >
                                                    {cat} <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-primary-600" />
                                                </Link>
                                            ))}
                                            <Link to="/courses" onClick={() => setShowCoursesMenu(false)} className="flex items-center text-primary-900 font-black text-[11px] uppercase tracking-widest p-5 hover:underline gap-2 group/all">
                                                All Roadmaps <ChevronDown size={14} className="-rotate-90 group-hover/all:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="col-span-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Premium Tracks</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            {COURSE_CATEGORIES.slice(0, 4).map(course => (
                                                <Link key={course.id} to={`/courses/${course.id}`} onClick={() => setShowCoursesMenu(false)} className="group/card flex items-start gap-5 p-5 rounded-[30px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0 border border-slate-50 group-hover/card:scale-110 group-hover/card:bg-slate-950 group-hover/card:text-white transition-all duration-500">
                                                        {course.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-[13px] mb-1.5 leading-tight group-hover/card:text-primary-900 uppercase tracking-tight">{course.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{course.duration}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Auth Actions */}
                    <div className="hidden lg:flex items-center gap-6 nav-auth-reveal">
                        {user ? (
                            <Link
                                to={`/${user.role === 'admin' ? 'admin' : user.role === 'trainer' ? 'trainer' : user.role === 'hr' ? 'hr' : 'student'}`}
                                className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-primary-900 transition-all shadow-xl active:scale-95"
                            >
                                Dashboard <LayoutDashboard size={14} className="group-hover:scale-110 transition-transform" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-[13px] font-black uppercase tracking-tighter text-slate-500 hover:text-slate-950 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-8 py-4 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 group hover:bg-primary-900 transition-all shadow-xl active:scale-95"
                                >
                                    Join Free <Zap size={14} className="fill-white group-hover:scale-125 transition-transform" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-3 text-slate-900 bg-slate-50 rounded-2xl transition-all hover:bg-slate-100"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Sidebar/Menu - Refined */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl lg:hidden h-screen w-screen z-[110]"
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                    <div className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-3xl lg:hidden flex flex-col p-10 animate-slide-in-right overflow-y-auto z-[120] rounded-l-[50px]">
                        <div className="flex items-center justify-between mb-12">
                            <span className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-slate-50 rounded-2xl transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mb-12">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2">Navigation</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-2xl font-black p-4 rounded-[25px] transition-all uppercase tracking-tighter ${isActive(link.path) ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/courses"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-2xl font-black p-4 rounded-[25px] transition-all uppercase tracking-tighter ${isActive('/courses') ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                All Maps
                            </Link>
                        </div>

                        <div className="mt-auto space-y-4">
                            {user ? (
                                <Link
                                    to={`/${user.role === 'admin' ? 'admin' : user.role === 'trainer' ? 'trainer' : user.role === 'hr' ? 'hr' : 'student'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-6 text-center text-white bg-slate-950 font-black uppercase tracking-widest rounded-[28px] shadow-3xl hover:bg-primary-900 transition-all flex items-center justify-center gap-2"
                                >
                                    Dashboard <LayoutDashboard size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-5 text-center text-slate-950 font-black uppercase tracking-widest border-2 border-slate-100 rounded-[28px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        Secure Login <ChevronDown size={16} className="-rotate-90" />
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-6 text-center text-white bg-slate-950 font-black uppercase tracking-widest rounded-[28px] shadow-3xl hover:bg-primary-900 transition-all"
                                    >
                                        Join Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;

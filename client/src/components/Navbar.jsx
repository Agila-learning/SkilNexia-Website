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
            className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
                isScrolled 
                ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3' 
                : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">

                    {/* Brand/Logo - Circular Update */}
                    <Link to="/" className="flex items-center gap-3 group nav-brand-reveal perspective-1000">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 logo-circle bg-white p-2">
                            <img 
                                id="navbar-logo"
                                src="/images/logo.png" 
                                alt="Skilnexia Logo" 
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <span className="text-xl lg:text-2xl font-poppins font-bold tracking-tighter text-white">
                            Skil<span className="text-blue-500">Nexia</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-10">
                        {/* Nav Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[13px] font-semibold tracking-wide transition-all duration-300 relative group py-2 ${
                                    isActive(link.path) ? 'text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500 rounded-full transition-transform duration-500 origin-left ${
                                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                }`}></span>
                            </Link>
                        ))}

                        {/* Dropdown for Categories */}
                        <div
                            className="relative group py-2"
                            onMouseEnter={() => setShowCoursesMenu(true)}
                            onMouseLeave={() => setShowCoursesMenu(false)}
                        >
                            <button className={`flex items-center gap-1.5 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                                isActive('/courses') ? 'text-white' : 'text-slate-400 hover:text-white'
                            }`}>
                                Categories <ChevronDown size={14} className={`transition-transform duration-500 ${showCoursesMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Refined Dropdown */}
                            <div className={`absolute top-full left-0 w-[600px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 transition-all duration-500 origin-top overflow-hidden mt-2 ${
                                showCoursesMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                            }`}>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Top Domains</h3>
                                        <div className="space-y-1">
                                            {categories.map(cat => (
                                                <Link
                                                    key={cat}
                                                    to={`/courses?category=${cat}`}
                                                    onClick={() => setShowCoursesMenu(false)}
                                                    className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 text-sm font-medium transition-all group/item"
                                                >
                                                    {cat} <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-blue-500" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Featured</h3>
                                        <div className="space-y-4">
                                            {COURSE_CATEGORIES.slice(0, 2).map(course => (
                                                <Link key={course.id} to={`/courses/${course.id}`} onClick={() => setShowCoursesMenu(false)} className="group/card block">
                                                    <p className="font-bold text-white text-sm mb-1 group-hover/card:text-blue-400 transition-colors">{course.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{course.duration} course</p>
                                                </Link>
                                            ))}
                                            <Link to="/courses" onClick={() => setShowCoursesMenu(false)} className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                                                Explore All <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Auth Actions */}
                    <div className="hidden lg:flex items-center gap-4 nav-auth-reveal">
                        {user ? (
                            <Link
                                to={`/${user.role === 'admin' ? 'admin' : user.role === 'trainer' ? 'trainer' : user.role === 'hr' ? 'hr' : 'student'}`}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all shadow-lg active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-white bg-white/10 rounded-xl transition-all hover:bg-white/20"
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
                            <span className="text-lg font-black text-slate-950 tracking-tighter uppercase">Menu</span>
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
                                    className={`text-base font-black p-4 rounded-[25px] transition-all uppercase tracking-tighter ${isActive(link.path) ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/courses"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-base font-black p-4 rounded-[25px] transition-all uppercase tracking-tighter ${isActive('/courses') ? 'bg-slate-950 text-white shadow-2xl' : 'text-slate-600 hover:bg-slate-50'
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

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Search, Filter, BookOpen, Clock, Target, Briefcase, ChevronRight, Star, ArrowRight, Zap, Award } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';
import { COURSE_CATEGORIES } from '../data/coursesData.jsx';
import RegistrationPopup from '../components/RegistrationPopup.jsx';
import ConsultationModal from '../components/ConsultationModal.jsx';

const Courses = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';

    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isExpertOpen, setIsExpertOpen] = useState(false);

    const [coursesList, setCoursesList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (loading) return;
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            // Hero Reveal
            gsap.fromTo('.courses-hero-content',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out'
                }
            );

            // Section reveals
            gsap.utils.toArray('.reveal-up').forEach((elem) => {
                gsap.fromTo(elem,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: elem,
                            start: 'top 92%',
                        }
                    }
                );
            });

            gsap.utils.toArray('.course-card').forEach(el => {
                gsap.fromTo(el,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 95%'
                        }
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [activeCategory, viewMode, loading]);

    const categories = ['All', ...new Set(coursesList.map(c => c.category).filter(Boolean))];

    const filtered = coursesList.filter(c => {
        const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const matchesCat = activeCategory === 'All' || c.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    // Grouping logic for section-wise display
    const groupedCourses = activeCategory === 'All'
        ? categories.filter(cat => cat !== 'All').map(cat => ({
            category: cat,
            courses: filtered.filter(course => course.category === cat)
        })).filter(group => group.courses.length > 0)
        : [{ category: activeCategory, courses: filtered }];

    return (
        <div className="bg-[#fcfdfe] min-h-screen pt-32 pb-24 font-sans text-slate-900 overflow-x-hidden">
            <RegistrationPopup isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
            <ConsultationModal isOpen={isExpertOpen} onClose={() => setIsExpertOpen(false)} />

            <section className="max-w-7xl mx-auto px-4 mb-20">
                <div className="relative rounded-[40px] bg-slate-950 overflow-hidden p-10 md:p-24 text-white shadow-2xl shadow-slate-900/40">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/10 to-transparent"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-500/5 blur-[120px] rounded-full"></div>

                    <div className="relative z-10 max-w-3xl courses-hero-content">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-accent-500 mb-8">
                            <Zap size={14} className="animate-pulse" /> Accelerated Learning Paths
                        </div>
                        <h1 className="font-black uppercase tracking-tighter leading-[1.1] text-4xl md:text-7xl text-white mb-8">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-accent-400">Premium Roadmap</span> to Tech Excellence</h1>
                        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                            Unlock expert-led programs designed for the modern enterprise. No distractions—just pure skill building for career transformation.
                        </p>
                    </div>
                </div>
            </section>
            {/* 2. Premium Control Bar */}
            <section className="max-w-7xl mx-auto px-4 mb-16 relative z-30">
                <div className="bg-white/70 backdrop-blur-xl border border-white p-6 rounded-[40px] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-8 items-center justify-between">
                    
                    {/* Category Filter - Glassmorphism Aesthetic */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${
                                    activeCategory === cat 
                                    ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/10' 
                                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Layout Actions */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:w-[450px] group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Search className="text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                <div className="w-px h-4 bg-slate-200"></div>
                            </div>
                            <input
                                type="text"
                                placeholder="Search your ideal roadmap..."
                                className="w-full pl-16 pr-6 py-5 rounded-[28px] bg-slate-100/50 border-2 border-transparent focus:border-primary-500/10 focus:bg-white focus:outline-none font-bold transition-all text-sm placeholder:text-slate-400 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        
                        <div className="flex items-center p-1.5 bg-slate-100/50 rounded-2xl border border-transparent">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400'}`}
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')} 
                                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400'}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Section-Wise Course Display */}
            <section className="max-w-7xl mx-auto px-4 space-y-24">
                {groupedCourses.length > 0 ? (
                    groupedCourses.map((group, gIdx) => (
                        <div key={group.category} className="course-section space-y-10 reveal-up">
                            <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                                <div className="space-y-2">
                                    <h2 className="premium-title text-3xl flex items-center gap-3">
                                        <div className="w-2 h-10 bg-accent-500 rounded-full"></div>
                                        {group.category}
                                    </h2>
                                    <p className="text-slate-500 font-medium text-sm">Industry-vetted programs for {group.category}</p>
                                </div>
                            </div>

                            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" : "space-y-8"}>
                                {group.courses.map(course => (
                                    <div key={course._id} className={`course-card group relative transition-all duration-500 opacity-100 ${viewMode === 'grid' ? 'bg-white rounded-[40px] border-2 border-slate-200 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 flex flex-col' : 'flex bg-white rounded-[40px] border-2 border-slate-200 p-6 items-center gap-8 hover:shadow-2xl hover:border-primary-200 opacity-100'}`}>

                                        <div className={`relative overflow-hidden shrink-0 bg-slate-900 ${viewMode === 'grid' ? 'h-64' : 'w-80 h-48 rounded-3xl'}`}>
                                            <img
                                                src={course.thumbnail || course.banner || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-transparent"></div>
                                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute top-5 left-5 px-4 py-2 bg-slate-900 border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                                                {course.category}
                                            </div>
                                            {viewMode === 'list' && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                                        <PlayCircle size={32} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`flex flex-col flex-grow ${viewMode === 'grid' ? 'p-8 md:p-10' : 'pr-8'}`}>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex gap-0.5 text-accent-500">
                                                    <Star size={14} fill="currentColor" />
                                                    <Star size={14} fill="currentColor" />
                                                    <Star size={14} fill="currentColor" />
                                                    <Star size={14} fill="currentColor" />
                                                    <Star size={14} fill="currentColor" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-200 px-3 py-1 rounded-full">Industry Standard</span>
                                            </div>

                                            <h3 className="premium-title text-xl md:text-2xl mb-6">
                                                {course.title}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-primary-50/50">
                                                    <Clock size={18} className="text-accent-500" />
                                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{course.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 transition-colors group-hover:bg-primary-50/50">
                                                    <Award size={18} className="text-primary-500" />
                                                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Cert.</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                                                <Link to={`/courses/${course._id}`} className="px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                                                    Roadmap
                                                </Link>
                                                <button onClick={() => setIsRegisterOpen(true)} className="flex-grow px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-900 transition-all shadow-xl shadow-slate-950/10 flex items-center justify-center gap-3 active:scale-95 group/btn">
                                                    Start Learning <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 text-center bg-white rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden px-8">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-600 to-accent-500"></div>
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Search size={48} className="text-slate-200" />
                        </div>
                        <h3 className="premium-title text-4xl mb-4">Roadmap Not Found</h3>
                        <p className="text-slate-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">We couldn't find any courses matching "{searchTerm}". Try exploring other premium categories.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="btn-primary px-12 py-5 shadow-2xl uppercase tracking-widest"
                        >
                            Explore All Roadmaps
                        </button>
                    </div>
                )}
            </section>

            {/* 4. Support Footer Section */}
            <section className="max-w-7xl mx-auto px-4 mt-32">
                <div className="bg-slate-950 rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center text-white">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/10 group hover:rotate-12 transition-all">
                            <BookOpen size={40} className="text-accent-500" />
                        </div>
                        <h2 className="premium-title text-4xl md:text-7xl">Need a Personalized <span className="text-accent-500">Learning Strategy?</span></h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            Talk to our industry experts and let us help you choose the right path for your career goals.
                            100% Mentorship. 100% Results.
                        </p>
                        <div className="pt-8 flex flex-wrap justify-center gap-6">
                            <button onClick={() => setIsExpertOpen(true)} className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                Speak to Expert
                            </button>
                            <Link to="/contact" className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Courses;

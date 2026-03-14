import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Send, Phone, Mail, User, BookOpen, MessageSquare } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';

const ConsultationModal = ({ isOpen, onClose, defaultCourseId = '' }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        courseId: defaultCourseId,
        message: ''
    });

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setLoading(false);
            setFormData(prev => ({ ...prev, courseId: defaultCourseId }));

            gsap.fromTo('.modal-overlay', { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo('.modal-content',
                { x: '100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
            );

            // Fetch courses for dropdown
            const fetchCourses = async () => {
                try {
                    const res = await api.get('/courses');
                    setCourses(res.data);
                    if (!defaultCourseId && res.data.length > 0) {
                        setFormData(prev => ({ ...prev, courseId: res.data[0]._id }));
                    }
                } catch (err) {
                    console.error("Failed to fetch courses:", err);
                }
            };
            fetchCourses();
        }
    }, [isOpen, defaultCourseId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/leads', formData);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Failed to submit lead", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="modal-overlay absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="modal-content relative w-full max-w-4xl bg-white rounded-[40px] shadow-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                {/* Left Side: Branding/Visual */}
                <div className="hidden md:flex md:w-5/12 bg-slate-950 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-2xl">
                            <span className="text-slate-950 font-black text-xl">S</span>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-4">Unlock Your <span className="text-accent-500">Peak Performance</span> Roadmap.</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">Join 5,000+ professionals who transformed their careers with Skilnexia Expert Mentorship.</p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-500"><CheckCircle size={20} /></div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">1-on-1 Strategy Call</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400"><CheckCircle size={20} /></div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Industry Vetted Path</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="flex-grow p-8 md:p-14 overflow-y-auto">
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-xl z-20">
                        <X size={20} />
                    </button>

                    {!isSubmitted ? (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Talk to Expert</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Get your personalized learning plan</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                        <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="John Doe" className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/10 focus:bg-white focus:outline-none font-bold transition-all text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                        <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@company.com" className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/10 focus:bg-white focus:outline-none font-bold transition-all text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Course of Interest</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
                                        <select required name="courseId" value={formData.courseId} onChange={handleChange} className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/10 focus:bg-white focus:outline-none font-black text-slate-700 uppercase tracking-tight appearance-none cursor-pointer text-xs">
                                            <option value="" disabled>Select a roadmap</option>
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id}>{course.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full py-4.5 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-900 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-50">
                                    {loading ? 'Processing...' : 'Request Strategy Call'} <Send size={16} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 rotate-12">
                                <CheckCircle size={36} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Request Received!</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
                                    Our mentor will reach out to you within 24 hours.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;

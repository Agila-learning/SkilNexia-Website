import React, { useEffect, useState } from 'react';
import { X, CheckCircle, Send, Phone, Mail, User, BookOpen } from 'lucide-react';
import gsap from 'gsap';

const ConsultationModal = ({ isOpen, onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            gsap.fromTo('.modal-overlay', { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo('.modal-content',
                { x: '100%', opacity: 0 },
                { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
            );
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would typically send data to backend
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-[150] flex justify-end">
            <div className="modal-overlay absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>

            <div className="modal-content relative w-full h-full max-w-md bg-white shadow-3xl overflow-y-auto translate-x-full opacity-1">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-xl z-10">
                    <X size={24} />
                </button>

                <div className="p-10 md:p-14">
                    {!isSubmitted ? (
                        <>
                            <div className="mb-10 text-center">
                                <div className="w-20 h-20 bg-primary-50 text-primary-900 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                                    <Phone size={36} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Speak to an Expert</h3>
                                <p className="text-slate-500 font-medium">Get a personalized learning callback within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                        <input required type="text" placeholder="John Doe" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                            <input required type="email" placeholder="john@company.com" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                                            <input required type="tel" placeholder="+91 987..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Course Interested In</label>
                                    <div className="relative group">
                                        <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                        <select className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all appearance-none cursor-pointer">
                                            <option>Full Stack Web Development</option>
                                            <option>Data Science & AI</option>
                                            <option>Cyber Security</option>
                                            <option>Cloud Computing (AWS)</option>
                                            <option>UI/UX Design</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-lg hover:bg-primary-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest mt-8">
                                    Submit Request <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                                <CheckCircle size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Request Received!</h3>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                                    Our career expert will contact you shortly to discuss your <span className="text-primary-900">Education Evolution</span>.
                                </p>
                            </div>
                            <div className="pt-4">
                                <button onClick={onClose} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    Close Window
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;

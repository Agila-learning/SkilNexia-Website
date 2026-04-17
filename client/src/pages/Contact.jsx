import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, BookOpen, ChevronRight, User, MessageSquare, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
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
                            start: 'top 95%',
                        }
                    }
                );
            });

            // Contact cards stagger
            gsap.utils.toArray('.contact-card').forEach(el => {
                gsap.fromTo(el,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
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
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setTimeout(() => {
            setStatus('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="bg-slate-950 min-h-screen text-white animate-fade-in flex flex-col pt-24 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="flex-grow max-w-7xl mx-auto px-6 py-20 w-full relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    <div className="lg:col-span-3 text-center mb-12 reveal-up">
                        <span className="section-subtitle">Reach Out</span>
                        <h1 className="section-title">Get in <span className="text-brand-gradient">Touch</span></h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Have questions about our premium programs? Our admissions team is ready to guide your career transition.</p>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8 contact-cards-container">
                        <div className="glass-card-premium p-10 contact-card group">
                            <h3 className="text-2xl font-black text-white mb-10 border-b border-white/10 pb-6 uppercase tracking-tight">Direct Access</h3>
                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover/item:scale-110 transition-transform shadow-xl">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Admissions</h4>
                                        <a href="mailto:skilnexia@gmail.com" className="text-slate-300 hover:text-white transition-colors font-bold">skilnexia@gmail.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform shadow-xl">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Call Us (Toll Free)</h4>
                                        <a href="tel:9342234028" className="text-slate-300 hover:text-white transition-colors font-bold">+91 93422 34028</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-accent-400 group-hover/item:scale-110 transition-transform shadow-xl">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Headquarters</h4>
                                        <p className="text-slate-300 font-bold leading-relaxed">22, VVM Towers, 3rd Floor, <br />Anna Salai, Chennai, TN</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Interactive map placeholder */}
                        <div className="h-72 rounded-[40px] bg-slate-900 w-full overflow-hidden border border-white/10 contact-card shadow-2xl">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.63464522436!2d80.260485975078!3d13.058897087264846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266228303d27f%3A0xe54c1be9f9393e50!2sVVM%20Towers!5e0!3m2!1sen!2sin!4v1710328000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office Location"
                            ></iframe>
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 reveal-up">
                        <div className="glass-card-premium p-8 md:p-16 border-t-4 border-t-blue-500/50">
                            <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Send us a Message</h3>
                            <p className="text-slate-400 mb-12 font-medium">Fill out the form below and we'll get back to you within 24 hours.</p>

                            {status && (
                                <div className={`p-5 rounded-2xl mb-8 text-sm font-bold backdrop-blur-md ${status.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                    {status}
                                </div>
                            )}

                            <form id="contact-form" onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="form-group-premium">
                                        <label className="label-premium">Your Name</label>
                                        <User className="form-icon-premium" size={20} />
                                        <input
                                            type="text"
                                            required
                                            className="input-premium input-with-icon"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group-premium">
                                        <label className="label-premium">Email Address</label>
                                        <Mail className="form-icon-premium" size={20} />
                                        <input
                                            type="email"
                                            required
                                            className="input-premium input-with-icon"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group-premium">
                                    <label className="label-premium">Subject</label>
                                    <Tag className="form-icon-premium" size={20} />
                                    <select
                                        className="input-premium input-with-icon appearance-none cursor-pointer"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled className="bg-slate-900 text-slate-500">Select a subject...</option>
                                        <option value="Enrollment Inquiry" className="bg-slate-900 text-white">Enrollment & Admissions</option>
                                        <option value="Corporate Training" className="bg-slate-900 text-white">Corporate / Enterprise Training</option>
                                        <option value="Placement Support" className="bg-slate-900 text-white">Placement Support</option>
                                        <option value="Other" className="bg-slate-900 text-white">Other Query</option>
                                    </select>
                                </div>
                                <div className="form-group-premium">
                                    <label className="label-premium">Message</label>
                                    <MessageSquare className="absolute left-5 top-12 text-slate-500" size={20} />
                                    <textarea
                                        required
                                        rows="6"
                                        className="input-premium input-with-icon resize-none"
                                        placeholder="How can we help you achieve your career goals?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">
                                        {status.includes('Sending') ? 'Processing...' : 'Submit Inquiry'} <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

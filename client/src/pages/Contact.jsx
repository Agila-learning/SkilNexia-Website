import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, BookOpen, ChevronRight } from 'lucide-react';
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
        <div className="bg-slate-50 min-h-screen text-slate-900 animate-fade-in flex flex-col">
            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-3 text-center mb-8 reveal-up">
                        <h1 className="section-title text-5xl">Get in Touch</h1>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Have questions about our premium programs? Our admissions team is ready to guide your career transition.</p>
                    </div>

                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8 contact-cards-container">
                        <div className="glass-card hover:-translate-y-1 contact-card">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Reach us directly</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm border border-primary-100">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Email Admissions</h4>
                                        <a href="mailto:skilnexia@gmail.com" className="text-slate-600 hover:text-primary-600 transition-colors">skilnexia@gmail.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center text-accent-600 flex-shrink-0 shadow-sm border border-accent-100">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Call Us (Toll Free)</h4>
                                        <a href="tel:9342234028" className="text-slate-600 hover:text-accent-600 transition-colors">+91 93422 34028</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm border border-emerald-100">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Headquarters</h4>
                                        <p className="text-slate-600">22, VVM Towers, 3rd Floor, <br />Pattullos Rd, Anna Salai,<br />Royapettah, Chennai,<br />Tamil Nadu 600002</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Interactive map placeholder */}
                        <div className="h-64 rounded-2xl bg-slate-200 w-full overflow-hidden border border-slate-200 contact-card">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.63464522436!2d80.260485975078!3d13.058897087264846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266228303d27f%3A0xe54c1be9f9393e50!2sVVM%20Towers!5e0!3m2!1sen!2sin!4v1710328000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office Location"
                            ></iframe>
                        </div>

                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 reveal-up">
                        <div className="glass-card sm:p-10">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">Send us a Message</h3>
                            <p className="text-slate-500 mb-8">Fill out the form below and we'll get back to you within 24 hours.</p>

                            {status && (
                                <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${status.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-primary-50 text-primary-700 border border-primary-200'}`}>
                                    {status}
                                </div>
                            )}

                            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="input-field"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                    <select
                                        className="input-field appearance-none cursor-pointer"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Select a subject...</option>
                                        <option value="Enrollment Inquiry">Enrollment & Admissions</option>
                                        <option value="Corporate Training">Corporate / Enterprise Training</option>
                                        <option value="Placement Support">Placement Support</option>
                                        <option value="Other">Other Query</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows="6"
                                        className="input-field resize-none"
                                        placeholder="How can we help you achieve your career goals?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full sm:w-auto px-10 py-4 flex items-center justify-center gap-2 text-lg">
                                        <Send size={20} /> Submit Inquiry
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

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, ArrowRight, Shield, Rocket, User, Mail, Phone, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import api from '../services/api';

const RegistrationPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.popup-overlay', { opacity: 0 }, { opacity: 1, duration: 0.4 });
                gsap.fromTo('.popup-content',
                    { x: '100%', opacity: 0 },
                    { x: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
                );
            });
            return () => ctx.revert();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!formData.name || !formData.email) {
                setError('Please fill in discovery fields');
                return;
            }
            setStep(2);
            return;
        }

        if (!formData.phone || !formData.password) {
            setError('Please complete all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone // Ensure backend handles phone if needed, otherwise skip
            });

            // If backend doesn't handle phone in User model, we might want to update it later 
            // or just rely on the existing register logic. 
            // The User model I saw earlier didn't have phone, but Lead did.

            localStorage.setItem('userInfo', JSON.stringify(res.data));
            onClose();
            navigate('/student-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="popup-overlay absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="popup-content relative w-full h-full max-w-2xl bg-white shadow-3xl overflow-y-auto flex flex-col md:flex-col opacity-1 translate-x-full">
                {/* Top Side: Branding/Info */}
                <div className="w-full bg-primary-900 p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <Rocket size={24} className="text-primary-900" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase">Skilnexia</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">Your Journey to <span className="text-accent-500">Excellence</span> Starts Here.</h2>
                        <p className="text-primary-200 font-medium mb-10 leading-relaxed">Join 50,000+ professionals transforming their careers with industry-led roadmaps.</p>

                        <div className="space-y-6 text-left">
                            {[
                                "Lifetime LMS Access",
                                "Professional Certification",
                                "1-on-1 Mentorship",
                                "Placement Assistance"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <CheckCircle size={20} className="text-accent-500" />
                                    <span className="font-bold text-sm text-primary-50 tracking-tight">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 pt-10">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <Shield size={24} className="text-accent-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary-200">Secure Enrollment & Data Privacy Protected</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Side: Form */}
                <div className="w-full p-8 md:p-10 bg-white relative flex-grow">
                    <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors p-2 bg-slate-50 rounded-xl">
                        <X size={24} />
                    </button>

                    <div className="max-w-md mx-auto">
                        <div className="mb-10">
                            <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Create Account</h3>
                            <p className="text-slate-500 font-bold text-sm">Step {step} of 2 - {step === 1 ? 'Basic Information' : 'Security Details'}</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 font-bold text-sm border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6 text-left" onSubmit={handleRegister}>
                            {step === 1 ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@company.com"
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-lg hover:bg-primary-900 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest mt-8">
                                        Continue <ArrowRight size={20} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Desired Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary-500/20 focus:bg-white focus:outline-none font-bold transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep(1)} className="flex-grow py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all uppercase tracking-widest mt-8">
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-2/3 py-5 bg-accent-500 text-white rounded-2xl font-black text-lg hover:bg-accent-600 transition-all shadow-xl shadow-accent-500/20 active:scale-95 uppercase tracking-widest mt-8 flex items-center justify-center"
                                        >
                                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Join Now'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>

                        <p className="mt-10 text-center text-xs text-slate-400 font-bold">
                            By clicking "Join Now", you agree to Skilnexia's <br />
                            <span className="text-primary-900 cursor-pointer">Terms of Service</span> and <span className="text-primary-900 cursor-pointer">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPopup;

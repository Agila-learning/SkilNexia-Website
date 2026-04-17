import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, ShieldCheck, Zap, ChevronLeft, Mail, Shield, Rocket } from 'lucide-react';
import gsap from 'gsap';

const AuthPage = ({ initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.auth-card', { opacity: 0, scale: 0.95, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' });
            gsap.fromTo('.auth-image', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
        });
        return () => ctx.revert();
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        let result;
        if (mode === 'login') {
            result = await login(email, password);
        } else {
            result = await register(name, email, password, role);
        }

        if (result.success) {
            if (result.role === 'admin') navigate('/admin');
            else if (result.role === 'trainer') navigate('/trainer');
            else if (result.role === 'hr') navigate('/hr');
            else navigate('/student');
        } else {
            setError(result.message);
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setError('');
        setMode(mode === 'login' ? 'register' : 'login');
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden py-24 md:py-32 relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="auth-card w-full max-w-6xl bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10">

                {/* Close/Back Button */}
                <Link to="/" className="absolute top-8 right-8 z-50 p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all hover:rotate-90">
                    <ChevronLeft size={20} />
                </Link>

                {/* Left Side: Realistic Image & Branding */}
                <div className="auth-image hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden group">
                    <img
                        src={mode === 'login'
                            ? "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
                            : "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[20s] ease-linear"
                        alt="Cybersecurity and Tech"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-slate-950/40 to-accent-600/20"></div>

                    <div className="relative z-10 p-20 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                            <img 
                                src="/images/logo.png" 
                                alt="Skilnexia Logo" 
                                className="w-20 h-auto object-contain"
                            />
                            <h2 className="text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                                {mode === 'login' ? 'Continue Your' : 'Begin Your'} <br />
                                <span className="text-accent-500">Elite Transition.</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
                                {mode === 'login'
                                    ? "Welcome back to the world's premier tech ecosystem. Your roadmap is waiting."
                                    : "Join 50k+ leaders mastering enterprise skills through industry-vetted career paths."}
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=auth${i}`} className="w-12 h-12 rounded-full border-4 border-slate-950" alt="User" />
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-slate-950 bg-accent-500 flex items-center justify-center text-white text-[10px] font-black tracking-tighter shadow-2xl">
                                    50K+
                                </div>
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Verified Professional Community</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full lg:w-1/2 p-10 md:p-20 flex flex-col justify-center bg-slate-900/20 md:backdrop-blur-xl relative">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                <ShieldCheck size={12} className="text-accent-500" /> Secure Node Verification
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                {mode === 'login' ? 'Mission' : 'New'} <br />
                                <span className={mode === 'login' ? 'text-primary-400' : 'text-accent-500'}>
                                    {mode === 'login' ? 'Checkpoint.' : 'Identity.'}
                                </span>
                            </h1>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 text-red-500 p-5 rounded-3xl border border-red-500/20 flex items-center gap-4 animate-bounce-subtle">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <p className="text-xs font-black uppercase tracking-tight">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-slate-950 border-2 border-white/5 focus:border-accent-500/20 text-white outline-none font-bold transition-all shadow-inner"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Evolution Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-slate-950 border-2 border-white/5 focus:border-primary-400/20 text-white outline-none font-bold transition-all shadow-inner"
                                        placeholder="portal@skilnexia.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Key</label>
                                    {mode === 'login' && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-primary-400">Lost Access?</button>}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-slate-950 border-2 border-white/5 focus:border-primary-400/20 text-white outline-none font-bold transition-all shadow-inner"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Account Persona</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                        <select
                                            className="w-full pl-16 pr-10 py-5 rounded-[24px] bg-slate-950 border-2 border-white/5 focus:border-primary-400/20 text-white outline-none font-bold transition-all appearance-none cursor-pointer shadow-inner"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="student" className="bg-slate-900">Student / Learner</option>
                                            <option value="trainer" className="bg-slate-900">Industry Expert</option>
                                            <option value="hr" className="bg-slate-900">Enterprise Partner</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-6 rounded-[28px] font-black text-lg uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 ${mode === 'login' ? 'bg-white text-slate-950 hover:bg-primary-400 hover:text-white' : 'bg-accent-500 text-white hover:bg-white hover:text-slate-950'}`}
                            >
                                {isLoading ? 'Verifying...' : (mode === 'login' ? 'Initiate Node' : 'Complete Setup')}
                                {!isLoading && (mode === 'login' ? <Zap size={20} fill="currentColor" /> : <Rocket size={20} />)}
                            </button>
                        </form>

                        <div className="text-center pt-6">
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">
                                {mode === 'login' ? "New to the elite network?" : "Already part of the evolution?"}
                                <button onClick={toggleMode} className="ml-2 text-primary-400 hover:text-accent-500 transition-colors underline decoration-2 underline-offset-4">
                                    {mode === 'login' ? 'Create New Profile' : 'Sign In To Node'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

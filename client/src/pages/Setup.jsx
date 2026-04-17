import React, { useState } from 'react';
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Setup = () => {
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [accounts, setAccounts] = useState([]);

    const handleSetup = async () => {
        setStatus('loading');
        try {
            const res = await api.get('/auth/setup-accounts');
            if (res.data.success) {
                setStatus('success');
                setMessage(res.data.message);
                setAccounts(res.data.initializedAccounts);
            } else {
                setStatus('error');
                setMessage(res.data.message || 'Setup failed');
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || error.message || 'Connection failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6 pt-32">
                <div className="max-w-xl w-full glass-card-premium p-10 md:p-14 space-y-8 relative overflow-hidden border-t-4 border-t-accent-500/50">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-accent-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                            <Zap className="text-accent-500 transform group-hover:scale-110 transition-transform" size={40} fill="currentColor" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">System <br /><span className="text-accent-500">Bootstrap (V2)</span></h1>
                        <p className="text-slate-400 font-medium">Initialize elite credentials for Admin, HR, and Trainer dashboards.</p>
                    </div>

                    {status === 'idle' && (
                        <button 
                            onClick={handleSetup}
                            className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Start Initialization <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-6 py-4">
                            <div className="w-16 h-16 border-4 border-accent-500/20 border-t-accent-500 rounded-full animate-spin"></div>
                            <p className="text-accent-500 font-black uppercase tracking-widest text-xs">Provisioning Ecosystem...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-500 shrink-0" size={32} />
                                <p className="text-sm font-black text-emerald-400 uppercase tracking-tight">{message}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Initialized Nodes:</h3>
                                <div className="space-y-2">
                                    {accounts.map((acc, i) => (
                                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-300">{acc.email}</span>
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-accent-500">{acc.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <a href="/login" className="w-full py-6 bg-slate-900 border border-white/10 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all text-center block">
                                Go To Dashboards
                            </a>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                                <AlertCircle className="text-red-500 shrink-0" size={32} />
                                <p className="text-sm font-black text-red-400 uppercase tracking-tight">{message}</p>
                            </div>
                            <button 
                                onClick={handleSetup}
                                className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Retry Initialization
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Setup;

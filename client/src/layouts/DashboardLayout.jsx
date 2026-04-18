import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#020617] relative overflow-hidden text-white font-sans selection:bg-accent-500/30">
            {/* Subtle premium glows - Layered for depth */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/3 animate-pulse duration-[10s]"></div>
            <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse duration-[8s]"></div>

            {/* Mobile Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[45] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Fixed Premium Header */}
                <header className="h-20 lg:h-24 border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl flex items-center px-6 lg:px-12 z-20 sticky top-0 justify-between">
                    <div className="flex items-center gap-6">
                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-3.5 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-90 shadow-2xl"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Operational Environment</p>
                            <h2 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter filter drop-shadow-lg">Nexus <span className="text-accent-500">Sigma</span></h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-8">
                            <span className="text-[9px] font-black uppercase text-accent-500 tracking-[0.2em] mb-1">Neural Clock</span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl group cursor-pointer hover:border-accent-500/50 transition-all">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 lg:p-14">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

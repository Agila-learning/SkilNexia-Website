import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-[#020617] relative overflow-hidden text-white font-sans">
            {/* Subtle premium glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden z-10">
                {/* Fixed Premium Header */}
                <header className="h-24 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl flex items-center px-12 z-20 sticky top-0 justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Node</p>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Unified Portal</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-accent-500 tracking-widest">System Time</span>
                            <span className="text-xs font-bold text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area - Refined Spacing */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-10 lg:p-14">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

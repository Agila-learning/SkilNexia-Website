import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatWidget from '../components/ChatWidget';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 relative overflow-hidden">
            {/* Subtle gradient background for dashboards */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 pointer-events-none"></div>

            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden z-10">
                {/* Top Header Placeholder */}
                <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md flex items-center px-8 z-10 sticky top-0 justify-between shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 capitalize">Portal Overview</h2>
                    <div className="flex items-center gap-4">
                        {/* Search / Notifications */}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 pb-20">
                    <Outlet /> {/* Renders nested routes */}
                </main>
            </div>
            <ChatWidget />
        </div>
    );
};

export default DashboardLayout;

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, DollarSign, Settings, Video, MessageSquare, Award, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getLinks = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
                    { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={20} /> },
                    { name: 'Course Materials', path: '/admin/materials', icon: <FileText size={20} /> },
                    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
                    { name: 'Payments', path: '/admin/payments', icon: <DollarSign size={20} /> },
                    { name: 'Certificates', path: '/admin/certificates', icon: <Award size={20} /> },
                    { name: 'Chat Support', path: '/admin/support', icon: <MessageSquare size={20} /> },
                    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
                ];
            case 'trainer':
                return [
                    { name: 'Dashboard', path: '/trainer', icon: <LayoutDashboard size={20} /> },
                    { name: 'My Batches', path: '/trainer/batches', icon: <Users size={20} /> },
                    { name: 'Lectures', path: '/trainer/lectures', icon: <Video size={20} /> },
                    { name: 'Certificates', path: '/trainer/certificates', icon: <Award size={20} /> },
                    { name: 'Support', path: '/trainer/support', icon: <MessageSquare size={20} /> },
                ];
            case 'hr':
                return [
                    { name: 'Portal Overview', path: '/hr', icon: <LayoutDashboard size={20} /> },
                    { name: 'Candidate Referrals', path: '/hr/referrals', icon: <Users size={20} /> },
                    { name: 'Hiring Pipeline', path: '/hr/pipeline', icon: <BookOpen size={20} /> },
                    { name: 'Certificates', path: '/hr/certificates', icon: <Award size={20} /> },
                    { name: 'Chat Support', path: '/hr/support', icon: <MessageSquare size={20} /> },
                ];
            case 'student':
            default:
                return [
                    { name: 'My Learning', path: '/student', icon: <LayoutDashboard size={20} /> },
                    { name: 'Browse Courses', path: '/courses', icon: <BookOpen size={20} /> },
                    { name: 'Payments', path: '/student/payments', icon: <DollarSign size={20} /> },
                ];
        }
    };

    const links = getLinks();

    return (
        <div className="w-72 bg-slate-950 border-r border-white/5 h-screen sticky top-0 flex flex-col items-center py-8 shadow-2xl z-40">
            {/* Logo Section */}
            <div className="mb-12 w-full px-8">
                <Link to="/" className="flex items-center gap-3 group">
                    <img 
                        src="/images/logo.png" 
                        alt="Skilnexia Logo" 
                        className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                    />
                </Link>
            </div>

            {/* Navigation Section */}
            <div className="flex flex-col w-full px-4 gap-1.5 flex-grow font-sans">
                <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Ecosystem Hub</p>
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === `/${user?.role}`}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm group ${isActive
                                ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <span className="shrink-0 transition-transform group-hover:scale-110">
                            {React.cloneElement(link.icon, { size: 18 })}
                        </span>
                        {link.name}
                    </NavLink>
                ))}
            </div>

            {/* User & Logout Section */}
            <div className="w-full px-4 mt-auto pt-8 border-t border-white/5">
                <div className="bg-white/5 border border-white/10 rounded-[24px] p-5 mb-4 flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-500 to-primary-600 flex items-center justify-center text-white font-black shadow-xl group-hover:rotate-12 transition-transform">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden cursor-default w-full">
                        <p className="text-sm font-black text-white truncate uppercase tracking-tighter">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize font-bold tracking-widest">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-400 hover:bg-white/5 hover:text-red-400 font-black rounded-2xl transition-all border border-transparent hover:border-red-400/20 text-xs uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    Secure Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

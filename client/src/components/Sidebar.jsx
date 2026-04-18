import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, DollarSign, Settings, Video, MessageSquare, Award, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
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
        <>
            {/* Desktop Sidebar — always visible on lg+ */}
            {/* Mobile Sidebar — slides in as a drawer */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 h-full lg:h-screen
                    w-72 bg-slate-950 border-r border-white/5
                    flex flex-col items-center py-8 shadow-2xl z-[50]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo + Close button row */}
                <div className="mb-12 w-full px-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
                        <div className="w-10 h-10 logo-circle p-1.5 bg-white">
                            <img 
                                src="/images/logo.png" 
                                alt="Skilnexia Logo" 
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-white tracking-tighter leading-none">
                                Skil<span className="text-blue-500">Nexia</span>
                            </span>
                            <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Evolution</span>
                        </div>
                    </Link>
                    {/* Close button - mobile only */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Section */}
                <div className="flex flex-col w-full px-4 gap-1.5 flex-grow font-sans overflow-y-auto no-scrollbar">
                    <p className="px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Ecosystem Hub</p>
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === `/${user?.role}`}
                            onClick={onClose}
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-500 to-primary-600 flex items-center justify-center text-white font-black shadow-xl group-hover:rotate-12 transition-transform shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden cursor-default w-full">
                            <p className="text-sm font-black text-white truncate uppercase tracking-tighter">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize font-bold tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); onClose?.(); }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 text-slate-400 hover:bg-white/5 hover:text-red-400 font-black rounded-2xl transition-all border border-transparent hover:border-red-400/20 text-xs uppercase tracking-widest"
                    >
                        <LogOut size={16} />
                        Secure Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

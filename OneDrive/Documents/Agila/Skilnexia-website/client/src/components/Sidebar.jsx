import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, LogOut, DollarSign, Settings, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getLinks = () => {
        switch (user?.role) {
            case 'admin':
                return [
                    { name: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
                    { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={20} /> },
                    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
                    { name: 'Payments', path: '/admin/payments', icon: <DollarSign size={20} /> },
                    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
                ];
            case 'trainer':
                return [
                    { name: 'Dashboard', path: '/trainer', icon: <LayoutDashboard size={20} /> },
                    { name: 'My Batches', path: '/trainer/batches', icon: <Users size={20} /> },
                    { name: 'Lectures', path: '/trainer/lectures', icon: <Video size={20} /> },
                ];
            case 'student':
            default:
                return [
                    { name: 'My Learning', path: '/student', icon: <LayoutDashboard size={20} /> },
                    { name: 'Browse Courses', path: '/student/courses', icon: <BookOpen size={20} /> },
                    { name: 'Payments', path: '/student/payments', icon: <DollarSign size={20} /> },
                ];
        }
    };

    const links = getLinks();

    return (
        <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col items-center py-6 shadow-sm z-40">
            <div className="text-2xl font-bold text-slate-900 mb-10 w-full px-6 flex items-center justify-center gap-2 tracking-tight">
                <BookOpen className="text-primary-600 w-8 h-8" />
                Skilnexia
            </div>

            <div className="flex flex-col w-full px-4 gap-2 flex-grow">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === `/${user?.role}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive
                                ? 'bg-primary-50 text-primary-700 border border-primary-100 shadow-sm'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                            }`
                        }
                    >
                        {link.icon}
                        {link.name}
                    </NavLink>
                ))}
            </div>

            <div className="w-full px-4 mt-auto">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold shadow-md">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden cursor-default w-full">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize font-medium">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-lg transition-all border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

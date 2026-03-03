import React from 'react';
import { PlayCircle, Clock, Trophy, BarChart, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ title, progress, instructor, thumbnail }) => (
    <div className="glass-card p-0 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200">
        <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
            {thumbnail ? (
                <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <PlayCircle size={48} className="text-slate-400" />
                </div>
            )}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
                <h4 className="font-bold text-white leading-tight mb-1 line-clamp-2">{title}</h4>
                <p className="text-xs text-slate-200 font-medium">By {instructor}</p>
            </div>
        </div>
        <div className="p-5 bg-white">
            <div className="flex justify-between text-xs text-slate-500 font-bold mb-2">
                <span>Progress Overview</span>
                <span className="text-primary-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <button className="w-full py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-primary-200">
                <PlayCircle size={18} /> Resume Learning
            </button>
        </div>
    </div>
);

const StudentDashboard = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Learning Journey</h1>
                    <p className="text-slate-500 font-medium">Continue where you left off and fast-track your career.</p>
                </div>
                <Link to="/courses" className="hidden sm:flex text-primary-600 font-bold items-center gap-1 hover:text-primary-800 transition-colors">
                    Explore New Programs <ChevronRight size={18} />
                </Link>
            </div>

            {/* Quick Stats - Premium Light Look */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-3 border border-amber-100">
                        <Trophy size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">2</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Programs Passed</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-primary-50 rounded-full text-primary-600 mb-3 border border-primary-100">
                        <PlayCircle size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">3</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Programs</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500 mb-3 border border-blue-100">
                        <Clock size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">45h</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Learning Time</span>
                </div>
                <div className="glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform border border-slate-200">
                    <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 mb-3 border border-emerald-100">
                        <BarChart size={24} />
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 mb-1">85%</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg Assignment Score</span>
                </div>
            </div>

            {/* Enrolled Courses */}
            <div className="pt-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary-600" /> In Progress
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <CourseCard
                        title="Full Stack Web Development"
                        progress={64}
                        instructor="Dr. Angela Yu"
                        thumbnail="/images/thumbnail_react_course_1772179313562.png"
                    />
                    <CourseCard
                        title="Backend Masterclass"
                        progress={32}
                        instructor="Gary Simon"
                        thumbnail="/images/thumbnail_node_course_1772179328738.png"
                    />
                    <CourseCard
                        title="UI/UX Design Program"
                        progress={12}
                        instructor="Colt Steele"
                        thumbnail="/images/thumbnail_ui_course_1772179344268.png"
                    />
                </div>
            </div>

        </div>
    );
};

export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, BookOpen, Layers, PlayCircle, X } from 'lucide-react';
import api from '../../services/api';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Development',
        price: '',
        level: 'Beginner',
        duration: '',
        thumbnail: '',
        isPublished: true,
        trainingType: 'live',
        courseType: 'paid'
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSumbit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, formData);
            } else {
                await api.post('/courses', formData);
            }
            setShowModal(false);
            setEditingCourse(null);
            resetForm();
            fetchCourses();
        } catch (error) {
            alert("Failed to save course");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Development',
            price: '',
            level: 'Beginner',
            duration: '',
            thumbnail: '',
            isPublished: true,
            trainingType: 'live',
            courseType: 'paid'
        });
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            level: course.level,
            duration: course.duration,
            thumbnail: course.thumbnail || '',
            isPublished: course.isPublished,
            trainingType: course.trainingType || 'live',
            courseType: course.courseType || 'paid'
        });
        setShowModal(true);
    };

    const [showBatchModal, setShowBatchModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [batches, setBatches] = useState([]);
    const [loadingBatches, setLoadingBatches] = useState(false);
    const [batchFormData, setBatchFormData] = useState({
        name: '',
        trainer: '',
        startDate: '',
        endDate: '',
        maxSeats: 30
    });
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const res = await api.get('/admin/users');
            setTrainers(res.data.filter(u => u.role === 'trainer'));
        } catch (error) {
            console.error("Failed to fetch trainers", error);
        }
    };

    const handleManageBatches = async (course) => {
        setSelectedCourse(course);
        setLoadingBatches(true);
        setShowBatchModal(true);
        try {
            const res = await api.get(`/courses/${course._id}/batches`);
            setBatches(res.data);
        } catch (error) {
            setBatches([]);
        } finally {
            setLoadingBatches(false);
        }
    };

    const handleBatchSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/courses/${selectedCourse._id}/batches`, batchFormData);
            alert("Batch created successfully!");
            handleManageBatches(selectedCourse);
            setBatchFormData({ name: '', trainer: '', startDate: '', endDate: '', maxSeats: 30 });
        } catch (error) {
            alert("Failed to create batch");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course and all associated batches?")) return;
        try {
            await api.delete(`/courses/${id}`);
            fetchCourses();
        } catch (error) {
            alert("Failed to delete course");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Program Architect</h1>
                    <p className="text-slate-400 font-medium">Design, deploy, and manage the elite curriculum pipeline.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingCourse(null); setShowModal(true); }}
                    className="px-10 py-5 bg-white text-slate-950 rounded-[22px] font-black flex items-center gap-3 hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 uppercase text-xs tracking-[0.2em]"
                >
                    <Plus size={20} /> New Program Node
                </button>
            </div>

            {/* Search Hub */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-500 transition-colors" size={24} />
                <input
                    type="text"
                    placeholder="Query by program title or domain..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 bg-slate-900/40 border border-white/5 rounded-[32px] text-base font-bold text-white placeholder-slate-600 focus:ring-4 focus:ring-accent-500/10 transition-all outline-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredCourses.map(course => (
                    <div key={course._id} className="glass-card-premium p-0 overflow-hidden border border-white/5 bg-slate-900/40 group hover:-translate-y-2 transition-all duration-500 shadow-2xl rounded-[40px]">
                        <div className="h-56 w-full bg-slate-800 relative overflow-hidden">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100" />
                            ) : (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><Layers size={64} /></div>
                            )}
                             <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${course.isPublished ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-white/10'}`}>
                                    {course.isPublished ? 'Live' : 'Draft Node'}
                                </span>
                                <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${course.trainingType === 'recorded' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                    {course.trainingType || 'live'}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-accent-500 uppercase tracking-[0.3em]">{course.category}</span>
                                <span className="text-2xl font-black text-white tracking-tighter">₹{course.price?.toLocaleString()}</span>
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight mb-6 group-hover:text-accent-500 transition-colors uppercase tracking-tight h-14 overflow-hidden">{course.title}</h3>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-2 bg-white/5 rounded-lg"><PlayCircle size={16} className="text-blue-400" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{course.level}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="p-2 bg-white/5 rounded-lg"><BookOpen size={16} className="text-indigo-400" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{course.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                <button onClick={() => handleEdit(course)} className="flex-1 py-3 bg-white/5 hover:bg-white hover:text-slate-950 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleManageBatches(course)} className="flex-1 py-3 bg-accent-500/10 hover:bg-accent-500 rounded-xl text-accent-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-accent-500/20">
                                    <Layers size={14} /> Batches
                                </button>
                                <button onClick={() => handleDelete(course._id)} className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Batch Management Modal */}
            {showBatchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                    <div className="bg-slate-900 rounded-[48px] p-12 max-w-5xl w-full shadow-2xl animate-in zoom-in duration-300 border border-white/10 relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Batch Operations</h2>
                                <p className="text-[10px] font-black text-accent-500 uppercase tracking-[0.3em] mt-2">{selectedCourse?.title}</p>
                            </div>
                            <button onClick={() => setShowBatchModal(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                            {/* Create Batch Form */}
                            <div className="space-y-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest pb-4 border-b border-white/5 flex items-center gap-3">
                                    <Plus className="text-accent-500" /> New Cohort
                                </h3>
                                <form onSubmit={handleBatchSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Batch Designation</label>
                                        <input required type="text" value={batchFormData.name} onChange={e => setBatchFormData({ ...batchFormData, name: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-slate-600 focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" placeholder="e.g. October 2024 Evening" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Assigned Mentor</label>
                                        <select required value={batchFormData.trainer} onChange={e => setBatchFormData({ ...batchFormData, trainer: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none cursor-pointer appearance-none">
                                            <option value="" className="bg-slate-900">Select Mentor</option>
                                            {trainers.map(t => <option key={t._id} value={t._id} className="bg-slate-900">{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Start Timeline</label>
                                            <input required type="date" value={batchFormData.startDate} onChange={e => setBatchFormData({ ...batchFormData, startDate: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">End Timeline</label>
                                            <input required type="date" value={batchFormData.endDate} onChange={e => setBatchFormData({ ...batchFormData, endDate: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Payload Capacity (Seats)</label>
                                        <input required type="number" value={batchFormData.maxSeats} onChange={e => setBatchFormData({ ...batchFormData, maxSeats: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-accent-500/50 transition-all outline-none" />
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white shadow-2xl active:scale-95 transition-all text-xs">
                                        Initialize Batch
                                    </button>
                                </form>
                            </div>

                            {/* Existing Batches List */}
                            <div className="space-y-8">
                                <h3 className="text-lg font-black text-white uppercase tracking-widest pb-4 border-b border-white/5 flex items-center gap-3">
                                    <Layers className="text-accent-500" /> Active Cohorts
                                </h3>
                                {loadingBatches ? (
                                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div></div>
                                ) : (
                                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
                                        {batches.length === 0 && (
                                            <div className="py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <Layers size={40} className="mx-auto text-slate-700 mb-4" />
                                                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em]">No batches initialized</p>
                                            </div>
                                        )}
                                        {batches.map(b => (
                                            <div key={b._id} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-accent-500/30 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-black text-white uppercase text-sm tracking-tight">{b.name}</h4>
                                                    <span className="text-[9px] font-black px-3 py-1 bg-accent-500/10 border border-accent-500/20 rounded-lg text-accent-500 uppercase tracking-widest">{b.students?.length || 0}/{b.maxSeats} Nodes</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-slate-400">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-500"><Users size={14} /></div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">{b.trainer?.name || 'Unassigned Mentor'}</p>
                                                </div>
                                                <div className="mt-6 flex items-center gap-6 pt-4 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Start Date</p>
                                                        <p className="text-[10px] font-bold text-white">{new Date(b.startDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="w-px h-6 bg-white/5"></div>
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">End Date</p>
                                                        <p className="text-[10px] font-bold text-white">{new Date(b.endDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
                    <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 max-w-4xl w-full shadow-2xl animate-in zoom-in duration-300 border border-white/10 relative my-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">{editingCourse ? 'Refine Program Node' : 'Architect New Node'}</h2>
                                <p className="text-[10px] font-black text-accent-500 uppercase tracking-[0.4em]">Define the future of elite learning</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"><X size={28} /></button>
                        </div>

                        <form onSubmit={handleSumbit} className="space-y-10 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Section 1: Core Details */}
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Program Title</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="e.g. Master Full Stack Development" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Objective Summary</label>
                                        <textarea required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none resize-none" placeholder="High-level overview of the program objectives and outcomes..."></textarea>
                                    </div>
                                </div>

                                {/* Section 2: Metadata */}
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Domain Classification</label>
                                        <div className="relative">
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none appearance-none cursor-pointer">
                                                <option className="bg-slate-900">Development</option>
                                                <option className="bg-slate-900">Data Science</option>
                                                <option className="bg-slate-900">Cloud</option>
                                                <option className="bg-slate-900">Security</option>
                                                <option className="bg-slate-900">Design</option>
                                                <option className="bg-slate-900">Marketing</option>
                                                <option className="bg-slate-900">Business</option>
                                                <option className="bg-slate-900">Web3</option>
                                            </select>
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><Layers size={20} /></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Proficiency Level</label>
                                        <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none appearance-none cursor-pointer">
                                            <option className="bg-slate-900">Beginner</option>
                                            <option className="bg-slate-900">Intermediate</option>
                                            <option className="bg-slate-900">Advanced</option>
                                            <option className="bg-slate-900">Professional</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Tuition Investment (INR)</label>
                                        <div className="relative">
                                            <div className="absolute left-8 top-1/2 -translate-y-1/2 text-accent-500 font-black text-xl">₹</div>
                                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full pl-14 pr-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="0" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Pipeline Duration</label>
                                        <div className="relative">
                                            <input required type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="e.g. 24 Weeks" />
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500"><BookOpen size={20} /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Visuals */}
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Media Payload URL (Thumbnail)</label>
                                    <input type="text" value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="https://unsplash.com/your-image-url" />
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Delivery Protocol</label>
                                        <select value={formData.trainingType} onChange={e => setFormData({ ...formData, trainingType: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none appearance-none cursor-pointer">
                                            <option value="live" className="bg-slate-900">Live Session Hub</option>
                                            <option value="recorded" className="bg-slate-900">Asynchronous Recording</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-1">Economic Model</label>
                                        <select value={formData.courseType} onChange={e => setFormData({ ...formData, courseType: e.target.value })} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[24px] text-base font-bold text-white focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none appearance-none cursor-pointer">
                                            <option value="paid" className="bg-slate-900">Premium (Paid)</option>
                                            <option value="free" className="bg-slate-900">Open Access (Free)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2 bg-white/5 p-8 rounded-[32px] border border-white/10 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-500 shadow-xl border border-accent-500/20 italic font-black text-xl">P</div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Public Catalog Availability</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Global visibility in student dashboard</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer scale-110">
                                        <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} className="sr-only peer" />
                                        <div className="w-16 h-9 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-accent-500"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-white/5">
                                <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard Draft Node</button>
                                <button type="submit" className="flex-grow py-5 bg-white text-slate-950 rounded-[24px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white shadow-2xl active:scale-95 transition-all text-sm flex items-center justify-center gap-4">
                                    {editingCourse ? <Edit2 size={20} /> : <Plus size={20} />}
                                    {editingCourse ? 'Persist Architect Changes' : 'Initialize Program Launch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;


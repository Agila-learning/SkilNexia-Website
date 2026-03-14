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
        isPublished: true
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
            isPublished: true
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
            isPublished: course.isPublished
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
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight uppercase">Course Catalog</h1>
                    <p className="text-slate-500 font-medium">Manage programs, curriculum, and pricing structures.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setEditingCourse(null); setShowModal(true); }}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg active:scale-95 uppercase text-[10px] tracking-widest"
                >
                    <Plus size={18} /> New Program
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by program title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-50 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                    <div key={course._id} className="glass-card p-0 overflow-hidden bg-white border border-slate-200 group hover:-translate-y-1 transition-all duration-300">
                        <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400"><Layers size={48} /></div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${course.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{course.category}</span>
                                <span className="text-lg font-black text-slate-900">₹{course.price?.toLocaleString()}</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{course.title}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <PlayCircle size={16} />
                                    <span className="text-xs font-bold uppercase">{course.level}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <BookOpen size={16} />
                                    <span className="text-xs font-bold uppercase">{course.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                <button onClick={() => handleEdit(course)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2">
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button onClick={() => handleManageBatches(course)} className="flex-1 py-2 bg-primary-50 hover:bg-primary-100 rounded-lg text-primary-600 font-bold text-xs uppercase transition-colors flex items-center justify-center gap-2">
                                    <Layers size={14} /> Batches
                                </button>
                                <button onClick={() => handleDelete(course._id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Batch Management Modal */}
            {showBatchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[40px] p-10 max-w-4xl w-full shadow-2xl my-8 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Batch Management</h2>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">{selectedCourse?.title}</p>
                            </div>
                            <button onClick={() => setShowBatchModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Create Batch Form */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-2 border-b-2 border-slate-100">Create New Batch</h3>
                                <form onSubmit={handleBatchSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Batch Name</label>
                                        <input required type="text" value={batchFormData.name} onChange={e => setBatchFormData({ ...batchFormData, name: e.target.value })} className="form-input" placeholder="e.g. October 2024 Evening" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assign Trainer</label>
                                        <select required value={batchFormData.trainer} onChange={e => setBatchFormData({ ...batchFormData, trainer: e.target.value })} className="form-input">
                                            <option value="">Select Trainer</option>
                                            {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Start Date</label>
                                            <input required type="date" value={batchFormData.startDate} onChange={e => setBatchFormData({ ...batchFormData, startDate: e.target.value })} className="form-input" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">End Date</label>
                                            <input required type="date" value={batchFormData.endDate} onChange={e => setBatchFormData({ ...batchFormData, endDate: e.target.value })} className="form-input" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Max Seats</label>
                                        <input required type="number" value={batchFormData.maxSeats} onChange={e => setBatchFormData({ ...batchFormData, maxSeats: e.target.value })} className="form-input" />
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-200 active:scale-95 transition-all text-xs">
                                        Publish Batch
                                    </button>
                                </form>
                            </div>

                            {/* Existing Batches List */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight pb-2 border-b-2 border-slate-100">Existing Cohorts</h3>
                                {loadingBatches ? (
                                    <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>
                                ) : (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                        {batches.length === 0 && <p className="text-center py-12 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No batches created yet</p>}
                                        {batches.map(b => (
                                            <div key={b._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-black text-slate-900 uppercase text-xs">{b.name}</h4>
                                                    <span className="text-[9px] font-black px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 uppercase">{b.students?.length || 0}/{b.maxSeats} Seats</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                                                    <BookOpen size={12} className="text-primary-500" /> {b.trainer?.name || 'Unassigned'}
                                                </p>
                                                <div className="mt-3 text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-3">
                                                    <span>Start: {new Date(b.startDate).toLocaleDateString()}</span>
                                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                                    <span>End: {new Date(b.endDate).toLocaleDateString()}</span>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-3xl w-full shadow-2xl my-8 animate-in zoom-in duration-300 border border-slate-100">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{editingCourse ? 'Refine Program' : 'Architect New Program'}</h2>
                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">Define the future of learning</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSumbit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Section 1: Core Details */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Program Title</label>
                                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none" placeholder="e.g. Master Full Stack Development" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Description</label>
                                        <textarea required rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none resize-none" placeholder="High-level overview of the program objectives and outcomes..."></textarea>
                                    </div>
                                </div>

                                {/* Section 2: Metadata */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Domain Category</label>
                                        <div className="relative group">
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none appearance-none cursor-pointer">
                                                <option>Development</option>
                                                <option>Data Science</option>
                                                <option>Cloud</option>
                                                <option>Security</option>
                                                <option>Design</option>
                                                <option>Marketing</option>
                                                <option>Business</option>
                                                <option>Web3</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><Layers size={16} /></div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Difficulty Level</label>
                                        <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none appearance-none cursor-pointer">
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                            <option>Professional</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Tuition (INR)</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</div>
                                            <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full pl-10 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none" placeholder="0" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Program Duration</label>
                                        <div className="relative">
                                            <input required type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none" placeholder="e.g. 24 Weeks" />
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"><BookOpen size={16} /></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Visuals */}
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">Banner / Thumbnail Hosting URL</label>
                                    <input type="text" value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-50 transition-all outline-none" placeholder="https://unsplash.com/your-image-url" />
                                </div>

                                <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm border border-slate-100 italic font-black">P</div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Public Availability</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visibility in global course catalog</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({ ...formData, isPublished: e.target.checked })} className="sr-only peer" />
                                        <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors">Discard Draft</button>
                                <button type="submit" className="flex-grow py-5 bg-slate-950 text-white rounded-[22px] font-black uppercase tracking-widest hover:bg-primary-900 shadow-2xl shadow-primary-900/10 active:scale-95 transition-all text-[11px] flex items-center justify-center gap-3">
                                    {editingCourse ? <Edit2 size={18} /> : <Plus size={18} />}
                                    {editingCourse ? 'Persist Changes' : 'Launch Program'}
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


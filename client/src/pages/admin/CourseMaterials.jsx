import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, BookOpen, ChevronDown, X, Plus, Video } from 'lucide-react';
import api from '../../services/api';

const CourseMaterials = () => {
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [form, setForm] = useState({ title: '', videoUrl: '', duration: '', materialFile: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/courses/admin/all');
            setCourses(res.data || []);
        } catch {
            console.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const loadBatches = async (courseId) => {
        try {
            const res = await api.get(`/courses/${courseId}/batches`);
            setBatches(res.data || []);
        } catch {
            setBatches([]);
        }
    };

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!selectedBatch) return alert('Please select a batch first.');
        setIsUploading(true);
        try {
            let materialUrl = '';
            let materialName = '';
            if (form.materialFile) {
                const fd = new FormData();
                fd.append('file', form.materialFile);
                const up = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                materialUrl = up.data.url;
                materialName = form.materialFile.name;
            }

            await api.post(`/courses/dummy/batches/${selectedBatch._id}/lectures`, {
                title: form.title,
                videoUrl: form.videoUrl,
                duration: form.duration,
                materialUrl,
                materialName,
            });

            alert('Lecture & material added successfully!');
            setIsModalOpen(false);
            setForm({ title: '', videoUrl: '', duration: '', materialFile: null });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add lecture.');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Course Materials</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage recordings and supplementary files for each batch.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg"
                >
                    <Plus size={16} /> Add Lecture
                </button>
            </div>

            {/* Courses List */}
            <div className="space-y-5">
                {courses.length === 0 && (
                    <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                        <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-400 font-bold text-sm">No courses available</p>
                    </div>
                )}
                {courses.map(course => (
                    <div key={course._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
                        <div
                            className="flex items-center gap-4 p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => loadBatches(course._id)}
                        >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-slate-900">{course.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{course.category} • {course.level}</p>
                            </div>
                            <ChevronDown size={18} className="text-slate-400" />
                        </div>

                        {/* Batches sub-panel */}
                        {batches.filter(b => b.course?._id === course._id || b.course === course._id).map(batch => (
                            <div key={batch._id} className="border-t border-slate-100 p-5 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide">{batch.name}</h4>
                                    <button
                                        onClick={() => { setSelectedBatch(batch); setIsModalOpen(true); }}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                                    >
                                        <Plus size={12} /> Add to Batch
                                    </button>
                                </div>

                                {(batch.lectures || []).length === 0 ? (
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest py-4 text-center">No lectures yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {batch.lectures.map((lec, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-100">
                                                <div className="p-2 bg-primary-50 text-primary-600 rounded-xl shrink-0"><Video size={16} /></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm truncate">{lec.title}</p>
                                                    <p className="text-[10px] text-slate-400">{lec.duration} mins</p>
                                                </div>
                                                {lec.materialUrl && (
                                                    <a href={lec.materialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors whitespace-nowrap">
                                                        <FileText size={12} /> Material
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Add Lecture Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-tight">
                                {selectedBatch ? `Add to: ${selectedBatch.name}` : 'Add Lecture'}
                            </h3>
                            <button onClick={() => { setIsModalOpen(false); setSelectedBatch(null); }} className="text-slate-400 hover:text-slate-700 transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleAddMaterial} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Lecture Title</label>
                                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Module 1 – Introduction" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Video URL</label>
                                    <input type="url" required value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Duration (mins)</label>
                                    <input type="number" required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="60" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Attach Material (Optional PDF/ZIP)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                                    <input type="file" onChange={e => setForm(f => ({ ...f, materialFile: e.target.files[0] }))} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <Upload size={20} className="text-slate-400" />
                                        <span className="text-xs font-bold text-slate-600">{form.materialFile ? form.materialFile.name : 'Click to upload PDF or ZIP'}</span>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Publish Lecture'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;

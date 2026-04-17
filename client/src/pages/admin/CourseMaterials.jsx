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
        <div className="animate-fade-in space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Material Hub</h1>
                    <p className="text-slate-400 font-medium mt-1">Manage core recordings and intellectual assets for each cohort.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95"
                >
                    <Plus size={20} /> Deploy Material
                </button>
            </div>

            {/* Courses List */}
            <div className="space-y-8">
                {courses.length === 0 && (
                    <div className="text-center py-24 glass-card-premium border border-dashed border-white/5 rounded-[40px] bg-slate-900/40">
                        <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">No active programs found</p>
                    </div>
                )}
                {courses.map(course => (
                    <div key={course._id} className="glass-card-premium border border-white/5 rounded-[48px] bg-slate-900/40 overflow-hidden shadow-2xl group transition-all duration-500">
                        <div
                            className="flex items-center gap-6 p-8 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                            onClick={() => loadBatches(course._id)}
                        >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-800 border border-white/10 group-hover:scale-105 transition-transform">
                                {course.thumbnail && <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">{course.title}</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-accent-500 uppercase tracking-widest">{course.category}</span>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{course.level}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl text-slate-500 group-hover:text-white transition-colors">
                                <ChevronDown size={22} />
                            </div>
                        </div>

                        {/* Batches sub-panel */}
                        <div className="p-8 space-y-6 bg-slate-950/20">
                            {batches.filter(b => b.course?._id === course._id || b.course === course._id).map(batch => (
                                <div key={batch._id} className="p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-accent-500/30 transition-all">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                        <div>
                                            <h4 className="text-base font-black text-white uppercase tracking-tight">{batch.name}</h4>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Cohort Instance</p>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedBatch(batch); setIsModalOpen(true); }}
                                            className="flex items-center gap-2 px-6 py-3 bg-accent-500/10 text-accent-500 border border-accent-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all active:scale-95"
                                        >
                                            <Plus size={14} /> Add Resource
                                        </button>
                                    </div>

                                    {(batch.lectures || []).length === 0 ? (
                                        <div className="py-10 text-center">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Empty Lecture Pipeline</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {batch.lectures.map((lec, i) => (
                                                <div key={i} className="flex items-center gap-5 bg-slate-900/60 rounded-2xl p-5 border border-white/5 group/lec hover:bg-white/5 transition-all">
                                                    <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl shrink-0 group-hover/lec:scale-110 transition-transform"><Video size={20} /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-black text-white text-sm uppercase tracking-tight truncate">{lec.title}</p>
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{lec.duration} Minutes Runtime</p>
                                                    </div>
                                                    {lec.materialUrl && (
                                                        <a href={lec.materialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[9px] font-black text-accent-500 bg-accent-500/10 px-4 py-2 rounded-xl hover:bg-accent-500 hover:text-white transition-all uppercase tracking-widest border border-accent-500/20">
                                                            <FileText size={14} /> Assets
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Lecture Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="bg-slate-900 rounded-[48px] p-12 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/10 rounded-bl-full pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-3">
                                    {selectedBatch ? 'Append Resource' : 'Deploy Material'}
                                </h3>
                                <p className="text-[10px] font-black text-accent-500 uppercase tracking-[0.3em]">{selectedBatch ? `Target: ${selectedBatch.name}` : 'Global Asset Deployment'}</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); setSelectedBatch(null); }} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddMaterial} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Asset Nomenclature (Title)</label>
                                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="e.g. Session 01: Systems Architecture" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Secure Video URL</label>
                                    <input type="url" required value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="https://vimeo.com/..." />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Runtime Duration (Mins)</label>
                                    <input type="number" required value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none" placeholder="60" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Supplementary Payload (Optional PDF/ZIP)</label>
                                <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 bg-white/5 hover:bg-white/10 transition-all relative cursor-pointer group">
                                    <input type="file" onChange={e => setForm(f => ({ ...f, materialFile: e.target.files[0] }))} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20" />
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="p-4 bg-accent-500/10 text-accent-500 rounded-2xl group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">{form.materialFile ? form.materialFile.name : 'Upload Technical Docs'}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Select PDF, ZIP, or Lab Files</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="w-full py-6 bg-white text-slate-950 rounded-[24px] font-black uppercase tracking-[0.2em] hover:bg-accent-500 hover:text-white shadow-2xl active:scale-95 transition-all disabled:opacity-50 text-xs flex items-center justify-center gap-4 mt-4">
                                {isUploading ? <div className="w-6 h-6 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <><Plus size={20} /> Publish to Cohort</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseMaterials;

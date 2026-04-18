import React, { useState, useEffect } from 'react';
import { Video, Play, Trash2, Clock, Calendar, ExternalLink, Plus, FileText, Upload, X } from 'lucide-react';
import api from '../../services/api';

const LectureRecordings = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [duration, setDuration] = useState('');
    const [materialFile, setMaterialFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/courses/trainer/dashboard');
            setBatches(res.data.batches || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let materialUrl = '';
            let materialName = '';

            if (materialFile) {
                const formData = new FormData();
                formData.append('file', materialFile);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                materialUrl = uploadRes.data.url;
                materialName = materialFile.name;
            }

            await api.post(`/courses/dummy/batches/${selectedBatchId}/lectures`, {
                title,
                videoUrl,
                duration,
                materialUrl,
                materialName
            });

            alert("Lecture and materials added successfully!");
            setIsUploadModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to add lecture.");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setVideoUrl('');
        setDuration('');
        setMaterialFile(null);
        setSelectedBatchId(null);
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-white mb-1 tracking-tight uppercase">Lecture Recordings</h1>
                    <p className="text-slate-400 font-medium">Review and manage session recordings for all your active cohorts.</p>
                </div>
            </div>

            <div className="space-y-12">
                {batches.map(batch => (
                    <div key={batch._id} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-200 flex-grow"></div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">{batch.name} Archive</h2>
                            <div className="h-px bg-slate-200 flex-grow"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(batch.lectures || []).map((lecture, idx) => (
                                <div key={idx} className="glass-card bg-white border border-slate-100 p-6 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                                            <Video size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <Clock size={12} /> {lecture.duration} Mins
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2 line-clamp-1">{lecture.title}</h4>

                                    {lecture.materialUrl && (
                                        <a href={lecture.materialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-2 rounded-lg mb-4 hover:bg-primary-100 transition-colors">
                                            <FileText size={14} /> View Material: {lecture.materialName}
                                        </a>
                                    )}

                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-1.5">
                                        <Calendar size={12} /> Uploaded recently
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={lecture.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-grow py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors"
                                        >
                                            <Play size={12} /> Watch session
                                        </a>
                                        <button className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div
                                onClick={() => {
                                    setSelectedBatchId(batch._id);
                                    setIsUploadModalOpen(true);
                                }}
                                className="border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add New Recording</span>
                            </div>
                        </div>
                    </div>
                ))}

                {batches.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-[40px] border border-white/5 border-dashed">
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No batches found currently</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" animate-fade-in>
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Add New Lecture & Material</h3>
                            <button onClick={() => { setIsUploadModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddLecture} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Lecture Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Introduction to React" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Video URL</label>
                                    <div className="relative">
                                        <Video size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="url" required value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="https://" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Duration (Mins)</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="number" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-medium focus:outline-none focus:border-primary-500 transition-colors" placeholder="60" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Attach Course Material (Optional)</label>
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer group">
                                    <input type="file" onChange={e => setMaterialFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 mb-2 shadow-sm group-hover:text-primary-600 transition-colors"><Upload size={20} /></div>
                                    <span className="text-xs font-bold text-slate-600">{materialFile ? materialFile.name : 'Click to select PDF/ZIP'}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Max 10MB</span>
                                </div>
                            </div>

                            <button type="submit" disabled={isUploading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-70 flex justify-center items-center gap-2">
                                {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Publish Lecture"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LectureRecordings;

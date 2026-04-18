import React, { useState, useEffect } from 'react';
import { Users, Video, BookOpen, Clock, ChevronRight, FilePlus, Eye, CheckCircle, XCircle, ExternalLink, Play, Activity, TrendingUp, Shield, Zap, Search, Filter, Monitor } from 'lucide-react';
import gsap from 'gsap';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className={`relative overflow-hidden p-8 rounded-[32px] border border-white/5 bg-slate-900 group hover:-translate-y-1 transition-all shadow-2xl`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 shadow-lg`}>
            <Icon size={28} />
        </div>
        <h3 className="text-4xl font-black tracking-tighter text-white mb-2">{value}</h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
    </div>
);

const TrainerDashboard = () => {
    const [stats, setStats] = useState({ totalMentees: 0, activeCohorts: 0, lecturesUploaded: 0, hoursMentored: 0 });
    const [batches, setBatches] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState('');
    const [meetingLinks, setMeetingLinks] = useState({});
    const [loading, setLoading] = useState(true);

    // Lecture upload state
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureUrl, setLectureUrl] = useState('');
    const [lectureDuration, setLectureDuration] = useState('');
    const [uploading, setUploading] = useState(false);

    // Assignment related state
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [assignmentDue, setAssignmentDue] = useState('');
    const [assignments, setAssignments] = useState([]);

    // Submission viewer state
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [viewingAssignment, setViewingAssignment] = useState(null);
    const [gradingData, setGradingData] = useState({}); // { submissionId: { grade, feedback } }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/courses/trainer/dashboard');
                if (res.data) {
                    setStats(res.data.stats || { totalMentees: 0, activeCohorts: 0, lecturesUploaded: 0, hoursMentored: 0 });
                    setBatches(res.data.batches || []);
                    const links = {};
                    (res.data.batches || []).forEach(b => {
                        links[b._id] = b.meetingLink || '';
                    });
                    setMeetingLinks(links);

                    if (res.data.batches && res.data.batches.length > 0) {
                        fetchAssignments(res.data.batches[0].course._id);
                        setSelectedBatchId(res.data.batches[0]._id);
                        setSelectedCourseId(res.data.batches[0].course._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch trainer dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (!loading) {
            const ctx = gsap.context(() => {
                gsap.fromTo('.premium-reveal',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }
                );
            });
            return () => ctx.revert();
        }
    }, [loading, selectedBatchId]);

    const fetchAssignments = async (courseId) => {
        try {
            const res = await api.get(`/assignments/course/${courseId}`);
            setAssignments(res.data);
            setSelectedCourseId(courseId);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', {
                title: assignmentTitle,
                description: assignmentDesc,
                courseId: selectedCourseId,
                dueDate: assignmentDue
            });
            setShowAssignmentModal(false);
            fetchAssignments(selectedCourseId);
            setAssignmentTitle('');
            setAssignmentDesc('');
            setAssignmentDue('');
        } catch (error) {
            console.error("Failed to create assignment", error);
        }
    };

    const handleUploadLecture = async (e) => {
        e.preventDefault();
        if (!selectedBatchId) return alert("Please select a cohort first.");
        setUploading(true);
        try {
            await api.post(`/courses/${selectedCourseId}/batches/${selectedBatchId}/lectures`, {
                title: lectureTitle,
                videoUrl: lectureUrl,
                duration: lectureDuration
            });
            setShowLectureModal(false);
            setLectureTitle('');
            setLectureUrl('');
            setLectureDuration('');
            window.location.reload();
        } catch (error) {
            console.error("Failed to upload lecture", error);
        } finally {
            setUploading(false);
        }
    };

    const handleGradeSubmission = async (assignmentId, submissionId) => {
        const data = gradingData[submissionId];
        if (!data || !data.grade) return alert("Please provide a grade");
        try {
            await api.put(`/assignments/${assignmentId}/grade/${submissionId}`, {
                grade: data.grade,
                feedback: data.feedback
            });
            fetchAssignments(selectedCourseId);
            const updated = assignments.find(a => a._id === assignmentId);
            if (updated) setViewingAssignment(updated);
        } catch (error) {
            console.error("Failed to grade", error);
        }
    };

    const updateGradingInput = (submissionId, field, value) => {
        setGradingData(prev => ({
            ...prev,
            [submissionId]: {
                ...(prev[submissionId] || {}),
                [field]: value
            }
        }));
    };

    const handleLinkChange = (batchId, value) => {
        setMeetingLinks(prev => ({ ...prev, [batchId]: value }));
    };

    const updateLink = async (courseId, batchId) => {
        try {
            await api.put(`/courses/${courseId}/batches/${batchId}`, { meetingLink: meetingLinks[batchId] });
            alert("Meeting link updated successfully!");
        } catch (error) {
            console.error("Failed to update meeting link", error);
        }
    };

    const completeBatch = async (courseId, batchId) => {
        if (!window.confirm("Are you sure? This will generate certificates for all students.")) return;
        try {
            await api.put(`/courses/${courseId}/batches/${batchId}/complete`);
            window.location.reload();
        } catch (error) {
            console.error("Failed to complete batch", error);
        }
    };

    if (loading) return <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4"><div className="w-10 h-10 border-4 border-white/10 border-t-accent-500 rounded-full animate-spin"></div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Faculty Node...</p></div>;

    return (
        <div className="space-y-12 animate-fade-in pb-20 font-sans">
            
            {/* 1. OPERATIONS HEADER */}
            <div className="premium-reveal relative p-12 lg:p-16 rounded-[48px] bg-slate-900 border border-white/5 overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-slate-900 pointer-events-none transition-all duration-700 group-hover:opacity-80"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
                            <Shield className="text-emerald-500" size={14} />
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Faculty Protocol Active</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85]">Lecture Hub <br /><span className="text-accent-500">Node Sigma.</span></h1>
                        <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">Manage elite academic transition streams, session links, and curriculum velocity from a unified terminal.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-5">
                        <button
                            onClick={() => {
                                if (batches.length > 0) {
                                    if (!selectedCourseId) setSelectedCourseId(batches[0].course?._id || batches[0].course);
                                    setShowAssignmentModal(true);
                                } else {
                                    alert("No active batches found to assign tasks.");
                                }
                            }}
                            className="btn-premium-outline group/btn"
                        >
                            <FilePlus size={18} className="group-hover/btn:rotate-12 transition-transform" /> New Task
                        </button>
                        <button
                            onClick={() => {
                                if (batches.length > 0) {
                                    setShowLectureModal(true);
                                } else {
                                    alert("No active batches found to stream lectures.");
                                }
                            }}
                            className="btn-premium"
                        >
                            <Monitor size={18} /> Stream Lecture
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. CORE METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Active Cohorts" value={stats.activeBatches ?? '0'} icon={Monitor} color="text-indigo-500" bg="bg-indigo-500/10" />
                <StatCard title="Learners Managed" value={stats.totalStudents ?? '0'} icon={Users} color="text-emerald-500" bg="bg-emerald-500/10" />
                <StatCard title="Streams Recorded" value={stats.totalLectures ?? '0'} icon={Video} color="text-accent-500" bg="bg-accent-500/10" />
                <StatCard title="Legacy Rating" value="4.9" icon={TrendingUp} color="text-amber-500" bg="bg-amber-500/10" />
            </div>

            {/* 3. HUB GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* COHORT SELECTION */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3"><Activity size={24} className="text-accent-500" /> Active Streams</h3>
                    </div>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {batches.length === 0 ? (
                            <div className="p-12 text-center border border-white/5 bg-slate-900 rounded-[32px]">
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No active stream nodes detected.</p>
                            </div>
                        ) : (
                            batches.map((batch) => (
                                <div 
                                    key={batch._id} 
                                    onClick={() => { fetchAssignments(batch.course._id); setSelectedBatchId(batch._id); setSelectedCourseId(batch.course._id); }}
                                    className={`p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${selectedBatchId === batch._id ? 'bg-slate-900 border-accent-500 shadow-2xl shadow-accent-500/20 scale-[1.02]' : 'bg-slate-900/40 border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black transition-colors ${selectedBatchId === batch._id ? 'bg-accent-500 text-white' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                                                <span className="text-[10px] uppercase leading-none mb-1">{new Date(batch.startDate).toLocaleString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl leading-none">{new Date(batch.startDate).getDate()}</span>
                                            </div>
                                            <div className="overflow-hidden">
                                                <h4 className="text-white font-black text-base truncate uppercase tracking-tight">{batch.course?.title}</h4>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{batch.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Session URL (Meet/Zoom)"
                                                    value={meetingLinks[batch._id] || ''}
                                                    onChange={(e) => handleLinkChange(batch._id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full px-5 py-3 text-[11px] font-bold bg-slate-950 border border-white/10 rounded-xl text-white outline-none focus:border-accent-500 placeholder:text-slate-700 transition-all"
                                                />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateLink(batch.course._id, batch._id); }}
                                                    className="px-4 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    Set
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); meetingLinks[batch._id] ? window.open(meetingLinks[batch._id], '_blank') : alert('Set valid link'); }}
                                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                                                >
                                                    Observe
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); completeBatch(batch.course._id, batch._id); }}
                                                    className="px-6 py-3 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Finalize
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* TASKS & GRADING */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3"><Monitor size={24} className="text-emerald-500" /> Evaluation Pipelines</h3>
                        {selectedCourseId && <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Active Sink</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!selectedCourseId ? (
                            <div className="md:col-span-2 p-20 text-center glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40">
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-4">Select a stream node to access evaluations.</p>
                                <div className="w-16 h-1 border-t-2 border-white/5 mx-auto"></div>
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="md:col-span-2 p-20 text-center glass-card-premium border border-white/5 rounded-[40px] bg-slate-900/40">
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No evaluation nodes created for this stream.</p>
                            </div>
                        ) : (
                            assignments.map((assignment) => (
                                <div key={assignment._id} className="p-10 glass-card-premium group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                                    
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-accent-500 transition-colors leading-tight">{assignment.title}</h4>
                                            <span className="shrink-0 text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                                                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'INDET.'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium line-clamp-2 mb-8 flex-grow">{assignment.description}</p>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Users size={14} className="text-slate-500" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{assignment.submissions?.length || 0} Submits</span>
                                            </div>
                                            <button
                                                onClick={() => { setViewingAssignment(assignment); setShowSubmissionsModal(true); }}
                                                className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2"
                                            >
                                                Grade Stream <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS REDESIGNED */}
            {showAssignmentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Initialize Task</h2>
                        <form onSubmit={handleCreateAssignment} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Task Descriptor</label>
                                <input required type="text" value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 placeholder:text-slate-800 transition-all shadow-inner" placeholder="Phase Node Delta..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Operation Specs</label>
                                <textarea required rows="4" value={assignmentDesc} onChange={(e) => setAssignmentDesc(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 placeholder:text-slate-800 transition-all shadow-inner" placeholder="Detailed requirements..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Deadline Coordinate</label>
                                <input required type="date" value={assignmentDue} onChange={(e) => setAssignmentDue(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 transition-all shadow-inner" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAssignmentModal(false)} className="flex-1 py-4 bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 transition-all">Abort</button>
                                <button type="submit" className="flex-1 py-4 bg-accent-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl shadow-accent-500/20 hover:bg-white hover:text-slate-100 transition-all">Execute</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSubmissionsModal && viewingAssignment && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 rounded-[40px] p-12 max-w-5xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-start mb-10 pb-6 border-b border-white/5">
                            <div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Grading Node: {viewingAssignment.title}</h2>
                                <p className="text-slate-500 font-medium mt-2">Evaluate specialized sub-nodes for curriculum compliance.</p>
                            </div>
                            <button onClick={() => setShowSubmissionsModal(false)} className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl border border-white/5 transition-all"><XCircle size={24} /></button>
                        </div>

                        <div className="space-y-6">
                            {viewingAssignment.submissions?.length === 0 ? (
                                <div className="p-20 text-center bg-slate-950/50 rounded-[40px] border border-white/5 border-dashed">
                                    <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">No submission nodes detected for this phase.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left order-collapse">
                                        <thead>
                                            <tr className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                                                <th className="pb-6 px-4">Entity</th>
                                                <th className="pb-6 px-4 text-center">Work Node</th>
                                                <th className="pb-6 px-4">Metric</th>
                                                <th className="pb-6 px-4">Feedback Protocol</th>
                                                <th className="pb-6 px-4 text-right">Commit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {viewingAssignment.submissions.map(sub => (
                                                <tr key={sub._id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-6 px-4">
                                                        <div className="text-sm font-black text-white uppercase tracking-tight">{sub.student?.name || 'Unknown Node'}</div>
                                                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1.5">{sub.student?.email}</div>
                                                    </td>
                                                    <td className="py-6 px-4 text-center">
                                                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-500/10 text-accent-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-accent-500/20 hover:bg-accent-500 hover:text-white transition-all">
                                                            Inspect <ExternalLink size={14} />
                                                        </a>
                                                    </td>
                                                    <td className="py-6 px-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Grade"
                                                            defaultValue={sub.grade}
                                                            onChange={(e) => updateGradingInput(sub._id, 'grade', e.target.value)}
                                                            className="w-20 px-4 py-2 bg-slate-950 border border-white/5 rounded-xl text-white font-black uppercase text-center focus:border-accent-500 outline-none transition-all shadow-inner"
                                                        />
                                                    </td>
                                                    <td className="py-6 px-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Add protocol analysis..."
                                                            defaultValue={sub.feedback}
                                                            onChange={(e) => updateGradingInput(sub._id, 'feedback', e.target.value)}
                                                            className="w-full min-w-[200px] px-5 py-2.5 bg-slate-950 border border-white/5 rounded-xl text-white font-bold text-xs focus:border-accent-500 outline-none transition-all shadow-inner"
                                                        />
                                                    </td>
                                                    <td className="py-6 px-4 text-right">
                                                        <button
                                                            onClick={() => handleGradeSubmission(viewingAssignment._id, sub._id)}
                                                            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${sub.status === 'graded' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-white text-slate-950 shadow-xl'}`}
                                                        >
                                                            {sub.status === 'graded' ? 'Sync' : 'Push'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal Redesigned */}
            {showLectureModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-white/10 rounded-[40px] p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Record Stream</h2>
                        <form onSubmit={handleUploadLecture} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Lecture Vector</label>
                                <input required type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 shadow-inner" placeholder="Phase Node Vector..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Resource URL (Video)</label>
                                <input required type="url" value={lectureUrl} onChange={(e) => setLectureUrl(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 shadow-inner" placeholder="https://sink.cloud/..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Time Delta (Minutes)</label>
                                <input required type="number" value={lectureDuration} onChange={(e) => setLectureDuration(e.target.value)} className="w-full px-6 py-4 bg-slate-950 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-accent-500 shadow-inner" placeholder="0" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowLectureModal(false)} className="flex-1 py-4 bg-white/5 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-white/5 hover:bg-white/10 transition-all">Abort</button>
                                <button type="submit" disabled={uploading} className="flex-1 py-4 bg-accent-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl shadow-accent-500/20 hover:bg-white hover:text-slate-950 transition-all disabled:opacity-50">{uploading ? 'Syncing...' : 'Execute'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerDashboard;

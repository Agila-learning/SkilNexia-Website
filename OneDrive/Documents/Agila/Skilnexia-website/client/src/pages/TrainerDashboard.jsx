import React, { useState, useEffect } from 'react';
import { Users, Video, BookOpen, Clock, ChevronRight, FilePlus, Eye, CheckCircle, XCircle, ExternalLink, Play } from 'lucide-react';
import api from '../services/api';

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

                    // Fetch assignments for the first batch's course if available
                    if (res.data.batches && res.data.batches.length > 0) {
                        fetchAssignments(res.data.batches[0].course._id);
                        setSelectedBatchId(res.data.batches[0]._id);
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
            alert("Assignment created successfully!");
            setShowAssignmentModal(false);
            fetchAssignments(selectedCourseId);
            setAssignmentTitle('');
            setAssignmentDesc('');
            setAssignmentDue('');
        } catch (error) {
            console.error("Failed to create assignment", error);
            alert("Error creating assignment");
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
            alert("Lecture uploaded successfully!");
            setShowLectureModal(false);
            setLectureTitle('');
            setLectureUrl('');
            setLectureDuration('');
            window.location.reload();
        } catch (error) {
            console.error("Failed to upload lecture", error);
            alert("Error uploading lecture");
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
            alert("Graded successfully!");
            // Refresh assignment data to show updated grades
            fetchAssignments(selectedCourseId);
            // Also update the viewingAssignment in modal if needed, but fetchAssignments updates the main list
            const updated = assignments.find(a => a._id === assignmentId);
            if (updated) setViewingAssignment(updated);
        } catch (error) {
            console.error("Failed to grade", error);
            alert("Error grading submission");
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
            alert("Error updating meeting link");
        }
    };

    const completeBatch = async (courseId, batchId) => {
        if (!window.confirm("Are you sure you want to mark this batch as completed? Certificates will be generated for all students.")) return;
        try {
            await api.put(`/courses/${courseId}/batches/${batchId}/complete`);
            alert("Batch completed successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Failed to complete batch", error);
            alert("Error completing batch");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }
    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">Trainer Dashboard</h1>
                    <p className="text-slate-500 font-medium">Coordinate your students, sessions, and outcomes.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (batches.length > 0) {
                                setSelectedCourseId(batches[0].course._id);
                                setShowAssignmentModal(true);
                            } else {
                                alert("You need an active batch to create assignments.");
                            }
                        }}
                        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center gap-2 border border-slate-200 shadow-sm uppercase tracking-wider"
                    >
                        <FilePlus size={18} /> Add Assignment
                    </button>
                    <button
                        onClick={() => setShowLectureModal(true)}
                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-primary-200 uppercase tracking-wider underline-none">
                        Upload Lecture <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-purple-100/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors"><BookOpen size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.activeBatches ?? '-'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Cohorts</p>
                </div>
                <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-amber-100/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Users size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.totalStudents ?? '-'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Students Taught</p>
                </div>
                <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Video size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{stats.totalLectures ?? '-'}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lectures Recorded</p>
                </div>
                <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-emerald-100/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -z-10 group-hover:scale-110 transition-transform"></div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Clock size={24} /></div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">4.8</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg Rating</p>
                </div>
            </div>

            {/* Batches + Assignments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Cohorts */}
                <div className="glass-card border border-slate-200 rounded-3xl">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Users size={20} className="text-primary-500" /> Active Cohorts
                    </h3>
                    <div className="space-y-4">
                        {batches.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                No active cohorts found.
                            </div>
                        ) : (
                            batches.map((batch) => {
                                const d = new Date(batch.startDate);
                                const month = d.toLocaleString('en-US', { month: 'short' });
                                const day = d.getDate();
                                return (
                                    <div key={batch._id} className={`p-5 bg-white rounded-2xl border transition-all cursor-pointer ${selectedBatchId === batch._id ? 'border-primary-500 shadow-md ring-1 ring-primary-500' : 'border-slate-100 hover:border-primary-100'}`} onClick={() => { fetchAssignments(batch.course._id); setSelectedBatchId(batch._id); setSelectedCourseId(batch.course._id); }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex flex-col items-center justify-center text-primary-700 font-black border border-primary-100">
                                                    <span className="text-[10px] uppercase">{month}</span>
                                                    <span className="text-xl leading-none">{day}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-slate-900 font-black text-md leading-tight">{batch.course?.title}</h4>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{batch.name}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Meeting Link"
                                                    value={meetingLinks[batch._id] || ''}
                                                    onChange={(e) => handleLinkChange(batch._id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 bg-slate-50/50"
                                                />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); updateLink(batch.course._id, batch._id); }}
                                                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-primary-600 transition-colors"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); meetingLinks[batch._id] ? window.open(meetingLinks[batch._id], '_blank') : alert('Set a link first'); }}
                                                    className="flex-1 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 text-[10px] font-black uppercase rounded-xl border border-primary-200 transition-colors"
                                                >
                                                    Sessions
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); completeBatch(batch.course._id, batch._id); }}
                                                    className="px-4 py-2 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-black uppercase rounded-xl transition-colors"
                                                >
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Tasks & Assignments */}
                <div className="glass-card border border-slate-200 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <CheckCircle size={20} className="text-emerald-500" /> Tasks &amp; Assignments
                        </h3>
                        {selectedCourseId && <span className="text-[10px] font-black text-primary-600 px-2 py-1 bg-primary-50 rounded-md border border-primary-100 uppercase tracking-widest">Active Focus</span>}
                    </div>

                    <div className="space-y-4">
                        {!selectedCourseId ? (
                            <div className="p-12 text-center text-slate-400 font-medium italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                Select a cohort to view tasks.
                            </div>
                        ) : assignments.length === 0 ? (
                            <div className="p-12 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                No tasks created for this cohort.
                            </div>
                        ) : (
                            assignments.map((assignment) => (
                                <div key={assignment._id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary-100 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{assignment.title}</h4>
                                        <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                            {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No Due'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium">{assignment.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{assignment.submissions?.length || 0} Submissions</span>
                                        <button
                                            onClick={() => { setViewingAssignment(assignment); setShowSubmissionsModal(true); }}
                                            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary-600 hover:text-primary-800 transition-colors bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100"
                                        >
                                            View &amp; Grade <Eye size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>


            {/* Create Assignment Modal */}
            {showAssignmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Create Assignment</h2>
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Assignment Title</label>
                                <input
                                    required
                                    type="text"
                                    value={assignmentTitle}
                                    onChange={(e) => setAssignmentTitle(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                    placeholder="e.g., Module 1: UI/UX Essentials"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={assignmentDesc}
                                    onChange={(e) => setAssignmentDesc(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                    placeholder="Outline the tasks and requirements..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Due Date</label>
                                <input
                                    required
                                    type="date"
                                    value={assignmentDue}
                                    onChange={(e) => setAssignmentDue(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignmentModal(false)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-lg shadow-primary-200"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Lecture Modal */}
            {showLectureModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Upload Lecture</h2>
                        <form onSubmit={handleUploadLecture} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Lecture Title</label>
                                <input
                                    required
                                    type="text"
                                    value={lectureTitle}
                                    onChange={(e) => setLectureTitle(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                    placeholder="e.g., Intro to React Hooks"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Video URL (Cloudinary/YouTube)</label>
                                <input
                                    required
                                    type="url"
                                    value={lectureUrl}
                                    onChange={(e) => setLectureUrl(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Duration (Minutes)</label>
                                <input
                                    required
                                    type="number"
                                    value={lectureDuration}
                                    onChange={(e) => setLectureDuration(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                                    placeholder="45"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowLectureModal(false)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Submission Viewer Modal */}
            {showSubmissionsModal && viewingAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Grade Task: {viewingAssignment.title}</h2>
                                <p className="text-sm font-medium text-slate-500 mt-1">Review student submissions and provide feedback.</p>
                            </div>
                            <button onClick={() => setShowSubmissionsModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="text-slate-400" size={24} /></button>
                        </div>

                        <div className="space-y-6">
                            {viewingAssignment.submissions?.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    No student has submitted this task yet.
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student</th>
                                                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Work Link</th>
                                                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Grade</th>
                                                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Feedback</th>
                                                <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {viewingAssignment.submissions.map(sub => (
                                                <tr key={sub._id} className="bg-white">
                                                    <td className="p-4">
                                                        <div className="text-sm font-bold text-slate-900">{sub.student?.name || 'Unknown Student'}</div>
                                                        <div className="text-[10px] text-slate-400">{sub.student?.email}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase border border-blue-100 hover:bg-blue-100 transition-colors">
                                                            View <ExternalLink size={12} />
                                                        </a>
                                                    </td>
                                                    <td className="p-4">
                                                        <input
                                                            type="text"
                                                            placeholder="A, B, C..."
                                                            defaultValue={sub.grade}
                                                            onChange={(e) => updateGradingInput(sub._id, 'grade', e.target.value)}
                                                            className="w-16 px-3 py-1.5 text-xs font-black uppercase border border-slate-200 rounded-lg outline-none focus:border-primary-500 text-center"
                                                        />
                                                    </td>
                                                    <td className="p-4">
                                                        <input
                                                            type="text"
                                                            placeholder="Great job!"
                                                            defaultValue={sub.feedback}
                                                            onChange={(e) => updateGradingInput(sub._id, 'feedback', e.target.value)}
                                                            className="w-full min-w-[150px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-primary-500"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleGradeSubmission(viewingAssignment._id, sub._id)}
                                                            className="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-primary-700 transition-colors shadow-md shadow-primary-200"
                                                        >
                                                            {sub.status === 'graded' ? 'Update' : 'Grade'}
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
        </div>
    );
};

export default TrainerDashboard;

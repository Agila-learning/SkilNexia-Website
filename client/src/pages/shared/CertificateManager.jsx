import React, { useState, useEffect } from 'react';
import { Award, Mail, CheckCircle, Clock, Search, RefreshCw, X, Eye } from 'lucide-react';
import api from '../../services/api';
import CertificatePreview from '../../components/CertificatePreview';

const CertificateManager = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [issuing, setIssuing] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const res = await api.get('/enrollments/all');
            setEnrollments(res.data);
        } catch (err) {
            console.error('Failed to fetch enrollments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCertificate = async (enrollmentId, studentName) => {
        if (!window.confirm(`Issue certificate and send email to ${studentName}?`)) return;
        setIssuing(enrollmentId);
        try {
            const res = await api.put(`/enrollments/${enrollmentId}/complete`);
            setSuccessMsg(`✅ Certificate issued and emailed to ${studentName}!`);
            setTimeout(() => setSuccessMsg(''), 5000);
            fetchEnrollments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to issue certificate.');
        } finally {
            setIssuing(null);
        }
    };

    const filtered = enrollments.filter(e => {
        const q = search.toLowerCase();
        return (
            e.student?.name?.toLowerCase().includes(q) ||
            e.student?.email?.toLowerCase().includes(q) ||
            e.batch?.course?.title?.toLowerCase().includes(q)
        );
    });

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
    return (
        <div className="animate-fade-in space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">Credential Pipeline</h1>
                    <p className="text-slate-400 font-medium mt-1">Issue secure academic certificates and verify cohort completions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowPreview(true)} className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-2xl active:scale-95">
                        <Eye size={18} className="text-accent-500" /> Preview Template
                    </button>
                    <button onClick={fetchEnrollments} className="flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95">
                        <RefreshCw size={18} /> Re-sync Node
                    </button>
                </div>
            </div>

            {/* Certificate Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
                    <div className="relative w-full max-w-6xl animate-in zoom-in duration-300 my-auto">
                        <div className="flex justify-between items-center mb-6 px-4">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Credential Preview</h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Skilnexia Sovereign Schema v1.0</p>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-4 bg-white/10 hover:bg-rose-500 text-white rounded-2xl transition-all shadow-2xl active:scale-95 border border-white/5"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="glass-card-premium border border-white/10 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-white flex items-center justify-center p-4 md:p-8">
                            <div className="w-full max-h-[80vh] overflow-y-auto custom-scrollbar flex items-center justify-center">
                                <CertificatePreview />
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            <div className="px-6 py-2 bg-accent-500/10 border border-accent-500/20 rounded-full">
                                <p className="text-accent-500 font-black text-[9px] uppercase tracking-[0.4em]">Verified Academic Node Artifact</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {successMsg && (
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black rounded-[24px] px-8 py-5 animate-in slide-in-from-top-4 duration-500">
                    <CheckCircle size={24} className="text-emerald-500 shrink-0" />
                    <span className="text-sm uppercase tracking-tight">{successMsg}</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card-premium border border-white/5 rounded-[40px] p-10 bg-slate-900/40 relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-400/5 rounded-bl-full pointer-events-none group-hover:bg-slate-400/10 transition-all"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-5 bg-white/5 rounded-2xl text-slate-400 group-hover:scale-110 transition-transform"><Clock size={28} /></div>
                        <div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{enrollments.filter(e => e.progress < 100).length}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Pending Sync</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card-premium border border-white/5 rounded-[40px] p-10 bg-slate-900/40 relative overflow-hidden group hover:border-accent-500/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-bl-full pointer-events-none group-hover:bg-accent-500/10 transition-all"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-5 bg-accent-500/10 rounded-2xl text-accent-500 group-hover:scale-110 transition-transform"><Award size={28} /></div>
                        <div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{enrollments.filter(e => e.progress === 100).length}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-500 mt-1">Authorized</p>
                        </div>
                    </div>
                </div>
                <div className="glass-card-premium border border-white/5 rounded-[40px] p-10 bg-slate-900/40 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-all"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="p-5 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Mail size={28} /></div>
                        <div>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{enrollments.length}</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Total Nodes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Table */}
            <div className="glass-card-premium border border-white/5 rounded-[48px] bg-slate-900/40 overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <Search size={24} className="text-accent-500" />
                        Audit Interface
                    </h3>
                    <div className="relative w-full md:w-96">
                        <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Filter by node identity..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[22px] font-bold text-white placeholder-slate-700 focus:ring-4 focus:ring-accent-500/10 focus:border-accent-500/30 transition-all outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Learner Node</th>
                                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Program Designation</th>
                                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion</th>
                                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Directive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(enr => (
                                <tr key={enr._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-black text-white shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                                                {enr.student?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-sm uppercase tracking-tight">{enr.student?.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold mt-0.5">{enr.student?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10">
                                        <p className="font-black text-slate-300 text-sm uppercase tracking-tight">{enr.batch?.course?.title || '—'}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{enr.batch?.name}</span>
                                            <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${enr.batch?.course?.trainingType === 'recorded' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                                {enr.batch?.course?.trainingType || 'Live'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10">
                                        <div className="w-32 bg-white/5 rounded-full h-1.5 overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${enr.progress === 100 ? 'bg-emerald-500' : 'bg-accent-500'}`} style={{ width: `${enr.progress || 0}%` }}></div>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-500 mt-2 block uppercase tracking-widest">{enr.progress || 0}% Finalized</span>
                                    </td>
                                    <td className="py-8 px-10">
                                        {enr.progress === 100 ? (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-[0.15em] border border-emerald-500/20">
                                                <Award size={14} /> Certified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-500/10 text-slate-500 text-[9px] font-black uppercase tracking-[0.15em] border border-white/5">
                                                <Clock size={14} /> Syncing
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        {enr.progress !== 100 ? (
                                            <button
                                                onClick={() => handleIssueCertificate(enr._id, enr.student?.name)}
                                                disabled={issuing === enr._id}
                                                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-slate-950 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-accent-500 hover:text-white transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                                            >
                                                {issuing === enr._id ? (
                                                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <><Mail size={14} /> Authorize</>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2 text-emerald-500/60 font-black text-[9px] uppercase tracking-[0.2em]">
                                                <CheckCircle size={14} /> Vaulted
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="space-y-4 opacity-20">
                                            <RefreshCw size={48} className="mx-auto" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Zero Results in Pipeline</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CertificateManager;

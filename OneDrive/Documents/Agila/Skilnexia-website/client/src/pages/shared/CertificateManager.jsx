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
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Certificate Manager</h1>
                    <p className="text-slate-500 font-medium mt-1">Mark enrollments complete and issue certificates via email.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <Eye size={16} /> Preview Template
                    </button>
                    <button onClick={fetchEnrollments} className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition-colors shadow-lg">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Certificate Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
                    <div className="relative w-full max-w-5xl animate-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <CertificatePreview />
                        <div className="mt-8 text-center">
                            <p className="text-white/60 text-sm font-medium">This is a live preview of the Skilnexia Premium Certificate.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {successMsg && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-2xl px-6 py-4">
                    <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                    {successMsg}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl"><Clock size={20} className="text-slate-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">{enrollments.filter(e => e.progress < 100).length}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">In Progress</p>
                    </div>
                </div>
                <div className="bg-white border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl"><Award size={20} className="text-emerald-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">{enrollments.filter(e => e.progress === 100).length}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Certified</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl"><Mail size={20} className="text-blue-600" /></div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">{enrollments.length}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by student, email, or course..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl font-medium focus:outline-none focus:border-primary-500 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                            <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Student</th>
                            <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Course</th>
                            <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Progress</th>
                            <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                            <th className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map(enr => (
                            <tr key={enr._id} className="hover:bg-slate-50/70 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-black text-sm border border-primary-100">
                                            {enr.student?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{enr.student?.name}</p>
                                            <p className="text-[11px] text-slate-400">{enr.student?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="font-bold text-slate-700 text-sm">{enr.batch?.course?.title || '—'}</p>
                                    <p className="text-[11px] text-slate-400">{enr.batch?.name}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                        <div className={`h-2 rounded-full transition-all ${enr.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${enr.progress || 0}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 mt-1 block">{enr.progress || 0}%</span>
                                </td>
                                <td className="py-4 px-6">
                                    {enr.progress === 100 ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            <Award size={12} /> Certified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                            <Clock size={12} /> In Progress
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    {enr.progress !== 100 ? (
                                        <button
                                            onClick={() => handleIssueCertificate(enr._id, enr.student?.name)}
                                            disabled={issuing === enr._id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all disabled:opacity-60"
                                        >
                                            {issuing === enr._id ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><Mail size={12} /> Issue &amp; Email</>
                                            )}
                                        </button>
                                    ) : (
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Done</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-16 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                    No enrollments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CertificateManager;

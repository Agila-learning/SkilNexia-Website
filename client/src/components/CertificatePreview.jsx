import React from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CertificatePreview = ({ studentName = "John Doe", courseName = "Full Stack Development Mastery", issueDate = new Date().toLocaleDateString() }) => {
    return (
        <div className="w-full max-w-4xl mx-auto aspect-[1.414/1] bg-white border-[20px] border-slate-900 p-1 relative overflow-hidden shadow-2xl">
            {/* Inner Border */}
            <div className="w-full h-full border-[1px] border-slate-200 relative p-12 flex flex-col items-center text-center">

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-400"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-400"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-400"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-400"></div>

                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award size={600} strokeWidth={0.5} />
                </div>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white scale-125">
                            <GraduationCapIcon />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-[0.2em] text-slate-900 uppercase mb-2">Skilnexia</h1>
                    <p className="text-xs font-black tracking-[0.4em] text-slate-400 uppercase">Academy of Advanced Engineering</p>
                </div>

                {/* Title */}
                <div className="mb-10">
                    <h2 className="text-5xl font-serif text-slate-800 italic mb-2">Certificate of Completion</h2>
                    <div className="w-48 h-0.5 bg-amber-400 mx-auto"></div>
                </div>

                {/* Body */}
                <div className="space-y-6 mb-12">
                    <p className="text-slate-500 font-medium">This is to certify that</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tight uppercase border-b-2 border-slate-100 pb-4 inline-block px-8">{studentName}</h3>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        has successfully completed all requirements and mastered the curriculum for the intensive program in
                    </p>
                    <h4 className="text-2xl font-bold text-primary-600 uppercase tracking-wide">{courseName}</h4>
                </div>

                {/* Footer / Signatures */}
                <div className="mt-auto w-full grid grid-cols-3 items-end gap-12">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-px bg-slate-300 mb-2"></div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Head of Academics</p>
                    </div>

                    <div className="flex flex-col items-center relative">
                        {/* Seal */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                            <div className="w-full h-full rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center">
                                <ShieldCheck size={48} className="text-amber-800" strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-900 mt-4">Official Verification Seal</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-32 h-px bg-slate-300 mb-2"></div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Director of Operations</p>
                    </div>
                </div>

                {/* Metadata */}
                <div className="absolute bottom-8 left-12 flex items-center gap-4">
                    <div className="text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Issue Date</p>
                        <p className="text-[10px] font-bold text-slate-900">{issueDate}</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Certificate ID</p>
                        <p className="text-[10px] font-bold text-slate-900">SKLX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                </div>

                <div className="absolute bottom-8 right-12 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Alumnus</span>
                </div>
            </div>
        </div>
    );
};

const GraduationCapIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3.333 3 6.667 3 10 0v-5" /></svg>
);

export default CertificatePreview;

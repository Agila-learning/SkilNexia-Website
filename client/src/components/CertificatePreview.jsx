import React from 'react';
import { Award, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';

const CertificatePreview = ({ studentName = "John Doe", courseName = "Full Stack Development Mastery", issueDate = new Date().toLocaleDateString() }) => {
    return (
        <div className="w-full max-w-4xl mx-auto aspect-[1.414/1] bg-white border-[8px] md:border-[20px] border-slate-900 p-1 relative overflow-hidden shadow-2xl flex items-center justify-center container">
            {/* Inner Border */}
            <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] border-[1px] border-slate-200 relative p-4 md:p-12 flex flex-col items-center justify-between text-center">

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-12 h-12 md:w-24 md:h-24 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-amber-400"></div>
                <div className="absolute top-0 right-0 w-12 h-12 md:w-24 md:h-24 border-t-2 md:border-t-4 border-r-2 md:border-r-4 border-amber-400"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 md:w-24 md:h-24 border-b-2 md:border-b-4 border-l-2 md:border-l-4 border-amber-400"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 md:w-24 md:h-24 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-amber-400"></div>

                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Award size={300} className="md:w-[600px] md:h-[600px]" strokeWidth={0.5} />
                </div>

                {/* Header */}
                <div className="space-y-2 md:space-y-4 mt-2 md:mt-0">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 md:w-14 md:h-14 bg-slate-900 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <GraduationCap size={16} className="md:w-8 md:h-8" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-4xl font-black tracking-[0.2em] text-slate-900 uppercase">Skilnexia</h1>
                        <p className="text-[6px] md:text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase mt-1">Academy of Advanced Engineering</p>
                    </div>
                </div>

                {/* Title */}
                <div className="w-full">
                    <h2 className="text-xl md:text-5xl font-serif text-slate-800 italic mb-2 md:mb-4">Certificate of Completion</h2>
                    <div className="w-24 md:w-48 h-px md:h-0.5 bg-amber-400 mx-auto"></div>
                </div>

                {/* Body */}
                <div className="space-y-2 md:space-y-6 max-w-[90%] md:max-w-2xl">
                    <p className="text-[10px] md:text-base text-slate-500 font-medium italic">This is to certify that</p>
                    <h3 className="text-xl md:text-5xl font-black text-slate-900 tracking-tight uppercase border-b border-slate-100 pb-1 md:pb-2 px-4 md:px-8 inline-block">{studentName}</h3>
                    <p className="text-[8px] md:text-base text-slate-500 font-medium leading-relaxed mt-2 md:mt-4">
                        has successfully completed all requirements and mastered the curriculum for the intensive program in
                    </p>
                    <h4 className="text-[10px] md:text-2xl font-bold text-primary-600 uppercase tracking-wide">{courseName}</h4>
                </div>

                {/* Footer / Signatures */}
                <div className="w-full grid grid-cols-3 items-end gap-2 md:gap-12 px-4 md:px-12 pb-4 md:pb-8">
                    <div className="flex flex-col items-center">
                        <div className="w-full h-px bg-slate-200 mb-1 md:mb-3"></div>
                        <p className="text-[5px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Head of Academics</p>
                    </div>

                    <div className="flex flex-col items-center relative">
                        {/* Seal */}
                        <div className="absolute -top-8 md:-top-16 left-1/2 -translate-x-1/2 w-12 h-12 md:w-32 md:h-32 bg-amber-400 rounded-full flex items-center justify-center shadow-xl border-2 md:border-4 border-white">
                            <div className="w-full h-full rounded-full border border-dashed border-amber-600 flex items-center justify-center">
                                <ShieldCheck size={20} className="md:w-12 md:h-12 text-amber-800" strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-[5px] md:text-[9px] font-black uppercase text-slate-900 mt-4 md:mt-6 tracking-widest text-center">Official Seal</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-full h-px bg-slate-200 mb-1 md:mb-3"></div>
                        <p className="text-[5px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Director of Operations</p>
                    </div>
                </div>

                {/* Metadata */}
                <div className="absolute bottom-2 md:bottom-10 left-4 md:left-12 flex items-center gap-2 md:gap-6">
                    <div className="text-left">
                        <p className="text-[4px] md:text-[7px] font-black text-slate-400 uppercase tracking-tighter">Issue Date</p>
                        <p className="text-[6px] md:text-[10px] font-bold text-slate-900">{issueDate}</p>
                    </div>
                    <div className="w-px h-4 md:h-6 bg-slate-200"></div>
                    <div className="text-left">
                        <p className="text-[4px] md:text-[7px] font-black text-slate-400 uppercase tracking-tighter">Certificate ID</p>
                        <p className="text-[6px] md:text-[10px] font-bold text-slate-900">SKLX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                </div>

                <div className="absolute bottom-2 md:bottom-10 right-4 md:right-12 flex items-center gap-1 md:gap-2">
                    <CheckCircle2 size={10} className="md:w-4 md:h-4 text-emerald-500" />
                    <span className="text-[5px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Alumnus</span>
                </div>
            </div>
        </div>
    );
};

export default CertificatePreview;

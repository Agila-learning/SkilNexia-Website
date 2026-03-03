import React, { useEffect } from 'react';

const Compliance = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white pt-40 pb-20 px-4 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4 text-center pb-12 border-b border-slate-100">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">ISO & Global <br /><span className="text-emerald-500 font-black">Compliance.</span></h1>
                    <p className="text-slate-500 font-medium">Certification ID: LX-9001-2026</p>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <h3 className="text-xl font-black uppercase mb-4">Data Residency</h3>
                        <p className="text-slate-600 leading-relaxed">
                            We comply with GDPR, CCPA, and Indian Data Protection limits. Your learning data stays in secured regions as per your deployment.
                        </p>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <h3 className="text-xl font-black uppercase mb-4">ISO 9001:2026</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Skilnexia's curriculum delivery and assessment systems are audited quarterly for quality management excellence.
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Ethics in Learning</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Skilnexia adheres to the "Global Ethics Charter in EdTech 2024". We ensure that our AI-based roadmap suggestions are free from bias and focused purely on career-meritocracy.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Compliance;

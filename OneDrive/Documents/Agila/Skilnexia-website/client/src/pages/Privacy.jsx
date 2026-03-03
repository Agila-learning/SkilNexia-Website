import React, { useEffect } from 'react';

const Privacy = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white pt-40 pb-20 px-4 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4 text-center pb-12 border-b border-slate-100">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">Privacy & <br /><span className="text-primary-900 font-black">Data Ethics.</span></h1>
                    <p className="text-slate-500 font-medium">Last updated: February 2026</p>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">1. Core Commitment</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        At Skilnexia, we treat student data as a sacred trust. Our "Evolution" LMS is designed with a "Privacy by Design" architecture, ensuring that your personal learning analytics are used solely for career progression and roadmap optimization.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">2. Information We Collect</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        We collect information necessary to provide a personalized learning experience, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-4 text-lg text-slate-600">
                        <li><strong>Identity Data:</strong> Full name and work email for secure dashboard access.</li>
                        <li><strong>Performance Analytics:</strong> Project completion rates and skill proficiency scores.</li>
                        <li><strong>Career Intent:</strong> Your specialized roadmap preferences and hiring partner interests.</li>
                    </ul>
                </section>

                <section className="space-y-6 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                    <h2 className="text-2xl font-black uppercase tracking-tight">3. Data Security</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Skilnexia employs enterprise-grade AES-256 encryption for all stored data. Our global infrastructure is ISO 27001 certified and monitored 24/7 for security anomalies.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;

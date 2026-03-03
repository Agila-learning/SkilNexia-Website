import React, { useEffect } from 'react';

const Terms = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="min-h-screen bg-white pt-40 pb-20 px-4 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4 text-center pb-12 border-b border-slate-100">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">User Experience <br /><span className="text-accent-500 font-black">Agreement.</span></h1>
                    <p className="text-slate-500 font-medium">Agreement Version 4.2</p>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-primary-900">Admission & Conduct</h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        By accessing the Skilnexia ecosystem, you agree to uphold our standards of "Elite Professionalism". Our programs are high-intensity and require 100% commitment to project-based learning.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Intellectual Property</h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        The "Evolution" roadmap architecture, course videos, and project briefs are proprietary property of Skilnexia Global Ltd. Students are granted a limited license for personal professional growth only.
                    </p>
                </section>

                <section className="p-8 bg-slate-950 rounded-[40px] shadow-3xl text-white">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Refund Policy</h2>
                    <p className="opacity-80 leading-relaxed">
                        Registration and seat allotment fees are non-refundable as they represent a commitment to our 1:1 mentorship allocation. For specific EMI cancellations, refer to your personalized enrollment agreement.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;

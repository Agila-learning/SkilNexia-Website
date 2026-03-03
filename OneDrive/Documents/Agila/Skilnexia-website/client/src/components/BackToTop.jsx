import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!showBackToTop) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-10 left-10 z-[90] w-16 h-16 bg-slate-950 text-white rounded-[22px] shadow-3xl border border-slate-800 hover:bg-accent-500 transition-all duration-300 animate-bounce group flex items-center justify-center p-0"
        >
            <ArrowUp size={28} className="group-hover:-translate-y-1 transition-transform" />
        </button>
    );
};

export default BackToTop;

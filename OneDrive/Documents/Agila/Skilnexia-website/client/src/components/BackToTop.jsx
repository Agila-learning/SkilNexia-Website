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
            className="fixed bottom-10 left-10 z-[90] w-14 h-14 bg-primary-600 text-white rounded-[20px] shadow-3xl border border-primary-500/50 hover:bg-accent-500 hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center p-0"
        >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
    );
};

export default BackToTop;

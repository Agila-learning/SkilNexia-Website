import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (isVisible) {
            gsap.fromTo('.scroll-top-btn', 
                { scale: 0, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    }, [isVisible]);

    return (
        <button
            onClick={scrollToTop}
            className={`scroll-top-btn fixed bottom-44 left-4 z-[100] p-4 bg-slate-950 text-white rounded-2xl shadow-3xl border border-white/10 hover:bg-accent-500 hover:scale-110 transition-all duration-300 ${
                isVisible ? 'flex' : 'hidden'
            } items-center justify-center group`}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
    );
};

export default ScrollToTop;

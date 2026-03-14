import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const GlobalCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    useEffect(() => {
        gsap.to('.custom-cursor', {
            x: mousePosition.x,
            y: mousePosition.y,
            duration: 0.15,
            ease: 'power2.out',
        });

        gsap.to('.custom-cursor-dot', {
            x: mousePosition.x,
            y: mousePosition.y,
            duration: 0.05,
        });
    }, [mousePosition]);

    return (
        <div className="hidden md:block pointer-events-none z-[9999] fixed inset-0 overflow-hidden mix-blend-difference">
            <div
                className={`custom-cursor absolute w-8 h-8 rounded-full border border-white -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${isHovering ? 'scale-150 bg-white/10' : 'scale-100'}`}
                style={{ left: 0, top: 0 }}
            />
            <div
                className={`custom-cursor-dot absolute w-2 h-2 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                style={{ left: 0, top: 0 }}
            />
        </div>
    );
};

export default GlobalCursor;

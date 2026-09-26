import React from 'react';

/**
 * EducationBeyondBoundaries.jsx — Artistic handwritten cursive script with golden brush stroke.
 * Matches Image 2 bottom-right handwriting accent.
 */
export default function EducationBeyondBoundaries({ className = '', align = 'right', size = 'normal' }) {
    const isSmall = size === 'small';
    return (
        <div className={`relative inline-block select-none transform -rotate-3 ${align === 'center' ? 'text-center' : 'text-right'}${className}`}>
            <div className={`font-script font-bold tracking-normal text-[#1e3a8a] leading-[1.05] drop-shadow-xs ${isSmall ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
                <div>Education</div>
                <div>Beyond Boundaries</div>
            </div>
            {/* Golden Brush Swoosh SVG Underline */}
            <div className={`flex ${align === 'center' ? 'justify-center' : 'justify-end'}-mt-1 pl-2`}>
                <svg
                    className={`${isSmall ? 'w-28 sm:w-36 h-3' : 'w-32 sm:w-40 h-3.5'}text-[#f59e0b]`}
                    viewBox="0 0 140 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M2 9.5C34 2 95 1.5 138 6C110 8 70 9.8 45 10.8C27 11.4 12 11.2 2 9.5Z"
                        fill="currentColor"
                        opacity="0.9"
                    />
                </svg>
            </div>
        </div>
    );
}

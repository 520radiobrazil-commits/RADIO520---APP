import React from 'react';

const SoundWave: React.FC = () => {
    const bars = Array.from({ length: 60 }); 

    return (
        <div className="absolute inset-0 flex justify-center items-end gap-1 overflow-hidden">
            {bars.map((_, i) => (
                <div
                    key={i}
                    className="w-2 bg-red-700"
                    style={{
                        animation: `wave 1.2s ease-in-out infinite alternate`,
                        animationDelay: `${i * -0.025}s`,
                        height: '100%',
                        transformOrigin: 'bottom'
                    }}
                ></div>
            ))}
            <style>{`
                @keyframes wave {
                    0% { transform: scaleY(0.05); opacity: 0.5; }
                    100% { transform: scaleY(0.8); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SoundWave;



import React, { useRef, useEffect } from 'react';

interface SoundWaveProps {
  analyser: AnalyserNode | null;
}

const NUM_BARS = 64; // A power of 2, often works well with FFT data

const SoundWave: React.FC<SoundWaveProps> = ({ analyser }) => {
    const barRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animationFrameIdRef = useRef<number | null>(null);

    // Initialize refs array
    useEffect(() => {
        barRefs.current = barRefs.current.slice(0, NUM_BARS);
    }, []);

    useEffect(() => {
        if (!analyser) return;

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount; // 128
        const dataArray = new Uint8Array(bufferLength);
        
        const draw = () => {
            animationFrameIdRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            const relevantDataLength = bufferLength / 2; // Use lower frequencies

            for (let i = 0; i < NUM_BARS; i++) {
                // Map bars to frequency data points
                const dataIndex = Math.floor(i * (relevantDataLength / NUM_BARS));
                // Use a non-linear scale for better visual dynamics, and scale to percentage
                const barHeight = Math.pow(dataArray[dataIndex] / 255, 2.5) * 100;

                const bar = barRefs.current[i];
                if (bar) {
                    // Apply a minimum height to keep bars visible
                    bar.style.height = `${Math.max(barHeight, 1)}%`;
                }
            }
        };

        draw();

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [analyser]);

    return (
        <div className="absolute inset-0 w-full h-full flex justify-center items-end gap-0.5 sm:gap-1 overflow-hidden p-2">
            {Array.from({ length: NUM_BARS }).map((_, i) => (
                <div
                    key={i}
                    // FIX: The ref callback should not return a value. An arrow function with a body in braces implicitly returns undefined, which satisfies the requirement.
                    ref={el => { barRefs.current[i] = el; }}
                    className="flex-1 bg-gradient-to-t from-red-800 via-red-600 to-red-400 rounded-t-sm"
                    style={{
                        height: '1%', // Initial height
                        transition: 'height 75ms ease-out' // Fast transition for responsiveness
                    }}
                ></div>
            ))}
        </div>
    );
};

export default SoundWave;

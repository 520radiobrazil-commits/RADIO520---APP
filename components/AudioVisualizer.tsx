
import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Initialize useRef with null and update the type to allow null.
  // This is the correct way to handle refs that are initialized without a value.
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    // We need an analyser node and a canvas to draw on
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configure the analyser
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount; // This will be 128
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      // Schedule the next frame
      animationFrameIdRef.current = requestAnimationFrame(draw);
      
      // Get the frequency data from the analyser
      analyser.getByteFrequencyData(dataArray);

      // Ensure canvas is sized to its container
      const parent = canvas.parentElement;
      if (parent) {
        if (canvas.width !== parent.offsetWidth || canvas.height !== parent.offsetHeight) {
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        }
      }
      
      // Clear the canvas for the next frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / (bufferLength * 1.5));
      const gap = barWidth * 0.3;
      const totalBarWidth = barWidth + gap;
      const centerX = canvas.width / 2;
      
      // Iterate through half of the frequency data to create a mirrored, symmetrical visual
      for (let i = 0; i < bufferLength / 2; i++) {
        // Scale the bar height. Using a power function creates a more dynamic and responsive visual.
        const barHeight = Math.pow(dataArray[i] / 255, 2.2) * canvas.height * 0.95;

        // Create a color gradient for a glowing effect
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, 'rgba(127, 29, 29, 0.5)');   // Dark red at the base
        gradient.addColorStop(0.7, 'rgba(220, 38, 38, 0.8)'); // Main red color
        gradient.addColorStop(1, 'rgba(252, 165, 165, 1)');   // Lighter red at the tip
        
        ctx.fillStyle = gradient;
        
        // Calculate positions for the mirrored bars
        const barX_right = centerX + (i * totalBarWidth);
        const barX_left = centerX - (i * totalBarWidth) - barWidth;

        // Only draw bars that have a visible height
        if (barHeight > 1) { 
            ctx.fillRect(barX_left, canvas.height - barHeight, barWidth, barHeight);
            ctx.fillRect(barX_right, canvas.height - barHeight, barWidth, barHeight);
        }
      }
    };

    draw();

    // Clean up the animation frame on component unmount
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [analyser]); // Rerun effect if the analyser changes

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default AudioVisualizer;

import React, { useEffect, useRef, useState } from 'react';

const FPSMonitor: React.FC = () => {
    const [fps, setFps] = useState<number>(0);
    const lastTimeRef = useRef<number>(performance.now());
    const frameCountRef = useRef<number>(0);

    useEffect(() => {
        const updateFPS = () => {
            const now = performance.now();
            const delta = (now - lastTimeRef.current) / 1000; // Convert to seconds
            frameCountRef.current++;

            // Update every second
            if (delta >= 1) {
                const currentFps = frameCountRef.current / delta;
                setFps(Math.round(currentFps));

                // Reset counters
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            requestAnimationFrame(updateFPS);
        };

        requestAnimationFrame(updateFPS);

        return () => {
            // Cleanup if component unmounts
            cancelAnimationFrame(requestAnimationFrame(updateFPS));
        };
    }, []);

    return (
        <div style={styles.fpsCounter}>
            {fps} FPS
        </div>
    );
};

// Simple CSS-in-JS styles for the FPS monitor
const styles = {
    fpsCounter: {
        position: 'fixed' as 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '5px 10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        borderRadius: '5px',
        zIndex: 9999,
    }
};

export default FPSMonitor;

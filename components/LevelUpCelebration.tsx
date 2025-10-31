import React from 'react';

interface LevelUpCelebrationProps {
    newLevel: number;
    onClose: () => void;
}

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ newLevel, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-level-up-fade-in"
            onClick={onClose}
        >
            <div className="relative text-center p-8">
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
                    ))}
                </div>

                <div className="relative">
                    <h2 className="text-5xl md:text-6xl font-black text-yellow-300 animate-level-up-title" style={{ WebkitTextStroke: '3px #a25b0f', textShadow: '0 0 15px rgba(253, 224, 71, 0.5)' }}>
                        ¡Subiste de Nivel!
                    </h2>
                    <div className="mt-4 animate-level-up-number">
                        <span className="text-blue-200 text-2xl md:text-3xl font-bold">Alcanzaste el Nivel</span>
                        <p className="text-8xl md:text-9xl font-black text-white" style={{ textShadow: '0 5px 20px rgba(0,0,0,0.5)' }}>{newLevel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelUpCelebration;
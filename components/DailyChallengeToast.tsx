import React from 'react';

interface DailyChallengeToastProps {
    bonus: number;
}

const DailyChallengeToast: React.FC<DailyChallengeToastProps> = ({ bonus }) => {
    return (
        <div className="fixed bottom-10 right-10 bg-gradient-to-br from-green-600 to-emerald-700 text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 border-2 border-yellow-300 animate-slide-in-up-fade">
            <div className="w-16 h-16 bg-yellow-400 text-green-800 rounded-xl flex items-center justify-center text-4xl animate-bounce">
                🎯
            </div>
            <div>
                <h3 className="font-bold text-lg">¡Reto Diario Completado!</h3>
                <p className="text-yellow-200 font-semibold">+{bonus} Puntos Extra</p>
            </div>
            <style>{`
                @keyframes slide-in-up-fade {
                    0% {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    15% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    85% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                }
                .animate-slide-in-up-fade {
                    animation: slide-in-up-fade 4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default DailyChallengeToast;
import React from 'react';
import { User } from '../types';
import { ACHIEVEMENT_DEFINITIONS, StarIcon } from '../constants';

interface AchievementsScreenProps {
    user: User;
    onGoHome: () => void;
}

const AchievementItem: React.FC<{ progress: User['achievements'][keyof User['achievements']] }> = ({ progress }) => {
    const definition = ACHIEVEMENT_DEFINITIONS[progress.id];
    const isUnlocked = progress.unlocked;
    const percentage = Math.min((progress.current / definition.target) * 100, 100);

    return (
        <div className={`p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'bg-yellow-500/20 border-yellow-400' : 'bg-blue-900/50 border-blue-700'} border-2`}>
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 ${isUnlocked ? 'bg-yellow-400 text-blue-900' : 'bg-blue-800 text-blue-400 grayscale'}`}>
                {definition.icon}
            </div>
            <div className="flex-grow">
                <h4 className={`font-bold text-lg ${isUnlocked ? 'text-yellow-300' : 'text-white'}`}>{definition.name}</h4>
                <p className={`text-sm ${isUnlocked ? 'text-yellow-200' : 'text-blue-300'}`}>{definition.description}</p>
                {!isUnlocked && (
                     <div className="mt-2">
                        <div className="w-full bg-blue-900 rounded-full h-2.5">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className="text-xs text-right text-blue-200 mt-1">{progress.current} / {definition.target}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ user, onGoHome }) => {
    const achievementsList = Object.values(user.achievements).sort((a, b) => {
        if (a.unlocked === b.unlocked) return 0;
        return a.unlocked ? -1 : 1;
    });

    return (
         <div className="w-full max-w-4xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 animate-fade-in">
             <button onClick={onGoHome} className="absolute top-4 left-4 bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors z-20">
                &larr; Volver
            </button>
            <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold mb-2">Mis Logros</h2>
                 <div className="inline-flex items-center justify-center gap-2 mt-2 bg-black/20 px-4 py-2 rounded-full">
                    <StarIcon className="w-8 h-8 text-yellow-400" />
                    <span className="text-2xl font-bold">{user.points}</span>
                    <span className="text-lg text-blue-200">Puntos Totales</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                {achievementsList.map(progress => (
                    <AchievementItem key={progress.id} progress={progress} />
                ))}
            </div>
        </div>
    );
};

export default AchievementsScreen;
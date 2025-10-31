import React from 'react';
import { User, AchievementDefinition } from '../types';
import { StarIcon, ACHIEVEMENT_DEFINITIONS } from '../constants';

interface AchievementsProps {
    user: User;
    onShowAchievements: () => void;
}

const AchievementBadge: React.FC<{ definition: AchievementDefinition }> = ({ definition }) => (
    <div className="flex flex-col items-center text-center">
        <div className="relative">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-yellow-300 shadow-inner">
                {definition.icon}
            </div>
        </div>
        <p className="text-xs mt-1 font-semibold">{definition.name}</p>
    </div>
);


const Achievements: React.FC<AchievementsProps> = ({ user, onShowAchievements }) => {
    const unlockedAchievements = Object.values(user.achievements)
        .filter(a => a.unlocked)
        .map(a => ACHIEVEMENT_DEFINITIONS[a.id]);

    return (
        <button 
            onClick={onShowAchievements}
            className="bg-blue-900/50 rounded-3xl p-6 h-full w-full text-left hover:bg-blue-900/80 transition-colors"
        >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">🏆</span> Logros
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 min-h-[100px]">
                {unlockedAchievements.length > 0 ? (
                    unlockedAchievements.slice(0, 4).map((ach) => (
                        <AchievementBadge key={ach.id} definition={ach} />
                    ))
                ) : (
                    <p className="col-span-4 text-center text-blue-300">¡Sigue jugando para desbloquear logros!</p>
                )}
            </div>
            <div className="flex items-center justify-start gap-2 mt-4">
                <StarIcon className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold">{user.points}</span>
                <span className="text-lg text-blue-200">Puntos</span>
            </div>
        </button>
    );
};

export default Achievements;
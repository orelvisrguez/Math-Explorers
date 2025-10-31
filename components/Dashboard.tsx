import React, { useState, useEffect, useRef } from 'react';
import { GameType, User } from '../types';
import { GAMES_DATA } from '../constants';
import UserProfile from './UserProfile';
import GameButton from './GameButton';
import Achievements from './Achievements';
import ModuleCard from './ModuleCard';
import DailyChallengeCard from './DailyChallengeCard';
import Leaderboard from './Leaderboard';
import StatsCard from './StatsCard';
import LevelUpCelebration from './LevelUpCelebration';

interface DashboardProps {
    user: User;
    onGameSelect: (gameType: GameType) => void;
    onLearningSelect: () => void;
    onShowAchievements: () => void;
}

const RobotIcon = () => (
    <div className="text-6xl">🤖</div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, onGameSelect, onLearningSelect, onShowAchievements }) => {
    const [showLevelUp, setShowLevelUp] = useState(false);
    const prevLevelRef = useRef(user.level);

    useEffect(() => {
        if (user.level > prevLevelRef.current) {
            setShowLevelUp(true);
            const timer = setTimeout(() => {
                setShowLevelUp(false);
            }, 4000); // Auto-cierra después de 4 segundos

            prevLevelRef.current = user.level;
            
            return () => clearTimeout(timer);
        } else {
            prevLevelRef.current = user.level;
        }
    }, [user.level]);

    const handleCloseCelebration = () => {
        setShowLevelUp(false);
    };

    return (
        <>
            {showLevelUp && <LevelUpCelebration newLevel={user.level} onClose={handleCloseCelebration} />}
            <div className="w-full max-w-7xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Math Explorers:</h1>
                        <p className="text-lg md:text-xl text-blue-200">Aventura Matemática para Jóvenes Genios</p>
                    </div>
                    <UserProfile user={user} />
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Content Column (Left on large screens) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <section>
                            <h2 className="text-2xl font-bold text-center mb-6">Elige tu Aventura</h2>
                            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                                {GAMES_DATA.map((game) => (
                                    <GameButton
                                        key={game.id}
                                        game={game}
                                        onClick={() => onGameSelect(game.id)}
                                    />
                                ))}
                            </div>
                        </section>
                        <ModuleCard title="Exploración/Aprendizaje" icon={<RobotIcon />} onClick={onLearningSelect} />
                    </div>
                    
                    {/* Sidebar Column (Right on large screens) */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        <DailyChallengeCard user={user} onGameSelect={onGameSelect} />
                        <StatsCard user={user} />
                        <Achievements user={user} onShowAchievements={onShowAchievements} />
                        <Leaderboard user={user} />
                    </div>

                </main>
            </div>
        </>
    );
};

export default Dashboard;
import React, { useState, useCallback, useEffect } from 'react';
import { GameType, User, AchievementId, ScoreEntry } from './types';
import { ACHIEVEMENT_DEFINITIONS, createNewUser, DAILY_CHALLENGE_BONUS } from './constants';
import Dashboard from './components/Dashboard';
import GameScreen from './components/GameScreen';
import LearningCenter from './components/LearningCenter';
import AchievementsScreen from './components/AchievementsScreen';
import AchievementToast from './components/AchievementToast';
import DailyChallengeToast from './components/DailyChallengeToast';
import LoginScreen from './components/LoginScreen';
import { playSound } from './utils/sound';

const FloatingIsland = ({ className, children }: { className: string, children?: React.ReactNode }) => (
    <div className={`absolute ${className} w-64 h-32`}>
        <div className="absolute bottom-0 w-full h-1/2 bg-green-500 rounded-t-full"></div>
        <div className="absolute top-1/2 w-full h-1/2 bg-stone-500"></div>
        {children}
    </div>
);

const LEVEL_UP_POINTS = 100;

export default function App() {
    const [currentScreen, setCurrentScreen] = useState<'login' | 'dashboard' | 'game' | 'learning' | 'achievements'>('login');
    const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [unlockedAchievement, setUnlockedAchievement] = useState<AchievementId | null>(null);
    const [showChallengeToast, setShowChallengeToast] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`math_explorer_user_${user.name}`, JSON.stringify(user));
        }
    }, [user]);

    const handleLogin = (name: string) => {
        const storedUserData = localStorage.getItem(`math_explorer_user_${name}`);
        let userData: User;
        if (storedUserData) {
            userData = JSON.parse(storedUserData);
        } else {
            userData = createNewUser(name);
        }

        const today = new Date().toISOString().split('T')[0];
        if (userData.lastChallengeDate !== today) {
            const challengeGames = [GameType.SUMA, GameType.RESTA, GameType.DIVISION, GameType.MULTIPLICACION, GameType.SECUENCIAS];
            const randomGame = challengeGames[Math.floor(Math.random() * challengeGames.length)];
            userData.lastChallengeDate = today;
            userData.challengeGame = randomGame;
            userData.challengeCompleted = false;
        }

        setUser(userData);
        setCurrentScreen('dashboard');
    };

    const handleGameSelect = (gameType: GameType) => {
        setSelectedGame(gameType);
        setCurrentScreen('game');
    };
    
    const handleLearningSelect = () => {
        setCurrentScreen('learning');
    };
    
    const handleShowAchievements = () => {
        setCurrentScreen('achievements');
    };

    const handleGoHome = () => {
        setCurrentScreen('dashboard');
        setSelectedGame(null);
    };

    const handleStreakUpdate = useCallback((streak: number) => {
        setUser(prevUser => {
            if (!prevUser) return null;

            const streakAchievement = prevUser.achievements['PERFECT_STREAK_5'];
            if (streakAchievement.unlocked) {
                return prevUser;
            }

            const newAchievements = { ...prevUser.achievements };
            const newStreakAchievement = { ...streakAchievement };
            
            newStreakAchievement.current = Math.max(newStreakAchievement.current, streak);

            let newAchievementUnlocked: AchievementId | null = null;
            
            if (newStreakAchievement.current >= ACHIEVEMENT_DEFINITIONS['PERFECT_STREAK_5'].target) {
                newStreakAchievement.unlocked = true;
                newAchievementUnlocked = 'PERFECT_STREAK_5';
            }

            newAchievements['PERFECT_STREAK_5'] = newStreakAchievement;
            
            if (newAchievementUnlocked) {
                playSound('achievement.mp3');
                setUnlockedAchievement(newAchievementUnlocked);
                setTimeout(() => setUnlockedAchievement(null), 4000);
            }

            return { ...prevUser, achievements: newAchievements };
        });
    }, []);

    const handleGameEnd = useCallback((gameType: GameType, finalScore: number, win: boolean) => {
        setUser(prevUser => {
            if (!prevUser) return null;

            // --- Leaderboard Logic ---
            if (finalScore > 0) {
                 const leaderboardKey = 'math_explorer_leaderboard';
                 const rawLeaderboard = localStorage.getItem(leaderboardKey);
                 let leaderboard: ScoreEntry[] = rawLeaderboard ? JSON.parse(rawLeaderboard) : [];
                 
                 const playerIndex = leaderboard.findIndex(entry => entry.playerName === prevUser.name);

                 if (playerIndex > -1) {
                     // Player exists, update score only if it's higher
                     if (finalScore > leaderboard[playerIndex].score) {
                         leaderboard[playerIndex].score = finalScore;
                     }
                 } else {
                     // New player, add to leaderboard
                     leaderboard.push({ playerName: prevUser.name, score: finalScore });
                 }

                 leaderboard.sort((a, b) => b.score - a.score);
                 
                 const updatedLeaderboard = leaderboard.slice(0, 20); // Keep top 20 scores
                 localStorage.setItem(leaderboardKey, JSON.stringify(updatedLeaderboard));
            }
            // --- End Leaderboard Logic ---


            let totalPoints = prevUser.points + finalScore;
            
            const newUser: User = { ...prevUser };

            if (win && gameType === prevUser.challengeGame && !prevUser.challengeCompleted) {
                totalPoints += DAILY_CHALLENGE_BONUS;
                newUser.challengeCompleted = true;
                setShowChallengeToast(true);
                setTimeout(() => setShowChallengeToast(false), 4000);
            }

            const oldLevel = prevUser.level;
            newUser.points = totalPoints;
            newUser.level = Math.floor(totalPoints / LEVEL_UP_POINTS) + 1;
            newUser.progress = totalPoints % LEVEL_UP_POINTS;

            // Update stats
            newUser.gamesPlayed = (prevUser.gamesPlayed || 0) + 1;
            newUser.wins = (prevUser.wins || 0) + (win ? 1 : 0);
            newUser.losses = (prevUser.losses || 0) + (win ? 0 : 1);


            if (newUser.level > oldLevel) {
                playSound('level-up.mp3');
            }
            
            const newAchievements = { ...newUser.achievements };
            let newAchievementUnlocked: AchievementId | null = null;
            
            const pointsAch = newAchievements['HIGH_SCORE_100'];
            if (!pointsAch.unlocked) {
                pointsAch.current = newUser.points;
                if (pointsAch.current >= ACHIEVEMENT_DEFINITIONS['HIGH_SCORE_100'].target) {
                    pointsAch.unlocked = true;
                    newAchievementUnlocked = 'HIGH_SCORE_100';
                }
            }

            if (win) {
                if (gameType === GameType.SUMA) {
                    const win1 = newAchievements['SUMA_WINS_1'];
                    if (!win1.unlocked) {
                        win1.current += 1;
                        if (win1.current >= ACHIEVEMENT_DEFINITIONS['SUMA_WINS_1'].target) {
                            win1.unlocked = true;
                            newAchievementUnlocked = 'SUMA_WINS_1';
                        }
                    }
                    const win5 = newAchievements['SUMA_WINS_5'];
                     if (!win5.unlocked) {
                        win5.current += 1;
                        if (win5.current >= ACHIEVEMENT_DEFINITIONS['SUMA_WINS_5'].target) {
                            win5.unlocked = true;
                            newAchievementUnlocked = 'SUMA_WINS_5';
                        }
                    }
                } else if (gameType === GameType.RESTA) {
                     const win1 = newAchievements['RESTA_WINS_1'];
                    if (!win1.unlocked) {
                        win1.current += 1;
                        if (win1.current >= ACHIEVEMENT_DEFINITIONS['RESTA_WINS_1'].target) {
                            win1.unlocked = true;
                            newAchievementUnlocked = 'RESTA_WINS_1';
                        }
                    }
                    const win5 = newAchievements['RESTA_WINS_5'];
                     if (!win5.unlocked) {
                        win5.current += 1;
                        if (win5.current >= ACHIEVEMENT_DEFINITIONS['RESTA_WINS_5'].target) {
                            win5.unlocked = true;
                            newAchievementUnlocked = 'RESTA_WINS_5';
                        }
                    }
                } else if (gameType === GameType.MULTIPLICACION) {
                    const win1 = newAchievements['MULTIPLICACION_WINS_1'];
                    if (!win1.unlocked) {
                        win1.current += 1;
                        if (win1.current >= ACHIEVEMENT_DEFINITIONS['MULTIPLICACION_WINS_1'].target) {
                            win1.unlocked = true;
                            newAchievementUnlocked = 'MULTIPLICACION_WINS_1';
                        }
                    }
                    const win5 = newAchievements['MULTIPLICACION_WINS_5'];
                    if (!win5.unlocked) {
                        win5.current += 1;
                        if (win5.current >= ACHIEVEMENT_DEFINITIONS['MULTIPLICACION_WINS_5'].target) {
                            win5.unlocked = true;
                            newAchievementUnlocked = 'MULTIPLICACION_WINS_5';
                        }
                    }
                } else if (gameType === GameType.SECUENCIAS) {
                    const win1 = newAchievements['SECUENCIAS_WINS_1'];
                    if (!win1.unlocked) {
                        win1.current += 1;
                        if (win1.current >= ACHIEVEMENT_DEFINITIONS['SECUENCIAS_WINS_1'].target) {
                            win1.unlocked = true;
                            newAchievementUnlocked = 'SECUENCIAS_WINS_1';
                        }
                    }
                    const win5 = newAchievements['SECUENCIAS_WINS_5'];
                    if (!win5.unlocked) {
                        win5.current += 1;
                        if (win5.current >= ACHIEVEMENT_DEFINITIONS['SECUENCIAS_WINS_5'].target) {
                            win5.unlocked = true;
                            newAchievementUnlocked = 'SECUENCIAS_WINS_5';
                        }
                    }
                }
            }

            if (newAchievementUnlocked) {
                playSound('achievement.mp3');
                setUnlockedAchievement(newAchievementUnlocked);
                setTimeout(() => setUnlockedAchievement(null), 4000);
            }

            newUser.achievements = newAchievements;
            return newUser;
        });
        handleGoHome();
    }, []);

    const renderScreen = () => {
        if (!user) {
             return <LoginScreen onLogin={handleLogin} />;
        }

        switch (currentScreen) {
            case 'game':
                return selectedGame ? <GameScreen gameType={selectedGame} onGoHome={handleGoHome} onGameEnd={handleGameEnd} onStreakUpdate={handleStreakUpdate} /> : null;
            case 'learning':
                return <LearningCenter onGoHome={handleGoHome} onGameSelect={handleGameSelect} />;
            case 'achievements':
                return <AchievementsScreen user={user} onGoHome={handleGoHome} />;
            case 'dashboard':
            default:
                return <Dashboard user={user} onGameSelect={handleGameSelect} onLearningSelect={handleLearningSelect} onShowAchievements={handleShowAchievements} />;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 text-white font-sans overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-800 bg-opacity-40">
                {/* Decorative floating islands */}
                <FloatingIsland className="-top-10 -left-20 transform rotate-[-15deg] opacity-50" />
                <FloatingIsland className="top-1/4 -right-20 transform rotate-[10deg] opacity-50" />
                <FloatingIsland className="bottom-10 -left-10 transform rotate-[5deg] opacity-50" />
                 <FloatingIsland className="bottom-1/4 -right-32 transform rotate-[-5deg] opacity-50 hidden md:block" />
            </div>

            {unlockedAchievement && (
                <AchievementToast achievement={ACHIEVEMENT_DEFINITIONS[unlockedAchievement]} />
            )}
            {/* Fix: Corrected typo in constant name */}
            {showChallengeToast && <DailyChallengeToast bonus={DAILY_CHALLENGE_BONUS} />}

            <main className="relative z-10 p-4 sm:p-6 md:p-8 min-h-screen flex items-center justify-center">
               {renderScreen()}
            </main>
        </div>
    );
}
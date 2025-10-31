import React from 'react';
import { GameType, User, AchievementDefinition, GameInfo, LearningTopic, LearningModuleInfo, AchievementId, AchievementsState } from './types';

// Icons
const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
);

const ShieldIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a12.02 12.02 0 009 2.056c4.502 0 8.29-2.822 9.47-6.944a12.02 12.02 0 00-1.852-9.016z" />
    </svg>
);

const TrophyIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 21.945V13H20.945A9.001 9.001 0 0113 21.945z" />
    </svg>
);

const MedalIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
     <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a9 9 0 11-9 9 9 9 0 019-9z" />
    </svg>
);

const SunIcon = () => (
    <div className="relative w-16 h-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-300 rounded-full"></div>
         <span className="absolute text-yellow-500 font-bold text-3xl" style={{ top: '22%', left: '10%'}}>+</span>
        <span className="absolute text-yellow-500 font-bold text-3xl" style={{ top: '22%', right: '10%'}}>+</span>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl">😊</div>
        </div>
    </div>
);

const MonsterIcon = () => (
     <div className="relative w-16 h-16 flex items-center justify-center text-5xl">
        <span className="absolute text-teal-500 font-bold text-3xl" style={{ top: '25%', left: '10%'}}>-</span>
        <span role="img" aria-label="monster">👾</span>
    </div>
);

const PlanetIcon = () => (
    <div className="relative w-16 h-16 flex items-center justify-center text-4xl">
         <span className="absolute text-purple-400 font-bold text-3xl" style={{ top: '25%', left: '10%'}}>÷</span>
         <span className="absolute text-purple-400 font-bold text-3xl" style={{ top: '25%', right: '10%'}}>×</span>
        <span role="img" aria-label="planet">🪐</span>
    </div>
);

const MagicTableIcon = () => (
    <div className="relative w-16 h-16 flex items-center justify-center text-5xl">
        <span role="img" aria-label="crystal ball">🔮</span>
        <span className="absolute text-yellow-300 font-bold text-3xl" style={{ top: '35%', left: '50%', transform: 'translate(-50%, -50%)' }}>×</span>
    </div>
);

const SequenceIcon = () => (
    <div className="relative w-16 h-16 flex items-center justify-center text-4xl font-mono text-cyan-300">
        1₂₃...
    </div>
);

// --- NEW ACHIEVEMENT SYSTEM ---
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, AchievementDefinition> = {
    'SUMA_WINS_1': { id: 'SUMA_WINS_1', name: 'Aprendiz de Suma', description: 'Gana tu primera partida de Suma Veloz', icon: <StarIcon className="w-8 h-8"/>, target: 1 },
    'SUMA_WINS_5': { id: 'SUMA_WINS_5', name: 'Campeón de Suma', description: 'Gana 5 partidas de Suma Veloz', icon: <ShieldIcon />, target: 5 },
    'RESTA_WINS_1': { id: 'RESTA_WINS_1', name: 'Cazador de Monstruos', description: 'Gana tu primera partida de Resta el Monstruo', icon: <StarIcon className="w-8 h-8"/>, target: 1 },
    'RESTA_WINS_5': { id: 'RESTA_WINS_5', name: 'Exterminador', description: 'Gana 5 partidas de Resta el Monstruo', icon: <TrophyIcon />, target: 5 },
    'HIGH_SCORE_100': { id: 'HIGH_SCORE_100', name: 'Cien Puntos', description: 'Alcanza una puntuación total de 100', icon: <MedalIcon />, target: 100 },
    'PERFECT_STREAK_5': { id: 'PERFECT_STREAK_5', name: 'Racha Impecable', description: 'Consigue 5 respuestas correctas seguidas', icon: <TrophyIcon />, target: 5 },
    'MULTIPLICACION_WINS_1': { id: 'MULTIPLICACION_WINS_1', name: 'Mago Principiante', description: 'Gana tu primera partida de Tablas Mágicas', icon: <StarIcon className="w-8 h-8"/>, target: 1 },
    'MULTIPLICACION_WINS_5': { id: 'MULTIPLICACION_WINS_5', name: 'Archimago Matemático', description: 'Gana 5 partidas de Tablas Mágicas', icon: <ShieldIcon />, target: 5 },
    'SECUENCIAS_WINS_1': { id: 'SECUENCIAS_WINS_1', name: 'Descifrador de Códigos', description: 'Gana tu primera partida de Secuencias Secretas', icon: <StarIcon className="w-8 h-8"/>, target: 1 },
    'SECUENCIAS_WINS_5': { id: 'SECUENCIAS_WINS_5', name: 'Maestro de Patrones', description: 'Gana 5 partidas de Secuencias Secretas', icon: <TrophyIcon />, target: 5 },
};

export const DAILY_CHALLENGE_BONUS = 25;

// --- USER CREATION ---
export const createNewUser = (name: string): User => {
    const initialAchievementsState: AchievementsState = Object.keys(ACHIEVEMENT_DEFINITIONS).reduce((acc, key) => {
        const id = key as AchievementId;
        acc[id] = { id, current: 0, unlocked: false };
        return acc;
    }, {} as AchievementsState);

    return {
        name: name,
        avatarUrl: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(name)}`,
        level: 1,
        progress: 0,
        points: 0,
        achievements: initialAchievementsState,
        lastChallengeDate: '',
        challengeGame: null,
        challengeCompleted: false,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
    };
};


export const GAMES_DATA: GameInfo[] = [
    { id: GameType.SUMA, title: 'Suma Veloz', color: 'bg-gradient-to-br from-yellow-400 to-orange-500', icon: <SunIcon /> },
    { id: GameType.RESTA, title: 'Resta el Monstruo', color: 'bg-gradient-to-br from-cyan-400 to-teal-500', icon: <MonsterIcon /> },
    { id: GameType.DIVISION, title: 'División Galáctica', color: 'bg-gradient-to-br from-purple-500 to-indigo-600', icon: <PlanetIcon /> },
    { id: GameType.MULTIPLICACION, title: 'Tablas Mágicas', color: 'bg-gradient-to-br from-pink-500 to-rose-600', icon: <MagicTableIcon /> },
    { id: GameType.SECUENCIAS, title: 'Secuencias Secretas', color: 'bg-gradient-to-br from-lime-400 to-green-600', icon: <SequenceIcon /> },
];

export const LEARNING_MODULES_DATA: LearningModuleInfo[] = [
    { id: LearningTopic.SUMA, game: GameType.SUMA, icon: <SunIcon /> },
    { id: LearningTopic.RESTA, game: GameType.RESTA, icon: <MonsterIcon /> }
];


export { StarIcon };
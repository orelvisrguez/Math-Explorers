export enum GameType {
    SUMA = 'Suma Veloz',
    RESTA = 'Resta el Monstruo',
    DIVISION = 'División Galáctica',
    MULTIPLICACION = 'Tablas Mágicas',
    SECUENCIAS = 'Secuencias Secretas'
}

export enum LearningTopic {
    SUMA = 'Aprendiendo a Sumar',
    RESTA = 'El Secreto de la Resta'
}

export type Difficulty = 'fácil' | 'medio' | 'difícil';

export type AchievementId = 
    'SUMA_WINS_1' | 'SUMA_WINS_5' | 
    'RESTA_WINS_1' | 'RESTA_WINS_5' | 
    'HIGH_SCORE_100' | 'PERFECT_STREAK_5' |
    'MULTIPLICACION_WINS_1' | 'MULTIPLICACION_WINS_5' |
    'SECUENCIAS_WINS_1' | 'SECUENCIAS_WINS_5';

export interface AchievementDefinition {
    id: AchievementId;
    name: string;
    description: string;
    icon: React.ReactNode;
    target: number; // e.g., 5 wins, 100 points
}

export interface AchievementProgress {
    id: AchievementId;
    current: number;
    unlocked: boolean;
}

export type AchievementsState = Record<AchievementId, AchievementProgress>;


export interface User {
    name: string;
    avatarUrl: string;
    level: number;
    progress: number;
    points: number;
    achievements: AchievementsState;
    lastChallengeDate: string;
    challengeGame: GameType | null;
    challengeCompleted: boolean;
    gamesPlayed: number;
    wins: number;
    losses: number;
}

export interface Achievement {
    id: string;
    name: string;
    icon: React.ReactNode;
    count?: number;
}

export interface GameInfo {
    id: GameType;
    title: string;
    color: string;
    icon: React.ReactNode;
}

export interface LearningModuleInfo {
    id: LearningTopic;
    game: GameType;
    icon: React.ReactNode;
}

export interface ScoreEntry {
    playerName: string;
    score: number;
}
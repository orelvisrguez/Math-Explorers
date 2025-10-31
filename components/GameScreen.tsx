import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameType, Difficulty } from '../types';
import { playSound } from '../utils/sound';

interface GameScreenProps {
    gameType: GameType;
    onGoHome: () => void;
    onGameEnd: (gameType: GameType, score: number, win: boolean) => void;
    onStreakUpdate: (streak: number) => void;
}

interface Problem {
    question: string;
    answer: number;
}

interface SavedGameState {
    difficulty: Difficulty;
    score: number;
    streak: number;
    timeLeft: number;
    problem: Problem;
    options: number[];
}


const DIFFICULTY_LEVELS: Record<Difficulty, { range: number, timeLimit: number }> = {
    fácil: { range: 10, timeLimit: 20 },
    medio: { range: 25, timeLimit: 15 },
    difícil: { range: 50, timeLimit: 10 },
};

const WIN_SCORE = 50;
const MONSTERS = ['👾', '👹', '👻', '👽', '💀', '👺', '🤖', '🤡'];

const generateProblem = (gameType: GameType, difficulty: Difficulty): Problem => {
    const { range } = DIFFICULTY_LEVELS[difficulty];
    let num1 = 0, num2 = 0, answer = 0, question = '';

    switch (gameType) {
        case GameType.SUMA:
            num1 = Math.floor(Math.random() * range) + 1;
            num2 = Math.floor(Math.random() * range) + 1;
            answer = num1 + num2;
            question = `${num1} + ${num2}`;
            break;
        case GameType.RESTA:
            num1 = Math.floor(Math.random() * range) + 5;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            answer = num1 - num2;
            question = `${num1} - ${num2}`;
            break;
        case GameType.DIVISION:
            answer = Math.floor(Math.random() * (range / 4)) + 2;
            num2 = Math.floor(Math.random() * (range / 4)) + 2;
            num1 = answer * num2;
            question = `${num1} ÷ ${num2}`;
            break;
        case GameType.MULTIPLICACION:
            const multiRange = difficulty === 'fácil' ? 5 : difficulty === 'medio' ? 10 : 12;
            num1 = Math.floor(Math.random() * multiRange) + 1;
            num2 = Math.floor(Math.random() * multiRange) + 1;
            answer = num1 * num2;
            question = `${num1} × ${num2}`;
            break;
        case GameType.SECUENCIAS:
            let start, step;
            let sequence: number[];

            if (difficulty === 'difícil' && Math.random() > 0.5) { // 50% chance of backward sequence
                step = Math.floor(Math.random() * 5) + 2;
                start = Math.floor(Math.random() * (range / 2)) + (step * 3);
                sequence = [start, start - step, start - step * 2];
                answer = start - step * 3;
            } else { // Forward sequence
                step = difficulty === 'fácil' ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 5) + 2;
                start = Math.floor(Math.random() * (range / 2)) + 1;
                sequence = [start, start + step, start + step * 2];
                answer = start + step * 3;
            }
            question = `${sequence.join(', ')}, __?`;
            break;
        default:
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 + num2;
            question = `${num1} + ${num2}`;
            break;
    }
    return { question, answer };
};


const GameScreen: React.FC<GameScreenProps> = ({ gameType, onGoHome, onGameEnd, onStreakUpdate }) => {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [problem, setProblem] = useState<Problem | null>(null);
    const [options, setOptions] = useState<number[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isScoreAnimating, setIsScoreAnimating] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [monster, setMonster] = useState(MONSTERS[0]);
    const [monsterState, setMonsterState] = useState<'idle' | 'hit' | 'defeated' | 'dodged'>('idle');
    const [gameState, setGameState] = useState<'playing' | 'won' | 'over'>('playing');
    const [promptResume, setPromptResume] = useState<boolean | null>(null);

    const timerRef = useRef<number | null>(null);
    const sessionKey = `math_explorer_game_session_${gameType}`;

    useEffect(() => {
        const savedSession = localStorage.getItem(sessionKey);
        if (savedSession) {
            setPromptResume(true);
        } else {
            setPromptResume(false);
        }
    }, [sessionKey]);

    useEffect(() => {
        if (gameState === 'playing' && difficulty && problem && promptResume === false) {
            const stateToSave: SavedGameState = { difficulty, score, streak, timeLeft, problem, options };
            localStorage.setItem(sessionKey, JSON.stringify(stateToSave));
        }
    }, [score, streak, problem, timeLeft, difficulty, gameState, options, sessionKey, promptResume]);


    const handleExit = useCallback(() => {
        playSound('click.mp3');
        localStorage.removeItem(sessionKey);
        onGameEnd(gameType, score, score >= WIN_SCORE);
    }, [gameType, score, onGameEnd, sessionKey]);

    const generateOptions = useCallback((correctAnswer: number, difficulty: Difficulty, gameType: GameType): number[] => {
        const optionsSet = new Set<number>([correctAnswer]);
        const { range } = DIFFICULTY_LEVELS[difficulty];
        
        const multiRange = difficulty === 'fácil' ? 5 : difficulty === 'medio' ? 10 : 12;
        const maxVal = (gameType === GameType.SUMA) ? range * 2 : 
                       (gameType === GameType.MULTIPLICACION) ? multiRange * multiRange : 
                       correctAnswer + range;

        while (optionsSet.size < 4) {
            let distractor;
             if (gameType === GameType.SECUENCIAS) {
                distractor = correctAnswer + (Math.floor(Math.random() * 10) - 5);
            } else {
                distractor = Math.floor(Math.random() * (maxVal + 5));
            }

            if (distractor >= 0 && distractor !== correctAnswer) {
                optionsSet.add(distractor);
            }
        }
        
        return Array.from(optionsSet).sort(() => Math.random() - 0.5);
    }, []);

    const newProblem = useCallback(() => {
        if (!difficulty || gameState !== 'playing') return;
        if (timerRef.current) clearTimeout(timerRef.current);
        
        if (gameType === GameType.RESTA) {
            const newMonster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
            setMonster(newMonster);
            setMonsterState('idle');
        }

        const newP = generateProblem(gameType, difficulty);
        setProblem(newP);
        setOptions(generateOptions(newP.answer, difficulty, gameType));
        setSelectedAnswer(null);
        setFeedback(null);
        setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    }, [gameType, difficulty, generateOptions, gameState]);

    const handleDifficultySelect = (level: Difficulty) => {
        playSound('click.mp3');
        setDifficulty(level);
        setScore(0);
        setStreak(0);
    };

    useEffect(() => {
        if (difficulty && promptResume === false) {
            newProblem();
        }
    }, [difficulty, newProblem, promptResume]);

    useEffect(() => {
        if (difficulty && timeLeft > 0 && !feedback && gameState === 'playing') {
            timerRef.current = window.setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (difficulty && problem && timeLeft === 0 && !feedback) {
            playSound('incorrect.mp3');
            setFeedback('incorrect');
            setMonsterState('dodged');
            setStreak(0);
            if (timerRef.current) clearTimeout(timerRef.current);
            setTimeout(newProblem, 2000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [timeLeft, feedback, difficulty, problem, newProblem, gameState]);

    const handleAnswerClick = (selected: number) => {
        playSound('click.mp3');
        if (!problem || feedback || gameState !== 'playing') return;
        if (timerRef.current) clearTimeout(timerRef.current);
        
        setSelectedAnswer(selected);

        if (selected === problem.answer) {
            playSound('correct.mp3');
            setFeedback('correct');
            const newScore = score + 10;
            const newStreak = streak + 1;
            setScore(newScore);
            setStreak(newStreak);
            onStreakUpdate(newStreak);
            setIsScoreAnimating(true);
            setMonsterState('hit');

            if (newScore >= WIN_SCORE) {
                playSound('game-win.mp3');
                setGameState('won');
                // We can't use handleExit here due to stale 'score' state in the closure.
                // Call onGameEnd directly with the correct final score and win status.
                setTimeout(() => {
                    localStorage.removeItem(sessionKey);
                    onGameEnd(gameType, newScore, true);
                }, 3000);
            } else {
                 setTimeout(() => {
                    setMonsterState('defeated');
                }, 300);
                setTimeout(newProblem, 1500);
            }
           
        } else {
            playSound('incorrect.mp3');
            setFeedback('incorrect');
            setMonsterState('dodged');
            setStreak(0);
            setTimeout(newProblem, 2000);
        }
    };
    
    const handleResume = () => {
        playSound('click.mp3');
        const savedSession = localStorage.getItem(sessionKey);
        if (savedSession) {
            const savedState: SavedGameState = JSON.parse(savedSession);
            setDifficulty(savedState.difficulty);
            setScore(savedState.score);
            setStreak(savedState.streak);
            setTimeLeft(savedState.timeLeft);
            setProblem(savedState.problem);
            setOptions(savedState.options);
            setPromptResume(false);
        }
    };

    const handleStartNew = () => {
        playSound('click.mp3');
        localStorage.removeItem(sessionKey);
        setPromptResume(false);
    };

    let problemBoxClasses = '';
    if (feedback === 'correct') {
        problemBoxClasses = 'bg-green-500/80 ring-green-300 animate-pulse-grow';
    } else if (feedback === 'incorrect') {
        problemBoxClasses = 'bg-red-500/80 ring-red-300 animate-shake';
    } else {
        problemBoxClasses = 'bg-blue-900/50 ring-blue-500';
    }

    let monsterAnimationClass = '';
    switch (monsterState) {
        case 'hit':
            monsterAnimationClass = 'animate-monster-hit';
            break;
        case 'defeated':
            monsterAnimationClass = 'transform scale-0 opacity-0 rotate-180';
            break;
        case 'dodged':
            monsterAnimationClass = 'animate-shake';
            break;
    }

    const DifficultyMeter: React.FC<{ level: Difficulty }> = ({ level }) => {
        const bars = [
            { height: 'h-2', filled: true },
            { height: 'h-4', filled: level === 'medio' || level === 'difícil' },
            { height: 'h-6', filled: level === 'difícil' }
        ];
        return (
            <div className="flex items-end gap-1.5 h-6 mt-2">
                {bars.map((bar, index) => (
                    <div
                        key={index}
                        className={`w-4 rounded-t-sm transition-all duration-300 ${bar.height} ${bar.filled ? 'bg-white' : 'bg-white/30'}`}
                    ></div>
                ))}
            </div>
        );
    };

    const DifficultyButton: React.FC<{ level: Difficulty, color: string, label: string }> = ({ level, color, label }) => (
        <button 
            onClick={() => handleDifficultySelect(level)}
            className={`w-48 h-48 rounded-full ${color} text-white flex flex-col items-center justify-center font-bold text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-8 border-white/50`}
        >
            <div className="text-5xl mb-1">{level === 'fácil' ? '😊' : level === 'medio' ? '🤔' : '🔥'}</div>
            {label}
            <DifficultyMeter level={level} />
        </button>
    );

    if (gameState === 'won') {
        return (
            <div className="w-full max-w-2xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center flex flex-col items-center justify-center">
                <div className="text-8xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-5xl font-extrabold text-yellow-300">¡Partida Ganada!</h2>
                <p className="text-2xl mt-4">¡Conseguiste {score} puntos!</p>
                <p className="text-lg mt-2 text-blue-200">Volviendo al menú principal...</p>
            </div>
        );
    }
    
    if (promptResume === null) {
        return (
             <div className="w-full max-w-2xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center">
                 <p className="text-xl text-blue-200">Cargando...</p>
             </div>
        )
    }

    if (promptResume) {
        return (
            <div className="w-full max-w-2xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center">
                <h2 className="text-4xl font-extrabold mb-2">¡Bienvenido de vuelta!</h2>
                <p className="text-xl text-blue-200 mb-8">Tienes una partida en curso. ¿Qué quieres hacer?</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button onClick={handleResume} className="w-full sm:w-auto bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white/50">
                        Reanudar Partida
                    </button>
                    <button onClick={handleStartNew} className="w-full sm:w-auto bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white/50">
                        Empezar de Nuevo
                    </button>
                </div>
                 <button onClick={onGoHome} className="mt-8 text-yellow-300 hover:text-yellow-200">
                    Volver al menú principal
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center">
             <button onClick={handleExit} className="absolute top-4 left-4 bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors z-20">
                &larr; Salir
            </button>
            <h2 className="text-4xl font-extrabold mb-2">{gameType}</h2>
            
            {!difficulty ? (
                <div>
                    <p className="text-xl text-blue-200 mb-8">Elige una dificultad para empezar</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <DifficultyButton level="fácil" color="bg-gradient-to-br from-green-400 to-emerald-500" label="Fácil" />
                        <DifficultyButton level="medio" color="bg-gradient-to-br from-yellow-400 to-orange-500" label="Medio" />
                        <DifficultyButton level="difícil" color="bg-gradient-to-br from-red-500 to-rose-600" label="Difícil" />
                    </div>
                </div>
            ) : !problem ? (
                <p className="text-xl text-blue-200">Cargando problema...</p>
            ) : (
                <>
                    <div className="flex items-center gap-4 w-full mb-6">
                        <span className="text-2xl" role="img" aria-label="timer">⏰</span>
                        <div className="flex-grow bg-blue-900 rounded-full h-4">
                            <div 
                                className="bg-yellow-400 h-4 rounded-full transition-[width] duration-1000 linear" 
                                style={{ width: `${(timeLeft / DIFFICULTY_LEVELS[difficulty].timeLimit) * 100}%` }}>
                            </div>
                        </div>
                        <span className="text-xl font-bold w-12 text-right">{timeLeft}s</span>
                    </div>

                    {gameType === GameType.RESTA && (
                        <div className="relative h-24">
                            <div className={`absolute inset-0 flex items-center justify-center text-7xl transition-all duration-500 ${monsterAnimationClass}`}>
                                {monster}
                            </div>
                        </div>
                    )}

                    <div className={`transition-all duration-300 w-full max-w-sm mx-auto p-8 rounded-2xl mb-4 ring-4 ${problemBoxClasses}`}>
                        <p className={`${gameType === GameType.SECUENCIAS ? 'text-5xl' : 'text-6xl'} font-bold tracking-widest`}>
                            {problem.question}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md mx-auto">
                        {options.map((option) => {
                            let classes = 'p-4 rounded-xl text-3xl font-bold transition-all duration-300 transform';

                            if (!feedback) {
                                classes += ' bg-blue-600 hover:bg-blue-500 hover:scale-105';
                            } else {
                                if (feedback === 'correct') {
                                    if (option === problem.answer) {
                                        classes += ' bg-green-500 ring-4 ring-white/50 scale-110 animate-pulse-grow';
                                    } else {
                                        classes += ' bg-gray-600/50 opacity-50 scale-90';
                                    }
                                } else { // feedback === 'incorrect'
                                    if (option === selectedAnswer) {
                                        classes += ' bg-red-500 ring-4 ring-white/50 scale-110 animate-shake';
                                    } else if (option === problem.answer) {
                                        classes += ' bg-green-500 ring-4 ring-green-300 scale-105';
                                    } else {
                                        classes += ' bg-gray-600/50 opacity-50 scale-90';
                                    }
                                }
                            }

                            return (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerClick(option)}
                                    disabled={!!feedback}
                                    className={classes}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-8">
                        <div className="text-2xl font-bold">
                            Puntuación: <span 
                                className={`inline-block text-yellow-400 ${isScoreAnimating ? 'animate-score-bounce' : ''}`}
                                onAnimationEnd={() => setIsScoreAnimating(false)}
                            >{score}</span>
                        </div>
                         {streak > 1 && (
                            <div className="text-2xl font-bold text-orange-400 animate-pulse-grow">
                                🔥 Racha x{streak}
                            </div>
                        )}
                    </div>


                    <div className="relative mt-4 text-2xl font-bold" style={{ minHeight: '40px' }}>
                        {feedback === 'correct' && (
                            <div className="animate-celebrate-pop absolute inset-0 flex items-center justify-center">
                                <span className="text-green-300 font-extrabold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {gameType === GameType.RESTA ? '¡Monstruo Derrotado!' : '¡Correcto!'} +10
                                </span>
                            </div>
                        )}
                        {feedback === 'incorrect' && timeLeft > 0 && (
                            <span className="text-red-300">{gameType === GameType.RESTA ? '¡El monstruo esquivó!' : '¡Inténtalo de nuevo!'}</span>
                        )}
                        {feedback === 'incorrect' && timeLeft === 0 && (
                            <span className="text-orange-400">¡Se acabó el tiempo!</span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameScreen;
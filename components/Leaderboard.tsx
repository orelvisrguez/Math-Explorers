import React, { useState, useEffect } from 'react';
import { ScoreEntry } from '../types';

const Leaderboard: React.FC = () => {
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        const rawLeaderboard = localStorage.getItem('math_explorer_leaderboard');
        if (rawLeaderboard) {
            setScores(JSON.parse(rawLeaderboard));
        }
    }, []);

    const getMedal = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return <span className="font-bold text-blue-300">{index + 1}</span>;
    };

    return (
        <div className="bg-blue-900/50 rounded-3xl p-6 h-full w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-yellow-400">📊</span> Tabla de Puntuación
            </h3>
            {scores.length > 0 ? (
                <ul className="space-y-2">
                    {scores.slice(0, 5).map((entry, index) => (
                        <li key={index} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl w-8 text-center">{getMedal(index)}</span>
                                <span className="font-semibold text-white truncate">{entry.playerName}</span>
                            </div>
                            <span className="font-bold text-yellow-300">{entry.score} pts</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full text-center">
                    <p className="text-blue-300">¡Juega una partida para aparecer en el ranking!</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
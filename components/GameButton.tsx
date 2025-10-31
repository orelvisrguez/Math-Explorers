
import React from 'react';
import { GameInfo } from '../types';

interface GameButtonProps {
    game: GameInfo;
    onClick: () => void;
}

const GameButton: React.FC<GameButtonProps> = ({ game, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0 rounded-full ${game.color} text-white flex flex-col items-center justify-center p-4 text-center font-bold text-xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-8 border-white/50`}
        >
            <div className="absolute -top-4 -translate-y-1/2 w-24 h-24 flex items-center justify-center">{game.icon}</div>
            <span className="mt-16">{game.title}</span>
        </button>
    );
};

export default GameButton;

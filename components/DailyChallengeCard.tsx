import React from 'react';
import { User, GameType } from '../types';
import { GAMES_DATA, DAILY_CHALLENGE_BONUS } from '../constants';

interface DailyChallengeCardProps {
    user: User;
    onGameSelect: (gameType: GameType) => void;
}

const TargetIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 116 0 3 3 0 01-6 0z" />
    </svg>
);

const CheckIcon = () => (
     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ user, onGameSelect }) => {
    const { challengeGame, challengeCompleted } = user;

    if (!challengeGame) {
        return (
             <div className="bg-blue-900/50 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center">
                <p className="text-blue-300">Cargando Reto Diario...</p>
            </div>
        );
    }
    
    const gameInfo = GAMES_DATA.find(g => g.id === challengeGame);

    return (
        <div className={`rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-500 ${challengeCompleted ? 'bg-green-800/60 border-2 border-green-400' : 'bg-blue-900/50'}`}>
            <div>
                 <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span className="text-orange-400"><TargetIcon /></span> Reto Diario
                </h3>
                {challengeCompleted ? (
                    <div className="text-center py-8">
                        <div className="text-green-300 mx-auto animate-bounce"><CheckIcon/></div>
                        <p className="text-2xl font-bold mt-2 text-green-200">¡Completado!</p>
                        <p className="text-md text-green-300">¡Vuelve mañana por más!</p>
                    </div>
                ) : (
                    <>
                        <p className="text-lg text-blue-200">Gana una partida de:</p>
                        <p className="text-2xl font-extrabold text-yellow-300 my-2">{gameInfo?.title}</p>
                        <p className="font-bold text-green-400 text-lg">+{DAILY_CHALLENGE_BONUS} Puntos Extra</p>
                    </>
                )}
            </div>
             <button
                disabled={challengeCompleted}
                onClick={() => onGameSelect(challengeGame)}
                className="w-full mt-4 bg-gradient-to-br from-orange-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:from-gray-600 disabled:to-gray-700"
            >
                {challengeCompleted ? 'Conseguido' : '¡Aceptar Reto!'}
            </button>
        </div>
    );
};

export default DailyChallengeCard;
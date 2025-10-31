import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { StarIcon } from '../constants';

interface StatsCardProps {
    user: User;
}

const GamepadIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17l5-5m0 0l-5-5m5 5H2"></path></svg>
);

const ChartBarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
);

const CheckCircleIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const XCircleIcon = () => (
     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const StatItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number, iconColorClass?: string, isAnimating?: boolean }> = ({ icon, label, value, iconColorClass = 'text-yellow-300', isAnimating = false }) => (
    <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
        <div className={`w-10 h-10 flex-shrink-0 bg-blue-800 rounded-md flex items-center justify-center ${iconColorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-blue-200">{label}</p>
            <p className={`font-bold text-xl text-white ${isAnimating ? 'animate-value-update' : ''}`}>{value}</p>
        </div>
    </div>
);

const StatsCard: React.FC<StatsCardProps> = ({ user }) => {
    const { gamesPlayed, points, wins, losses } = user;
    const winRatio = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    
    const prevUserRef = useRef(user);
    const [animate, setAnimate] = useState({
        played: false,
        wins: false,
        losses: false,
        points: false
    });

    useEffect(() => {
        const prevUser = prevUserRef.current;
        const newAnimateState = { ...animate };
        let changed = false;

        if (user.gamesPlayed > prevUser.gamesPlayed) {
            newAnimateState.played = true;
            changed = true;
        }
        if (user.wins > prevUser.wins) {
            newAnimateState.wins = true;
            changed = true;
        }
        if (user.losses > prevUser.losses) {
            newAnimateState.losses = true;
            changed = true;
        }
        if (user.points !== prevUser.points) {
            newAnimateState.points = true;
            changed = true;
        }
        
        if (changed) {
            setAnimate(newAnimateState);
            setTimeout(() => {
                setAnimate({ played: false, wins: false, losses: false, points: false });
            }, 400); // Animation duration
        }

        prevUserRef.current = user;
    }, [user.gamesPlayed, user.wins, user.losses, user.points]);


    return (
        <div className="bg-blue-900/50 rounded-3xl p-6 h-full w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-cyan-300">📈</span> Estadísticas de Juego
            </h3>
            <div className="space-y-3">
                <StatItem icon={<GamepadIcon />} label="Partidas Jugadas" value={gamesPlayed} isAnimating={animate.played} />
                <StatItem icon={<CheckCircleIcon />} label="Victorias" value={wins} iconColorClass="text-green-400" isAnimating={animate.wins} />
                <StatItem icon={<XCircleIcon />} label="Derrotas" value={losses} iconColorClass="text-red-400" isAnimating={animate.losses} />
                <StatItem icon={<ChartBarIcon />} label="Ratio de Victorias" value={`${winRatio}%`} />
                <StatItem icon={<StarIcon />} label="Puntos Totales" value={points} isAnimating={animate.points} />
            </div>
        </div>
    );
};

export default StatsCard;
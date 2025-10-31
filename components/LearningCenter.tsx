
import React, { useState } from 'react';
import { GameType, LearningTopic } from '../types';
import { LEARNING_MODULES_DATA } from '../constants';
import ModuleCard from './ModuleCard';
import LearningModule from './LearningModule';

interface LearningCenterProps {
    onGoHome: () => void;
    onGameSelect: (gameType: GameType) => void;
}

const RobotIcon = () => (
    <div className="text-6xl">🤖</div>
);

const LearningCenter: React.FC<LearningCenterProps> = ({ onGoHome, onGameSelect }) => {
    const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);

    const handleModuleSelect = (topic: LearningTopic) => {
        setSelectedTopic(topic);
    };
    
    const handleBackToList = () => {
        setSelectedTopic(null);
    }

    if (selectedTopic) {
        const moduleInfo = LEARNING_MODULES_DATA.find(m => m.id === selectedTopic);
        if (!moduleInfo) return null;

        return (
            <LearningModule 
                topic={selectedTopic}
                gameType={moduleInfo.game}
                onBack={handleBackToList}
                onStartGame={onGameSelect}
            />
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center">
            <button onClick={onGoHome} className="absolute top-4 left-4 bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors z-20">
                &larr; Volver
            </button>
            <div className="flex items-center justify-center gap-4 mb-4">
                <RobotIcon />
                <div>
                    <h2 className="text-4xl font-extrabold">Centro de Aprendizaje</h2>
                    <p className="text-xl text-blue-200">¡Aprende los secretos de las mates!</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {LEARNING_MODULES_DATA.map(module => (
                     <div key={module.id} className="bg-blue-900/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer hover:bg-blue-900/80 transition-colors" onClick={() => handleModuleSelect(module.id)}>
                        <div className="mb-4 flex items-center justify-center w-24 h-24">{module.icon}</div>
                        <h3 className="text-2xl font-bold">{module.id}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningCenter;

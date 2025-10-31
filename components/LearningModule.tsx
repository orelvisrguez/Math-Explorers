
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GameType, LearningTopic } from '../types';

interface LearningModuleProps {
    topic: LearningTopic;
    gameType: GameType;
    onBack: () => void;
    onStartGame: (gameType: GameType) => void;
}

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const renderContent = () => {
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-yellow-300">{part.slice(2, -2)}</strong>;
            }
            return <React.Fragment key={index}>{part.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}</React.Fragment>;
        });
    };

    return <div className="text-lg md:text-xl space-y-4">{renderContent()}</div>;
};

const getLearningContent = async (topic: LearningTopic): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    let prompt = '';
    switch (topic) {
        case LearningTopic.SUMA:
            prompt = "Explica la suma a un niño de 7 a 10 años de una manera divertida, simple y atractiva. Usa una analogía con juguetes o caramelos. Proporciona un ejemplo sencillo con números. Mantenlo corto y en español. Usa markdown con ** para resaltar palabras importantes.";
            break;
        case LearningTopic.RESTA:
            prompt = "Explica la resta a un niño de 7 a 10 años de una manera divertida y sencilla. Usa una analogía con galletas que un monstruo se come. Proporciona un ejemplo claro con números. Mantenlo corto y en español. Usa markdown con ** para resaltar palabras importantes.";
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching learning content:", error);
        return "¡Oh no! Mi cerebro de robot tuvo un cortocircuito. Intenta recargar la página.";
    }
};

const loadingMessages = [
    'El robot está pensando...',
    'Consultando al oráculo matemático...',
    'Calculando la respuesta...',
    'Preparando tu lección...'
];

const LoadingSpinner = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000); // Change message every 2 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-400"></div>
            <p className="text-xl text-blue-200">{loadingMessages[messageIndex]}</p>
        </div>
    );
};


const LearningModule: React.FC<LearningModuleProps> = ({ topic, gameType, onBack, onStartGame }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getLearningContent(topic).then(text => {
            setContent(text);
            setLoading(false);
        });
    }, [topic]);

    return (
        <div className="w-full max-w-2xl mx-auto bg-blue-800 bg-opacity-80 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center animate-fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-yellow-300 transition-colors z-20">
                &larr; Volver
            </button>
            <h2 className="text-4xl font-extrabold mb-6">{topic}</h2>

            <div className="bg-blue-900/60 p-6 rounded-2xl min-h-[250px] flex items-center justify-center text-left">
                {loading ? <LoadingSpinner /> : <MarkdownRenderer content={content} />}
            </div>

            <button
                onClick={() => onStartGame(gameType)}
                className="mt-8 w-full bg-gradient-to-br from-green-400 to-emerald-500 text-white font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white/50"
            >
                ¡Practicar Ahora!
            </button>
        </div>
    );
};

export default LearningModule;
import React, { useState } from 'react';

interface LoginScreenProps {
    onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-blue-800 bg-opacity-70 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-blue-500/50 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">¡Bienvenido!</h1>
            <p className="text-xl text-blue-200 mb-8">¿Cómo te llamas, explorador?</p>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Escribe tu nombre aquí"
                    className="w-full px-4 py-3 rounded-xl bg-blue-900/50 border-2 border-blue-500 text-white text-lg text-center placeholder-blue-300 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition-all"
                    maxLength={15}
                />
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="mt-6 w-full bg-gradient-to-br from-yellow-400 to-orange-500 text-blue-900 font-bold py-4 px-8 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 border-4 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    ¡A Jugar!
                </button>
            </form>
        </div>
    );
};

export default LoginScreen;
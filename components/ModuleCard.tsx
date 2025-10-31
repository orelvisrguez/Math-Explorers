
import React from 'react';

interface ModuleCardProps {
    title: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, onClick }) => {
    const isClickable = !!onClick;
    const Component = isClickable ? 'button' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`bg-blue-900/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center h-full ${isClickable ? 'cursor-pointer hover:bg-blue-900/80 transition-colors' : ''}`}
        >
            <div className="mb-2">{icon}</div>
            <h3 className="text-lg font-bold">{title}</h3>
        </Component>
    );
};

export default ModuleCard;

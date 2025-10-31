import React from 'react';
import { User } from '../types';
import { StarIcon } from '../constants';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div className="flex items-center gap-3 mt-4 md:mt-0 p-2 pr-4 bg-black/20 rounded-full">
            <img src={user.avatarUrl} alt={user.name} className="w-14 h-14 rounded-full border-4 border-blue-400" />
            <div className="text-sm">
                <p className="font-bold text-lg leading-tight">{user.name}</p>
                <div className="flex items-center gap-1 font-bold">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <span>Nivel {user.level}</span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-2 mt-1">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: `${user.progress}%` }}></div>
                </div>
                <p className="text-xs text-right opacity-80">{user.progress}%</p>
            </div>
        </div>
    );
};

export default UserProfile;
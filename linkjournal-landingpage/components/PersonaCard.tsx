// components/PersonaCard.tsx

import React from 'react';

// Define the Props interface for clarity and type safety
interface PersonaCardProps {
    title: string;
    description: string;
    icon: string; // Using a string for the emoji icon
}

/**
 * A reusable card component for displaying user personas or key features.
 */
const PersonaCard: React.FC<PersonaCardProps> = ({ title, description, icon }) => (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-3 border border-gray-100 transition-shadow duration-300 hover:shadow-lg">
        {/* The icon prop is rendered as an emoji string */}
        <div className="text-3xl mb-2">{icon}</div> 
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
    </div>
);

export default PersonaCard;
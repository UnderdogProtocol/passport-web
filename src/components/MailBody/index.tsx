import React, { useState } from 'react';

interface MailBodyProps {
    description: string;
    timestamp: string;
    borderColor?: string;
}

const MailBody: React.FC<MailBodyProps> = ({ description, timestamp,borderColor }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-h-screen overflow-y-auto hover:cursor-pointer">
            <div className="text-right text-gray-500 p-2">
                {timestamp}
            </div>
            <div className={`border ${isExpanded ? 'h-auto' : 'h-16'} overflow-hidden transition-height duration-300 ${borderColor?borderColor:''}`}>
                <div className="text-2xl text-white break-words p-4" onClick={toggleExpansion}>
                    {description}
                </div>
            </div>
        </div>
    );
};

export default MailBody;

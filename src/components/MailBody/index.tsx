import React, { useState } from 'react';

interface MailBodyProps {
    description: string;
    timestamp: string;
}

const MailBody: React.FC<MailBodyProps> = ({ description, timestamp, ...rest }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="max-h-screen overflow-y-auto hover:cursor-pointer" {...rest}>
            <div className="text-right text-gray-500 p-2">
                {timestamp}
            </div>
            <div className={`border ${isExpanded ? 'h-auto' : 'h-14'} overflow-hidden transition-height duration-300`}>
                <div className="text-2xl text-white break-words p-4" onClick={toggleExpansion}>
                    {description}
                </div>
            </div>
        </div>
    );
};

export default MailBody;

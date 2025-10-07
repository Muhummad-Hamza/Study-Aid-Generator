import React, { useState } from 'react';
import { CopyIcon, DownloadIcon, CheckIcon } from './icons';
import { Spinner } from './Spinner';

interface ResultsDisplayProps {
    content: string | null;
    isLoading: boolean;
    loadingMessage: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, isLoading, loadingMessage }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownload = () => {
        if (!content) return;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-study-aid.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading && loadingMessage) {
        return (
             <div className="w-full bg-gray-900/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-900/50 mt-8 flex flex-col items-center justify-center min-h-[200px]">
                <Spinner />
                <p className="text-gray-400 mt-4">{loadingMessage}</p>
            </div>
        );
    }

    if (!content) {
        return null; // Don't render anything if there's no content and not loading
    }
    
    return (
        <div className="w-full bg-gray-900/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-900/50 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Generated Content</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition"
                        aria-label="Copy to clipboard"
                    >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-300 transition"
                        aria-label="Download as .txt"
                    >
                        <DownloadIcon />
                    </button>
                </div>
            </div>
            <div className="bg-black/30 p-4 rounded-lg max-h-[50vh] overflow-y-auto custom-scrollbar">
                <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</pre>
            </div>
        </div>
    );
};
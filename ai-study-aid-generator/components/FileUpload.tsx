import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    file: File | null;
    disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, file, disabled }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [disabled, onFileSelect]);

    const handleClick = () => {
        if(!disabled) inputRef.current?.click();
    };

    const dropzoneClasses = `
        relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer
        transition-all duration-300 overflow-hidden
        ${disabled ? 'bg-gray-800/40 border-gray-700 cursor-not-allowed' : 
           isDragging ? 'border-purple-500' : 'border-gray-600 hover:border-purple-500'
        }
    `;

    const glowClasses = `
        absolute inset-0 transition-opacity duration-300
        ${isDragging ? 'opacity-100' : 'opacity-0'}
    `;

    return (
        <div 
            className={dropzoneClasses} 
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className={glowClasses} style={{
                background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0) 70%)'
            }}></div>
            <input 
                type="file" 
                ref={inputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".txt,.pdf,.jpg,.jpeg,.png"
                disabled={disabled}
            />
            <div className="text-center z-10">
                <UploadIcon className={`mx-auto h-12 w-12 transition-colors ${disabled ? 'text-gray-600' : 'text-gray-500 group-hover:text-purple-400'}`} />
                <p className="mt-4 text-lg font-semibold text-white">
                    {file ? file.name : 'Drag & drop a file here'}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    {file ? `(${(file.size / 1024).toFixed(2)} KB)` : 'or click to select'}
                </p>
                {!file && <p className="text-xs text-gray-500 mt-2">Supports: TXT, PDF, JPG, PNG</p>}
            </div>
        </div>
    );
};
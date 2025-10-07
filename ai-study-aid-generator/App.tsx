import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { OptionsSelector } from './components/OptionsSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { processFile } from './services/fileProcessor';
import { generateStudyAid } from './services/geminiService';
import { OutputType } from './types';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [outputType, setOutputType] = useState<OutputType>(OutputType.QUIZ);
    const [itemCount, setItemCount] = useState<number>(5);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback(async (selectedFile: File) => {
        setFile(selectedFile);
        setExtractedText(null);
        setGeneratedContent(null);
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Extracting text from your document...');

        try {
            const text = await processFile(selectedFile);
            setExtractedText(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during file processing.');
            setExtractedText(null);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, []);
    
    const handleGenerate = useCallback(async () => {
        if (!extractedText) {
            setError('No text has been extracted from a file yet.');
            return;
        }
        
        setGeneratedContent(null);
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Generating your study materials...');

        try {
            const content = await generateStudyAid(extractedText, outputType, itemCount);
            setGeneratedContent(content);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred while generating content.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [extractedText, outputType, itemCount]);

    const isGenerateDisabled = !extractedText || isLoading;

    return (
        <div className="min-h-screen text-gray-200 flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <LogoIcon />
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Study Aid Generator</h1>
                    </div>
                    <p className="text-lg text-gray-400">Upload your notes, get AI-powered study materials instantly.</p>
                </header>

                <main className="space-y-8">
                    <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-900/50">
                        <h2 className="text-xl font-semibold mb-4 text-white">1. Upload Your Study Material</h2>
                        <FileUpload onFileSelect={handleFileSelect} file={file} disabled={isLoading} />
                         {extractedText && (
                            <div className="mt-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-sm text-green-300">
                                Successfully extracted {extractedText.length.toLocaleString()} characters. You can now select options and generate.
                            </div>
                        )}
                    </div>
                    
                    <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-blue-900/50">
                        <h2 className="text-xl font-semibold mb-4 text-white">2. Set Your Options</h2>
                        <OptionsSelector 
                            outputType={outputType}
                            setOutputType={setOutputType}
                            itemCount={itemCount}
                            setItemCount={setItemCount}
                            disabled={!extractedText || isLoading}
                        />
                    </div>

                    <div className="flex justify-center pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerateDisabled}
                            className="w-full max-w-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-indigo-600/30 hover:scale-105 disabled:bg-gray-600 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500/50"
                        >
                            {isLoading ? 'Processing...' : 'Generate Study Aid'}
                        </button>
                    </div>

                     {error && (
                        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-300">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    <ResultsDisplay 
                        content={generatedContent}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                    />
                </main>
            </div>
        </div>
    );
};

export default App;
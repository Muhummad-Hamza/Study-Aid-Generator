import React from 'react';
import { OUTPUT_TYPE_OPTIONS } from '../constants';
import { OutputType } from '../types';

interface OptionsSelectorProps {
    outputType: OutputType;
    setOutputType: (type: OutputType) => void;
    itemCount: number;
    setItemCount: (count: number) => void;
    disabled: boolean;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = ({ outputType, setOutputType, itemCount, setItemCount, disabled }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="output-type" className="block text-sm font-medium text-gray-300 mb-2">
                    Generation Type
                </label>
                <select
                    id="output-type"
                    value={outputType}
                    onChange={(e) => setOutputType(e.target.value as OutputType)}
                    disabled={disabled}
                    className="w-full bg-gray-800/60 border-2 border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50"
                >
                    {OUTPUT_TYPE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value} className="bg-gray-800">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="item-count" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Items
                </label>
                <input
                    type="number"
                    id="item-count"
                    value={itemCount}
                    onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    min="1"
                    max="50"
                    disabled={disabled}
                    className="w-full bg-gray-800/60 border-2 border-gray-700 text-white rounded-md p-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50"
                />
            </div>
        </div>
    );
};


import React from 'react';

interface Program {
    start: string;
    end: string;
    name: string;
}

interface ScheduleDisplayProps {
    schedule: Program[];
    currentProgramName: string;
    currentProgramProgress: number;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, currentProgramName, currentProgramProgress }) => {
    return (
        <div className="border-t border-gray-700 pt-4 text-left">
            <h3 className="text-lg font-bold text-white mb-3 text-center uppercase tracking-wider">Programação do Dia</h3>
            <div className="space-y-2 max-h-64 sm:max-h-72 md:max-h-80 lg:max-h-96 overflow-y-auto pr-2">
                {schedule.map((program, index) => {
                    const isCurrent = program.name === currentProgramName;
                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden p-3 rounded-lg transition-colors duration-200 cursor-pointer ${isCurrent ? 'bg-red-900 bg-opacity-50' : 'bg-gray-800 bg-opacity-50 hover:bg-gray-700'}`}
                            title="Mais detalhes em breve"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="font-mono text-sm text-gray-400 mr-4">{program.start}</span>
                                    <span className={`font-semibold ${isCurrent ? 'text-red-400' : 'text-white'}`}>{program.name}</span>
                                </div>
                                {isCurrent && (
                                    <div className="flex items-center space-x-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        <span className="text-xs font-bold text-red-400 uppercase">NO AR</span>
                                    </div>
                                )}
                            </div>
                            {isCurrent && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700" role="progressbar" aria-valuenow={currentProgramProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do programa atual">
                                    <div 
                                        className="h-full bg-red-500 rounded-r-full transition-all duration-1000 ease-linear"
                                        style={{ width: `${currentProgramProgress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleDisplay;

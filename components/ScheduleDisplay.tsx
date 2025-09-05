
import React from 'react';

interface Program {
    start: string;
    end: string;
    name: string;
}

interface ScheduleDisplayProps {
    schedule: Program[];
    currentProgramName: string;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, currentProgramName }) => {
    return (
        <div className="border-t border-gray-700 pt-4 text-left">
            <h3 className="text-lg font-bold text-white mb-3 text-center uppercase tracking-wider">Programação do Dia</h3>
            <div className="space-y-2 max-h-64 sm:max-h-72 md:max-h-80 lg:max-h-96 overflow-y-auto pr-2">
                {schedule.map((program, index) => {
                    const isCurrent = program.name === currentProgramName;
                    return (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 cursor-pointer ${isCurrent ? 'bg-red-900 bg-opacity-50' : 'bg-gray-800 bg-opacity-50 hover:bg-gray-700'}`}
                            title="Mais detalhes em breve"
                        >
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
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleDisplay;

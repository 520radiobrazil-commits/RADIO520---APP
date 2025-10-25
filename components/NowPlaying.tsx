import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import BellIcon from './icons/BellIcon';
import { Program, dailySchedules } from './scheduleData';
import { useNotification } from '../context/NotificationContext';
import ShareButton from './ShareButton';
import { PlayerMode } from '../types';

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

const getBrasiliaTimeInfo = (): { dayOfWeek: number, hours: number, minutes: number, seconds: number, year: number, month: number, day: number } => {
    const now = new Date();
    const timeZone = 'America/Sao_Paulo';
    
    const options: Intl.DateTimeFormatOptions = {
        timeZone,
        weekday: 'short', // e.g., 'Sun'
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };
    
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now)
        .reduce((acc, part) => {
            if (part.type !== 'literal') acc[part.type] = part.value;
            return acc;
        }, {} as Record<string, string>);

    const dayOfWeekMap: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };

    return {
        dayOfWeek: dayOfWeekMap[parts.weekday] ?? 0,
        hours: parseInt(parts.hour, 10),
        minutes: parseInt(parts.minute, 10),
        seconds: parseInt(parts.second, 10),
        year: parseInt(parts.year, 10),
        month: parseInt(parts.month, 10), // 1-indexed
        day: parseInt(parts.day, 10),
    };
};

const getZonaMistaCountdown = (): string => {
    const { dayOfWeek, hours, minutes, seconds, year, month, day } = getBrasiliaTimeInfo();
    const targetDay = 0; // Sunday
    const targetHour = 20;
    const targetMinute = 0;

    const nowInBrasiliaAsTimestamp = Date.UTC(year, month - 1, day, hours, minutes, seconds);

    let targetDate = new Date(nowInBrasiliaAsTimestamp);
    
    let daysUntilTarget = (targetDay - dayOfWeek + 7) % 7;
    if (daysUntilTarget === 0 && (hours > targetHour || (hours === targetHour && minutes >= targetMinute))) {
        daysUntilTarget = 7;
    }

    targetDate.setUTCDate(targetDate.getUTCDate() + daysUntilTarget);
    targetDate.setUTCHours(targetHour, targetMinute, 0, 0);

    const remainingMilliseconds = targetDate.getTime() - nowInBrasiliaAsTimestamp;
    
    if (remainingMilliseconds <= 0) {
        return '00:00:00';
    }

    const remainingSeconds = Math.floor(remainingMilliseconds / 1000);
    const countdownHours = Math.floor(remainingSeconds / 3600);
    const countdownMinutes = Math.floor((remainingSeconds % 3600) / 60);
    const countdownSeconds = remainingSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(countdownHours)}:${pad(countdownMinutes)}:${pad(countdownSeconds)}`;
};


interface ScrollableTextProps {
    text: string;
    className?: string;
    forceScroll?: boolean;
}

const ScrollableText: React.FC<ScrollableTextProps> = ({ text, className, forceScroll = false }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        // If scrolling is forced, we don't need to measure or manage state.
        if (forceScroll) {
            // Reset state in case the component properties change
            if (isOverflowing) setIsOverflowing(false);
            return;
        }
        
        // This function will only be called for dynamic text (not subtitles)
        const checkOverflow = () => {
            const element = containerRef.current;
            // The ref is only present on the static text container
            if (element) {
                const hasOverflow = element.scrollWidth > element.clientWidth;
                // Only trigger a state change if overflow is detected.
                // Once it's scrolling, we don't need to check anymore.
                if (hasOverflow && !isOverflowing) {
                    setIsOverflowing(true);
                }
            }
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);

    }, [text, forceScroll, isOverflowing]);

    const shouldScroll = forceScroll || isOverflowing;

    // If text should scroll (either forced or because it's overflowing)
    if (shouldScroll) {
        return (
            <div className={`whitespace-nowrap overflow-hidden ${className}`}>
                <div 
                    className="marquee-content" 
                    style={{ animationDuration: `${Math.max(text.length / 5, 5)}s` }}
                >
                    <span className="pr-16">{text}</span>
                    <span>{text}</span>
                </div>
            </div>
        );
    }
    
    // If not scrolling, render the static text in a measurable container.
    // This allows the useLayoutEffect to determine if it's overflowing.
    return (
        <div ref={containerRef} className={`whitespace-nowrap overflow-hidden ${className}`}>
            <span>{text}</span>
        </div>
    );
};


const NowPlaying: React.FC<{ playerMode: PlayerMode }> = ({ playerMode }) => {
    const [currentProgram, setCurrentProgram] = useState<Program>({ start: '', end: '', name: 'Carregando...', subtitle: 'Sintonizando a programação...' });
    const [upNextProgram, setUpNextProgram] = useState<Program | null>(null);
    const [featuredProgram, setFeaturedProgram] = useState<(Program & { day: string }) | null>(null);
    const { showNotification } = useNotification();
    const [reminders, setReminders] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('radio520_reminders');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [countdown, setCountdown] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('radio520_reminders', JSON.stringify(reminders));
    }, [reminders]);

    useEffect(() => {
        const zonaMista = dailySchedules[0].find(p => p.name === 'ZONA MISTA');
        if (zonaMista) {
            setFeaturedProgram({ ...zonaMista, day: 'Domingo' });
        }
    }, []);

    useEffect(() => {
        const updateSchedule = () => {
            const { dayOfWeek, hours, minutes } = getBrasiliaTimeInfo();
            const nowInMinutes = hours * 60 + minutes;
            const schedule = dailySchedules[dayOfWeek] || [];

            let current: Program | undefined;
            let next: Program | null = null;

            for (let i = 0; i < schedule.length; i++) {
                const program = schedule[i];
                const start = timeToMinutes(program.start);
                const end = timeToMinutes(program.end === '00:00' ? '24:00' : program.end);

                if (nowInMinutes >= start && nowInMinutes < end) {
                    current = program;
                    if (i + 1 < schedule.length) {
                        next = schedule[i + 1];
                    } else {
                        const nextDaySchedule = dailySchedules[(dayOfWeek + 1) % 7] || [];
                        next = nextDaySchedule.length > 0 ? nextDaySchedule[0] : null;
                    }
                    break;
                }
            }
            
            if (!current && schedule.length > 0) {
                 // Fallback if current time is somehow outside all slots (e.g., exactly at midnight)
                 current = schedule[schedule.length - 1];
            }

            if (current) setCurrentProgram(current);
            setUpNextProgram(next);
        };
        
        updateSchedule();
        const intervalId = setInterval(updateSchedule, 30000); // Check every 30 seconds for schedule changes
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (upNextProgram?.name !== 'ZONA MISTA') {
            setCountdown('');
            return; // Exit early if it's not the featured show
        }

        const updateCountdown = () => {
            setCountdown(getZonaMistaCountdown());
        };

        updateCountdown(); // Set immediately
        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, [upNextProgram]);

    const toggleReminder = (programName: string) => {
        setReminders(prev => {
            const isSet = prev.includes(programName);
            if (isSet) {
                showNotification(`Lembrete para "${programName}" removido.`);
                return prev.filter(p => p !== programName);
            } else {
                showNotification(`Lembrete definido para "${programName}"!`);
                return [...prev, programName];
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-900 bg-opacity-40 backdrop-blur-sm border border-gray-700/50 shadow-lg">
            
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-red-400">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <p className="font-semibold text-xs uppercase tracking-wider text-glow">Tocando Agora</p>
                    </div>
                    {currentProgram.start && currentProgram.end && (
                        <div className="bg-red-600 text-white px-2 py-0.5 rounded">
                            <p className="font-mono text-xs" title="Horário do programa">
                                {currentProgram.start} - {currentProgram.end === '24:00' ? '00:00' : currentProgram.end}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <div className="flex-grow min-w-0">
                        <ScrollableText text={currentProgram.name} className="text-xl font-bold text-white text-glow-purple" />
                        {currentProgram.subtitle && (
                            <ScrollableText text={currentProgram.subtitle} className="text-sm text-gray-300" forceScroll={true} />
                        )}
                    </div>
                    <ShareButton programName={currentProgram.name} />
                </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1"></div>

            {upNextProgram && (
                upNextProgram.name === 'ZONA MISTA' && countdown ? (
                <div className="w-full p-3 rounded-lg bg-yellow-400 text-gray-900 shadow-lg animate-fade-in">
                    <p className="text-xs font-bold uppercase tracking-wider text-yellow-800">A Seguir: Vem Aí!</p>
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex-grow min-w-0">
                            <ScrollableText text={upNextProgram.name} className="font-bold text-lg" />
                             {upNextProgram.subtitle && (
                                <ScrollableText text={upNextProgram.subtitle} className="text-sm text-gray-800" forceScroll={true} />
                            )}
                            <p className="font-mono text-sm tracking-wider text-yellow-900 mt-1">
                                Começa em: <span className="font-bold">{countdown}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-2 pl-2">
                             <button
                                onClick={() => toggleReminder(upNextProgram.name)}
                                className={`p-2 rounded-full transition-all duration-300 ${reminders.includes(upNextProgram.name) ? 'bg-yellow-600 text-white ring-2 ring-offset-2 ring-offset-yellow-400 ring-yellow-600' : 'bg-yellow-500 text-gray-800 hover:bg-yellow-600'}`}
                                title={reminders.includes(upNextProgram.name) ? 'Remover lembrete' : 'Lembrar-me'}
                            >
                                <BellIcon className="w-6 h-6" />
                            </button>
                            <ShareButton programName={upNextProgram.name} />
                        </div>
                    </div>
                </div>
                ) : (
                <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-3">
                        <button
                            onClick={() => toggleReminder(upNextProgram.name)}
                            className={`p-1.5 rounded-full transition-all duration-300 ${reminders.includes(upNextProgram.name) ? 'bg-yellow-400 text-gray-900 ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'}`}
                            title={reminders.includes(upNextProgram.name) ? 'Remover lembrete' : 'Lembrar-me'}
                            aria-label={reminders.includes(upNextProgram.name) ? `Remover lembrete para ${upNextProgram.name}` : `Definir lembrete para ${upNextProgram.name}`}
                        >
                            <BellIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">A Seguir</p>
                        <ScrollableText text={upNextProgram.name} className="font-semibold text-gray-200" />
                        {upNextProgram.subtitle && (
                            <ScrollableText text={upNextProgram.subtitle} className="text-xs text-gray-400" forceScroll={true} />
                        )}
                    </div>
                    <div className="flex items-center space-x-2 pl-2">
                        <div className="text-right">
                            <p className="font-semibold text-white">{upNextProgram.start}</p>
                        </div>
                        <ShareButton programName={upNextProgram.name} />
                    </div>
                </div>
                )
            )}
            
            {/* VEM AÍ Section */}
            {featuredProgram && upNextProgram?.name !== featuredProgram.name && (
                <>
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-1"></div>
                    <div className="w-full p-3 rounded-lg bg-gray-800/30 border border-purple-500/30 animate-fade-in shadow-md">
                        <div className="flex items-center w-full">
                            <div className="flex-shrink-0 mr-3">
                                <button
                                    onClick={() => toggleReminder(featuredProgram.name)}
                                    className={`p-1.5 rounded-full transition-all duration-300 ${reminders.includes(featuredProgram.name) ? 'bg-yellow-400 text-gray-900 ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'}`}
                                    title={reminders.includes(featuredProgram.name) ? 'Remover lembrete' : 'Lembrar-me'}
                                    aria-label={reminders.includes(featuredProgram.name) ? `Remover lembrete para ${featuredProgram.name}` : `Definir lembrete para ${featuredProgram.name}`}
                                >
                                    <BellIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider text-purple-400 text-glow-purple">Vem Aí</p>
                                <ScrollableText text={featuredProgram.name} className="font-bold text-lg text-white" />
                                {featuredProgram.subtitle && (
                                    <ScrollableText text={featuredProgram.subtitle} className="text-sm text-gray-300" forceScroll={true} />
                                )}
                            </div>
                            <div className="flex items-center space-x-2 pl-2">
                                <div className="text-right">
                                    <p className="font-semibold text-white">{featuredProgram.start}</p>
                                    <p className="text-xs text-gray-400">{featuredProgram.day}</p>
                                </div>
                                <ShareButton programName={featuredProgram.name} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NowPlaying;
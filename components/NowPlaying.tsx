

import React, { useState, useEffect, useRef } from 'react';
import BellIcon from './icons/BellIcon';
import ScheduleIcon from './icons/ScheduleIcon';
import ScheduleDisplay from './ScheduleDisplay';
import { Program, dailySchedules } from './scheduleData';
import { useNotification } from '../context/NotificationContext';
import ShareButton from './ShareButton';
import CloseIcon from './icons/CloseIcon';

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

const getOrasomCountdown = (): string => {
    const { dayOfWeek, hours, minutes, seconds, year, month, day } = getBrasiliaTimeInfo();
    const targetDay = 0; // Sunday
    const targetHour = 5;
    const targetMinute = 0;

    // Use Date.UTC to get timestamps for specific wall times, making them timezone-independent
    const nowInBrasiliaAsTimestamp = Date.UTC(year, month - 1, day, hours, minutes, seconds);

    let targetDate = new Date(nowInBrasiliaAsTimestamp);
    
    let daysUntilTarget = (targetDay - dayOfWeek + 7) % 7;
    if (daysUntilTarget === 0 && (hours > targetHour || (hours === targetHour && minutes > targetMinute))) {
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
    
    return `${String(countdownHours).padStart(2, '0')}:${String(countdownMinutes).padStart(2, '0')}:${String(countdownSeconds).padStart(2, '0')}`;
};

const getProgramScheduleInfo = () => {
    const { dayOfWeek, hours, minutes, seconds } = getBrasiliaTimeInfo();
    const schedule = dailySchedules[dayOfWeek] || [];

    const currentTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    let currentProgram: Program = { name: 'Música na 520', start: '', end: '', };
    let currentIndex = -1;
    let progressPercentage = 0;

    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];
        const startSeconds = timeToMinutes(item.start) * 60;
        const endSeconds = item.end === '24:00' ? 86400 : timeToMinutes(item.end) * 60;

        if (currentTimeInSeconds >= startSeconds && currentTimeInSeconds < endSeconds) {
            currentProgram = item;
            currentIndex = i;
            
            const totalDuration = endSeconds - startSeconds;
            if (totalDuration > 0) {
                const elapsedSeconds = currentTimeInSeconds - startSeconds;
                progressPercentage = (elapsedSeconds / totalDuration) * 100;
            }
            break; 
        }
    }
    
    let nextProgramIndex;
    if (currentIndex !== -1) {
        nextProgramIndex = (currentIndex + 1) % schedule.length;
    } else {
        const upcomingIndex = schedule.findIndex(item => (timeToMinutes(item.start) * 60) > currentTimeInSeconds);
        nextProgramIndex = upcomingIndex !== -1 ? upcomingIndex : 0;
    }
    
    const nextProgram = schedule[nextProgramIndex];
    let nextProgramStartSeconds = timeToMinutes(nextProgram.start) * 60;

    let remainingSeconds = nextProgramStartSeconds - currentTimeInSeconds;
    const isNextDay = remainingSeconds < 0 || (currentIndex !== -1 && nextProgramIndex === 0 && currentIndex === schedule.length - 1);
    if (isNextDay) {
        remainingSeconds += 24 * 3600;
    }
    
    const countdownHours = Math.floor(remainingSeconds / 3600);
    const countdownMinutes = Math.floor((remainingSeconds % 3600) / 60);
    const countdownSeconds = remainingSeconds % 60;

    const countdown = `${String(countdownHours).padStart(2, '0')}:${String(countdownMinutes).padStart(2, '0')}:${String(countdownSeconds).padStart(2, '0')}`;

    return {
        current: currentProgram,
        next: nextProgram,
        countdown,
        isNextDay,
        schedule,
        progress: Math.max(0, Math.min(100, progressPercentage)),
    };
};

const formatDateForICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const createICSFile = (program: Program, isNextDay: boolean) => {
    const { year, month, day } = getBrasiliaTimeInfo();
    
    const eventDate = new Date(Date.UTC(year, month - 1, day));
    if (isNextDay) {
        eventDate.setUTCDate(eventDate.getUTCDate() + 1);
    }

    const [startHours, startMinutes] = program.start.split(':').map(Number);
    const [endHours, endMinutes] = program.end === '24:00' ? [23, 59] : program.end.split(':').map(Number);

    const startDate = new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate(), startHours, startMinutes));
    const endDate = new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate(), endHours, endMinutes));
    
    const dtStamp = formatDateForICS(new Date());
    const dtStart = formatDateForICS(startDate);
    const dtEnd = formatDateForICS(endDate);
    
    const uid = `${dtStart}-${program.name.replace(/\s+/g, '')}@radio520.com.br`;
    const summary = `${program.name}`;
    const description = `Lembrete para ouvir ${program.name} na Rádio 520. Acesse: https://www.radio520.com.br`;
    const location = "Rádio 520";

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rádio 520//WebApp//PT',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;TZID=America/Sao_Paulo:${dtStart}`,
        `DTEND;TZID=America/Sao_Paulo:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `lembrete-${program.name.toLowerCase().replace(/\s+/g, '-')}.ics`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const createOrasomICSFile = () => {
    const { dayOfWeek, hours, year, month, day } = getBrasiliaTimeInfo();
    const targetDay = 0; // Sunday
    const targetHour = 5;

    let targetDate = new Date(Date.UTC(year, month - 1, day));

    let daysUntilTarget = (targetDay - dayOfWeek + 7) % 7;
    if (daysUntilTarget === 0 && hours >= targetHour) {
        daysUntilTarget = 7;
    }
    
    targetDate.setUTCDate(targetDate.getUTCDate() + daysUntilTarget);

    const program = { name: 'ORASOM 520', start: '05:00', end: '07:00' };
    const [startHours, startMinutes] = program.start.split(':').map(Number);
    const [endHours, endMinutes] = program.end.split(':').map(Number);

    const startDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), startHours, startMinutes));
    const endDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), endHours, endMinutes));

    const dtStamp = formatDateForICS(new Date());
    const dtStart = formatDateForICS(startDate);
    const dtEnd = formatDateForICS(endDate);
    
    const uid = `${dtStart}-orasom520@radio520.com.br`;
    const summary = `ORASOM 520`;
    const description = `Lembrete para ouvir ORASOM 520 na Rádio 520. Acesse: https://www.radio520.com.br`;
    const location = "Rádio 520";

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rádio 520//WebApp//PT',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `DTSTART;TZID=America/Sao_Paulo:${dtStart}`,
        `DTEND;TZID=America/Sao_Paulo:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `lembrete-orasom-520.ics`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const ScrollableText: React.FC<{text: string; className: string; threshold?: number;}> = ({ text, className, threshold = 28 }) => {
    if (!text) return null;
    const shouldScroll = text.length > threshold;

    if (!shouldScroll) {
        return (
            <p className={`${className} truncate mt-1`} title={text}>
                {text}
            </p>
        );
    }

    const animationDuration = `${text.length / 4}s`;

    return (
        <div className="marquee-container mt-1 h-7 md:h-8">
            <div 
                className="marquee-content"
                style={{ animationDuration }}
            >
                <span className={className}>{text}</span>
                <span className={`${className} pl-8`}>{text}</span>
            </div>
        </div>
    );
};

const NowPlaying: React.FC = () => {
    const { showNotification } = useNotification();
    const [programInfo, setProgramInfo] = useState({
        current: { name: 'Carregando...' } as Program,
        next: { name: 'Carregando...' } as Program,
        countdown: '00:00:00',
        isNextDay: false,
        schedule: [] as Program[],
        progress: 0,
    });
    const [orasomCountdown, setOrasomCountdown] = useState('00:00:00');
    const [isScheduleVisible, setIsScheduleVisible] = useState(false);
    const [activeReminders, setActiveReminders] = useState<Set<string>>(new Set());
    const prevProgramNameRef = useRef<string | null>(null);

    useEffect(() => {
        try {
            const storedReminders = localStorage.getItem('radio520-reminders');
            if (storedReminders) {
                setActiveReminders(new Set(JSON.parse(storedReminders)));
            }
        } catch (error) {
            console.error("Failed to parse reminders from localStorage", error);
        }
    }, []);

    useEffect(() => {
        let timerId: number;

        const updateSchedule = () => {
            const info = getProgramScheduleInfo();
            setProgramInfo(info);

            if (
                prevProgramNameRef.current &&
                info.current.name &&
                info.current.name !== 'Carregando...' &&
                info.current.name !== prevProgramNameRef.current
            ) {
                showNotification(`No ar agora: ${info.current.name}`);
            }
            prevProgramNameRef.current = info.current.name;

            const orasomTime = getOrasomCountdown();
            setOrasomCountdown(orasomTime);
            
            const msUntilNextSecond = 1000 - new Date().getMilliseconds();
            timerId = window.setTimeout(updateSchedule, msUntilNextSecond);
        };

        updateSchedule();

        return () => clearTimeout(timerId);
    }, []);

    const updateReminders = (programName: string) => {
        const newReminders = new Set(activeReminders);
        if (!newReminders.has(programName)) {
            newReminders.add(programName);
            setActiveReminders(newReminders);
            localStorage.setItem('radio520-reminders', JSON.stringify(Array.from(newReminders)));
        }
    };

    const handleReminderClick = () => {
        if (programInfo.next?.name && programInfo.next.name !== 'Carregando...') {
            createICSFile(programInfo.next, programInfo.isNextDay);
            updateReminders(programInfo.next.name);
            showNotification(`Lembrete para "${programInfo.next.name}" criado!`);
        }
    };
    
    const handleOrasomReminderClick = () => {
        createOrasomICSFile();
        updateReminders('ORASOM 520');
        showNotification('Lembrete para "ORASOM 520" criado!');
    };

    const toggleSchedule = () => {
        setIsScheduleVisible(prev => !prev);
    };

    const ORASOM_ICON_URL = "https://public-rf-upload.minhawebradio.net/249695/ad/dbdeb191c4ddc5877d49a2a0f4066233.jpg";
    const [hours, minutes, seconds] = orasomCountdown.split(':');

    const isNextProgramReminderSet = programInfo.next?.name ? activeReminders.has(programInfo.next.name) : false;
    const isOrasomReminderSet = activeReminders.has('ORASOM 520');

    return (
        <div className="text-center my-2 p-4 bg-black bg-opacity-30 rounded-lg w-full max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto shadow-lg transition-all duration-300">
            <div className="flex justify-around items-start">
                <div className="w-1/2 pr-3">
                    <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">Você está ouvindo</p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2 mb-1 shadow-inner">
                        <div 
                            className="bg-red-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${programInfo.progress}%` }}
                            aria-valuenow={programInfo.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            role="progressbar"
                            aria-label={`Progresso do programa: ${programInfo.current.name}`}
                        ></div>
                    </div>
                     <div className="flex items-center justify-center space-x-2">
                        <ScrollableText 
                            text={programInfo.current.name}
                            className="text-lg md:text-xl font-bold text-red-500 animate-pulse"
                        />
                        <ShareButton programName={programInfo.current.name} />
                    </div>
                </div>
                
                <div className="border-l border-gray-600 h-12 self-center"></div>

                <div className="w-1/2 pl-3">
                    <p className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">A seguir</p>
                    <div className="flex items-center justify-center space-x-2">
                        <ScrollableText 
                            text={programInfo.next.name}
                            className="text-lg md:text-xl font-bold text-white flex-grow"
                        />
                        <button 
                            onClick={handleReminderClick}
                            className={`p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 ${
                                isNextProgramReminderSet
                                ? 'text-orange-500 hover:text-orange-400'
                                : 'text-gray-400 hover:text-white'
                            }`}
                            title={isNextProgramReminderSet ? "Lembrete criado!" : "Criar lembrete"}
                            aria-label="Criar lembrete para o próximo programa"
                        >
                            <BellIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700 flex flex-col md:flex-row justify-around items-center gap-4 md:gap-8 px-2">
                {/* Left Part: Image and Title */}
                <div className="flex items-center gap-4 text-left">
                    <img src={ORASOM_ICON_URL} alt="ORASOM 520" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-2 border-red-500 shadow-lg" />
                    <div>
                        <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Vem aí...</p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">ORASOM 520</h3>
                        <p className="text-xs text-gray-400">Todo domingo, às 05:00.</p>
                    </div>
                </div>

                {/* Right Part: Countdown and Buttons */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-baseline space-x-1 font-mono text-white">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{hours}</span>
                            <span className="text-xs uppercase text-gray-400">h</span>
                        </div>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{minutes}</span>
                            <span className="text-xs uppercase text-gray-400">m</span>
                        </div>
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold">:</span>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{seconds}</span>
                            <span className="text-xs uppercase text-gray-400">s</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleOrasomReminderClick}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                                isOrasomReminderSet
                                ? 'bg-orange-600 text-white cursor-default'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                            aria-label="Criar lembrete para ORASOM 520"
                        >
                            <BellIcon className="w-4 h-4" />
                            <span>{isOrasomReminderSet ? "Lembrete Criado" : "Criar Lembrete"}</span>
                        </button>
                        <button
                            onClick={toggleSchedule}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                                isScheduleVisible
                                ? 'bg-red-800 text-white hover:bg-red-700'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                            }`}
                            title={isScheduleVisible ? "Fechar programação" : "Ver programação completa"}
                            aria-label={isScheduleVisible ? "Fechar programação" : "Ver programação completa"}
                            aria-expanded={isScheduleVisible}
                        >
                            {isScheduleVisible ? <CloseIcon className="w-4 h-4" /> : <ScheduleIcon className="w-4 h-4" />}
                            <span>{isScheduleVisible ? 'Fechar' : 'Programação'}</span>
                        </button>
                    </div>
                </div>
            </div>
            {isScheduleVisible && <ScheduleDisplay schedule={programInfo.schedule} currentProgramName={programInfo.current.name} />}
        </div>
    );
};

export default NowPlaying;
export interface Program {
    start: string;
    end: string;
    name: string;
    subtitle?: string;
}

const scheduleSunday: Program[] = [
    { start: '00:00', end: '02:00', name: '520 LOVE HITS' },
    { start: '02:00', end: '05:00', name: 'SUPERSEQUÊNCIA • DOMINGO' },
    { start: '05:00', end: '07:00', name: 'ORASOM 520' },
    { start: '07:00', end: '11:50', name: 'SUPERSEQUÊNCIA • DOMINGO' },
    { start: '11:50', end: '12:00', name: 'REP520 • DOM' },
    { start: '12:00', end: '14:00', name: 'ZIRIGUIDUM' },
    { start: '14:00', end: '14:10', name: 'REP520 • DOM' },
    { start: '14:10', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA VE MARIA - DOMINGO' },
    { start: '18:10', end: '20:00', name: 'A ERA DO ROCK #05' },
    { start: '20:00', end: '21:10', name: 'ZONA MISTA', subtitle: 'A resenha mais legal e ordinária do rádio.' },
    { start: '21:10', end: '24:00', name: 'TOP BILLBOARD' },
];

const scheduleMonday: Program[] = [
    { start: '00:00', end: '01:20', name: 'MÚSICA DO DIA 520 • SEG', subtitle: 'playlist encerra às 00:12' },
    { start: '01:20', end: '01:30', name: 'REP520 • SEG' },
    { start: '01:30', end: '05:00', name: 'INSÔNIA' },
    { start: '05:00', end: '08:00', name: 'GIRO520 • SEG' },
    { start: '08:00', end: '08:10', name: 'MÚSICA DO DIA 520 • SEG' },
    { start: '08:10', end: '10:00', name: 'CAFEINA' },
    { start: '10:00', end: '10:10', name: 'REP520 • SEG' },
    { start: '10:10', end: '13:10', name: 'POP SHOW' },
    { start: '13:10', end: '13:20', name: 'MÚSICA DO DIA 520 • SEG' },
    { start: '13:20', end: '16:50', name: 'MARATONA • SEG' },
    { start: '16:50', end: '17:00', name: 'RESENHA 520' },
    { start: '17:00', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA - SEGUNDA' },
    { start: '18:10', end: '20:00', name: 'MIX520 GEN' },
    { start: '20:00', end: '20:10', name: 'REP520 • SEG' },
    { start: '20:10', end: '22:00', name: 'RÁDIO520 - LIVE CONCERT' },
    { start: '22:00', end: '22:10', name: 'MÚSICA DO DIA 520 • SEG' },
    { start: '22:10', end: '24:00', name: 'RADIO520 CLASSIC HITS' },
];

const scheduleTuesday: Program[] = [
    { start: '00:00', end: '01:20', name: 'MUSICA DO DIA • TER', subtitle: 'playlist encerra às 00:11' },
    { start: '01:20', end: '01:30', name: 'REP520 • TER' },
    { start: '01:30', end: '05:00', name: 'INSÔNIA' },
    { start: '05:00', end: '08:00', name: 'GIRO520 • TER' },
    { start: '08:00', end: '08:10', name: 'MUSICA DO DIA • TER' },
    { start: '08:10', end: '10:00', name: 'CAFEINA' },
    { start: '10:00', end: '10:10', name: 'REP520 • TER' },
    { start: '10:10', end: '13:00', name: 'POP SHOW' },
    { start: '13:00', end: '13:10', name: 'MUSICA DO DIA • TER' },
    { start: '13:10', end: '16:50', name: 'MARATONA 520 • TERÇA' },
    { start: '16:50', end: '17:00', name: 'RESENHA 520' },
    { start: '17:00', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA - TERÇA-FEIRA' },
    { start: '18:10', end: '20:00', name: 'MIX520 GEN' },
    { start: '20:00', end: '20:10', name: 'REP520 • TER' },
    { start: '20:10', end: '22:00', name: 'BUSINESS ROCK' },
    { start: '22:00', end: '22:10', name: 'MUSICA DO DIA • TER' },
    { start: '22:10', end: '24:00', name: 'RADIO520 CLASSIC HITS' },
];

const scheduleWednesday: Program[] = [
    { start: '00:00', end: '01:20', name: 'MÚSICA DO DIA • QUA', subtitle: 'playlist encerra às 00:11' },
    { start: '01:20', end: '01:30', name: 'REP520 • QUA' },
    { start: '01:30', end: '05:00', name: 'INSÔNIA' },
    { start: '05:00', end: '08:00', name: 'GIRO 520 • QUA' },
    { start: '08:00', end: '08:10', name: 'MÚSICA DO DIA • QUA' },
    { start: '08:10', end: '10:00', name: 'CAFEINA' },
    { start: '10:00', end: '10:10', name: 'REP520 • QUA' },
    { start: '10:10', end: '13:10', name: 'POP SHOW' },
    { start: '13:10', end: '13:20', name: 'MÚSICA DO DIA • QUA' },
    { start: '13:20', end: '16:50', name: 'MARATONA QUARTA' },
    { start: '16:50', end: '17:00', name: 'RESENHA 520' },
    { start: '17:00', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA - QUARTA-FEIRA' },
    { start: '18:10', end: '20:00', name: 'MIX520 COM GUI MYNSSEN' },
    { start: '20:00', end: '20:10', name: 'REP520 • QUA' },
    { start: '20:10', end: '22:00', name: 'BEATS520' },
    { start: '22:00', end: '22:10', name: 'MÚSICA DO DIA • QUA' },
    { start: '22:10', end: '24:00', name: 'RADIO520 CLASSIC HITS' },
];

const scheduleThursday: Program[] = [
    { start: '00:00', end: '01:20', name: 'MÚSICA DO DIA • QUI', subtitle: 'playlist encerra às 00:11' },
    { start: '01:20', end: '01:30', name: 'REP520 • QUI' },
    { start: '01:30', end: '05:00', name: 'INSÔNIA' },
    { start: '05:00', end: '08:00', name: 'GIRO520 • QUI' },
    { start: '08:00', end: '08:10', name: 'MÚSICA DO DIA • QUI' },
    { start: '08:10', end: '10:00', name: 'CAFEINA' },
    { start: '10:00', end: '10:10', name: 'REP520 • QUI' },
    { start: '10:10', end: '13:10', name: 'POP SHOW' },
    { start: '13:10', end: '13:20', name: 'MÚSICA DO DIA • QUI' },
    { start: '13:20', end: '16:50', name: 'MARATONA QUINTA' },
    { start: '16:50', end: '17:00', name: 'RESENHA 520' },
    { start: '17:00', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA' },
    { start: '18:10', end: '20:00', name: 'MIX520 COM GUI MYNSSEN' },
    { start: '20:00', end: '20:10', name: 'REP520 • QUI' },
    { start: '20:10', end: '21:50', name: 'RÁDIO520 TOP20 #SEM16', subtitle: 'playlist encerra às 21:42' },
    { start: '21:50', end: '22:00', name: 'RADIO520 CLASSIC HITS' },
    { start: '22:00', end: '22:10', name: 'MÚSICA DO DIA • QUI' },
    { start: '22:10', end: '24:00', name: 'RADIO520 CLASSIC HITS' },
];

const scheduleFriday: Program[] = [
    { start: '00:00', end: '01:20', name: 'MÚSICA DO DIA • SEX', subtitle: 'playlist encerra às 00:10' },
    { start: '01:20', end: '01:30', name: 'REP 520 • SEX' },
    { start: '01:30', end: '05:00', name: 'INSÔNIA' },
    { start: '05:00', end: '08:00', name: 'GIRO520 • SEX' },
    { start: '08:00', end: '08:10', name: 'MÚSICA DO DIA • SEX' },
    { start: '08:10', end: '10:00', name: 'CAFEINA' },
    { start: '10:00', end: '10:10', name: 'REP 520 • SEX' },
    { start: '10:10', end: '13:10', name: 'POP SHOW' },
    { start: '13:10', end: '13:20', name: 'MÚSICA DO DIA • SEX' },
    { start: '13:20', end: '16:50', name: 'MARATONA • SEXTA' },
    { start: '16:50', end: '17:00', name: 'RESENHA 520' },
    { start: '17:00', end: '18:00', name: 'BR520' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA - SEXTA' },
    { start: '18:10', end: '20:00', name: 'MIX520 COM GUI MYNSSEN' },
    { start: '20:00', end: '20:10', name: 'REPÓRTER 520' },
    { start: '20:10', end: '22:00', name: 'A ERA DO ROCK #05' },
    { start: '22:00', end: '22:10', name: 'MÚSICA DO DIA • SEX' },
    { start: '22:10', end: '24:00', name: 'RADIO520 CLASSIC HITS' },
];

const scheduleSaturday: Program[] = [
    { start: '00:00', end: '00:10', name: 'MÚSICA DO DIA • SAB' },
    { start: '00:10', end: '02:00', name: '520 LOVE HITS' },
    { start: '02:00', end: '10:10', name: 'SUPERSEQUENCIA • SÁBADO' },
    { start: '10:10', end: '10:20', name: 'REP520 • SAB' },
    { start: '10:20', end: '11:50', name: 'RÁDIO520 TOP20 #SEM16' },
    { start: '11:50', end: '12:00', name: 'VIVA MELHOR com LU SKYLARK' },
    { start: '12:00', end: '14:00', name: 'ZIRIGUIDUM' },
    { start: '14:00', end: '14:10', name: 'MÚSICA DO DIA • SAB' },
    { start: '14:10', end: '18:00', name: 'MARATONA SAB' },
    { start: '18:00', end: '18:10', name: 'HORA DA AVE MARIA - SÁBADO' },
    { start: '18:10', end: '19:50', name: 'BR520' },
    { start: '19:50', end: '20:00', name: 'MÚSICA DO DIA • SAB' },
    { start: '20:00', end: '22:00', name: 'RADIO520 DANCE CLUB' },
    { start: '22:00', end: '24:00', name: 'RADIO520, A SUA RÁDIO' },
];


export const dailySchedules: Record<number, Program[]> = {
    0: scheduleSunday,
    1: scheduleMonday,
    2: scheduleTuesday,
    3: scheduleWednesday,
    4: scheduleThursday,
    5: scheduleFriday,
    6: scheduleSaturday,
};

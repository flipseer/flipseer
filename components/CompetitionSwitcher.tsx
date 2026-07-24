// lib/competitions.ts
// Central competition registry for Flipseer

export type Competition = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  status: 'live' | 'upcoming' | 'archive';
  badge: string;
  predictionEnabled: boolean;
  startDate?: string;
  endDate?: string;
};

export const COMPETITIONS: Competition[] = [
  {
    id: 'EPL 2026/27',
    name: 'Premier League 2026/27',
    shortName: 'EPL',
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    color: '#8B5CF6',
    status: 'live',
    badge: 'LIVE',
    predictionEnabled: true,
    startDate: '2026-08-21',
    endDate: '2027-05-23',
  },
  {
    id: 'World Cup 2026',
    name: 'FIFA World Cup 2026',
    shortName: 'World Cup',
    icon: '🏆',
    color: '#F59E0B',
    status: 'archive',
    badge: 'ARCHIVE',
    predictionEnabled: false,
    startDate: '2026-06-11',
    endDate: '2026-07-19',
  },
  {
    id: 'Champions League 2026/27',
    name: 'UEFA Champions League',
    shortName: 'UCL',
    icon: '⭐',
    color: '#F59E0B',
    status: 'upcoming',
    badge: 'SEP',
    predictionEnabled: false,
    startDate: '2026-09-16',
  },
  {
    id: 'Indian Super League 2026/27',
    name: 'Indian Super League',
    shortName: 'ISL',
    icon: '🇮🇳',
    color: '#FF6B35',
    status: 'upcoming',
    badge: 'NOV',
    predictionEnabled: false,
    startDate: '2026-11-01',
  },
  {
    id: 'NPFL 2026/27',
    name: 'Nigeria Premier League',
    shortName: 'NPFL',
    icon: '🇳🇬',
    color: '#008751',
    status: 'upcoming',
    badge: '2027',
    predictionEnabled: false,
    startDate: '2027-01-01',
  },
  {
    id: 'Liga 1 2026/27',
    name: 'Indonesia Liga 1',
    shortName: 'Liga 1',
    icon: '🇮🇩',
    color: '#CE1126',
    status: 'upcoming',
    badge: '2027',
    predictionEnabled: false,
    startDate: '2027-02-01',
  },
];

export const getActiveCompetition = () =>
  COMPETITIONS.find(c => c.status === 'live') || COMPETITIONS[0];

export const getLiveCompetitions = () =>
  COMPETITIONS.filter(c => c.predictionEnabled);

export const getArchiveCompetitions = () =>
  COMPETITIONS.filter(c => c.status === 'archive');

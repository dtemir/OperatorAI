type StatusesKeys = 'OPEN' | 'DISPATCHED' | 'RESOLVED';
export const STATUSES: Record<StatusesKeys, { key: StatusesKeys; display: string; color: string }> = {
  OPEN: {
    key: 'OPEN',
    display: 'Open',
    color: 'blue',
  },
  DISPATCHED: {
    key: 'DISPATCHED',
    display: 'Dispatched',
    color: 'orange',
  },
  RESOLVED: {
    key: 'RESOLVED',
    display: 'Resolved',
    color: 'green',
  },
};

type PrioritesKeys = 'HIGH' | 'MEDIUM' | 'LOW' | 'TBD';
export const PRIORITIES: Record<PrioritesKeys, { key: PrioritesKeys; display: string; color: string }> = {
  HIGH: { key: 'HIGH', display: 'High', color: 'red' },
  MEDIUM: { key: 'MEDIUM', display: 'Medium', color: 'orange' },
  LOW: { key: 'LOW', display: 'Low', color: 'yellow' },
  TBD: { key: 'TBD', display: 'TBD', color: 'blue' },
};

type EmergenciesKeys =
  | 'Medical Emergency'
  | 'Fire Emergency'
  | 'Traffic Accident'
  | 'Crime In Progress'
  | 'Other Emergency';
export const EMERGENCIES: Record<EmergenciesKeys, { key: EmergenciesKeys; display: string }> = {
  'Medical Emergency': { key: 'Medical Emergency', display: 'Medical Emergency' },
  'Fire Emergency': { key: 'Fire Emergency', display: 'Fire Emergency' },
  'Traffic Accident': { key: 'Traffic Accident', display: 'Traffic Accident' },
  'Crime In Progress': { key: 'Crime In Progress', display: 'Crime In Progress' },
  'Other Emergency': { key: 'Other Emergency', display: 'Other Emergency' },
};

export interface Geocode {
  lat: number;
  lng: number;
}

export type CallData = {
  key: string;
  callSid: string;
  streamSid: string;
  name: string;
  emergency: string;
  location?: string;
  geocode?: Geocode;
  phone: string;
  priority: PrioritesKeys;
  live: boolean;
  status: StatusesKeys;
  transcript?: string;
  dateCreated: string;
  dateDisconnected?: string;
};

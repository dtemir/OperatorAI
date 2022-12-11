type StatusesKeys = 'OPEN' | 'DISPATCHED' | 'RESOLVED';
export const STATUSES: Record<StatusesKeys, { key: StatusesKeys; color: string }> = {
  OPEN: {
    key: 'OPEN',
    color: 'blue',
  },
  DISPATCHED: {
    key: 'DISPATCHED',
    color: 'orange',
  },
  RESOLVED: {
    key: 'RESOLVED',
    color: 'green',
  },
};

type PrioritesKeys = 'HIGH' | 'MEDIUM' | 'LOW' | 'TBD';
export const PRIORITIES: Record<PrioritesKeys, { key: PrioritesKeys; color: string }> = {
  HIGH: { key: 'HIGH', color: 'red' },
  MEDIUM: { key: 'MEDIUM', color: 'orange' },
  LOW: { key: 'LOW', color: 'yellow' },
  TBD: { key: 'TBD', color: 'blue' },
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

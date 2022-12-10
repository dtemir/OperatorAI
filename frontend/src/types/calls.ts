export const STATUS_COLORS = {
  waiting: 'yellow',
  dispatched: 'green',
};

export const PRIORITIES = {
  4: { label: 'Urgent', color: 'red' },
  3: { label: 'High', color: 'orange' },
  2: { label: 'Normal', color: 'cyan' },
  1: { label: 'Low', color: 'gray' },
};

export type CallData = {
  name: string;
  created: string;
  emergency: string;
  location: string;
  phone: string;
  priority: keyof typeof PRIORITIES;
  live: boolean;
  status: keyof typeof STATUS_COLORS;
  transcript?: string;
};

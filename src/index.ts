export type CalendarEvent = {
    id: number;
    title: string;
    date: string;
    time?: string;
    reminder?: number; // Minutes before event (e.g., 10, 60, 1440)
  };
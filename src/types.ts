// src/types/index.ts (or src/types.ts)
export interface CalendarEvent {
    id: number;
    title: string;
    start: string;  // ISO 8601 Date string or Date object
    end: string;    // ISO 8601 Date string or Date object
    description?: string;
    location?: string;
    date: string;
    reminder?: number;
    
  }
  
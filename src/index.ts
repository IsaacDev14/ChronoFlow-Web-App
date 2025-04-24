export interface CalendarEvent {
  id: number;
  title: string;
  start: string;  // ISO 8601 Date string
  end: string;    // ISO 8601 Date string
  description?: string;
  location?: string;
  date: string;    // Only for display or selection purposes
  reminder?: number;
}

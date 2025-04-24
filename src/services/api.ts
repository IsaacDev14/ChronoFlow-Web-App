import { CalendarEvent } from "../types";

// Define the API URL
const API_URL = "http://localhost:3000/events";

// Fetch all events from the server
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch events");
  return response.json();
};

// Add a new event to the server
export const addEvent = async (event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) throw new Error("Failed to add event");
  return response.json();
};

// Update an existing event on the server
export const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const response = await fetch(`${API_URL}/${event.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) throw new Error("Failed to update event");
  return response.json();
};

// Delete an event from the server
export const deleteEvent = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete event");
};

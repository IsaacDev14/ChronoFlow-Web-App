import { useState } from "react";
import { CalendarEvent } from "../types";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import EventModal from "./EventModal";
import EditEventModal from "./EditEventModal";
import { deleteEvent } from "../services/api";

type Props = {
  events: CalendarEvent[];
  fetchEvents: () => void;
};

const WeekCard = ({ events, fetchEvents }: Props) => {
  const start = startOfWeek(new Date(), { weekStartsOn: 0 });
  const days = [...Array(7)].map((_, i) => addDays(start, i));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddEvent = (day: Date) => {
    setSelectedDate(day);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalOpen(false);
  };

  const handleDeleteEvent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const formatReminder = (reminder?: number) => {
    if (!reminder) return "No reminder";
    if (reminder === 10) return "10 min before";
    if (reminder === 60) return "1 hr before";
    if (reminder === 1440) return "1 day before";
    return `${reminder} min before`;
  };

  return (
    <section className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">This Week's Events</h1>
        <button
          onClick={() => handleAddEvent(new Date())}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          + Add Event
        </button>
      </div>
      <div className="space-y-4">
        {days.map((day) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.date), day));
          return (
            <div
              key={day.toDateString()}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-indigo-600">
                  {format(day, "EEEE, MMMM d")}
                </h2>
                <button
                  onClick={() => handleAddEvent(day)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Add
                </button>
              </div>
              {dayEvents.length > 0 ? (
                <ul className="space-y-2">
                  {dayEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-xs text-indigo-600 mt-1">
                          {formatReminder(event.reminder)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No events scheduled</p>
              )}
            </div>
          );
        })}
      </div>
      {modalOpen && (
        <EventModal
          selectedDate={selectedDate!}
          closeModal={() => setModalOpen(false)}
          fetchEvents={fetchEvents}
        />
      )}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          closeModal={() => setEditingEvent(null)}
          fetchEvents={fetchEvents}
        />
      )}
    </section>
  );
};

export default WeekCard;
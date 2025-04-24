import { useEffect, useState } from "react";
import MonthCard from "../components/MonthCard";
import DayCard from "../components/DayCard";
import WeekCard from "../components/WeekCard";
import SideBar from "../components/SideBar";
import EditEventModal from "../components/EditEventModal";
import { CalendarEvent } from "../types";
import { fetchEvents, deleteEvent } from "../services/api";
import { requestNotificationPermission, scheduleNotifications } from "../utils/notificationService";
import { format } from "date-fns";

const Home = () => {
  const [view, setView] = useState<"day" | "week" | "month">("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [highlightedEvent, setHighlightedEvent] = useState<CalendarEvent | null>(null); // For highlighted event

  const fetchEventsData = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
        fetchEventsData();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setHighlightedEvent(event); // Set the highlighted event on click
  };

  useEffect(() => {
    fetchEventsData();
    requestNotificationPermission();
    const interval = setInterval(() => {
      scheduleNotifications(events);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [events]);

  const formatReminder = (reminder?: number) => {
    if (!reminder) return "No reminder";
    if (reminder === 10) return "10 min before";
    if (reminder === 60) return "1 hr before";
    if (reminder === 1440) return "1 day before";
    return `${reminder} min before`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar
        setView={setView}
        currentView={view}
        events={events}
        onEventClick={handleEventClick} // Pass down the handler
      />
      <main className="flex-1 p-6 overflow-auto">
        {view === "day" && <DayCard events={events} fetchEvents={fetchEventsData} />}
        {view === "week" && <WeekCard events={events} fetchEvents={fetchEventsData} />}
        {view === "month" && (
          <>
            <MonthCard
              events={events}
              fetchEvents={fetchEventsData}
              highlightedEvent={highlightedEvent} // Pass down the highlighted event
            />
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Events</h2>
              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-800 truncate">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-indigo-600">
                          {formatReminder(event.reminder)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {editingEvent && (
          <EditEventModal
            event={editingEvent}
            closeModal={() => setEditingEvent(null)}
            fetchEvents={fetchEventsData}
          />
        )}
      </main>
    </div>
  );
};

export default Home;

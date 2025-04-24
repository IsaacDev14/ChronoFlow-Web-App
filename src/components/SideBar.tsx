// components/SideBar.tsx
import { CalendarEvent } from "../types";
import { format } from "date-fns";

type SideBarProps = {
  setView: (view: "day" | "week" | "month") => void;
  currentView: "day" | "week" | "month";
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

const SideBar = ({ setView, currentView, events, onEventClick }: SideBarProps) => {
  const formatReminder = (reminder?: number) => {
    if (!reminder) return "No reminder";
    if (reminder === 10) return "10 min before";
    if (reminder === 60) return "1 hr before";
    if (reminder === 1440) return "1 day before";
    return `${reminder} min before`;
  };

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl flex flex-col">
      <header className="text-3xl font-bold text-center py-6 border-b border-blue-700 bg-blue-950">
        📅 Calendar
      </header>

      <nav className="px-4 py-6 space-y-4">
        {["day", "week", "month"].map((view) => (
          <button
            key={view}
            onClick={() => setView(view as "day" | "week" | "month")}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md ${
              currentView === view
                ? "bg-emerald-500 text-white ring-2 ring-white"
                : "bg-orange-400 hover:bg-orange-500 text-white"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)} View
          </button>
        ))}
      </nav>

      <section className="flex-1 px-4 py-6 overflow-y-auto bg-blue-700 rounded-t-3xl shadow-inner custom-scrollbar">
        <h3 className="text-lg font-semibold text-white mb-4 border-b border-blue-500 pb-2">
          Upcoming Events
        </h3>

        {events.length === 0 ? (
          <p className="text-sm text-gray-300 italic">No upcoming events</p>
        ) : (
          <ul className="space-y-3">
            {events.slice(0, 10).map((event) => (
              <li
                key={event.id}
                onClick={() => onEventClick(event)}
                className="p-3 bg-blue-800/60 rounded-xl border border-blue-600/40 shadow-sm hover:bg-blue-800/80 transition-colors duration-200 cursor-pointer"
              >
                <p className="text-sm font-medium truncate">{event.title}</p>
                <p className="text-xs text-gray-300">{format(new Date(event.date), "MMM d, yyyy")}</p>
                <p className="text-xs text-indigo-300 mt-1">{formatReminder(event.reminder)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
};

export default SideBar;

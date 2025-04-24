// components/MonthCard.tsx
import { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import EventModal from "./EventModal";
import { CalendarEvent } from "../types";

type MonthCardProps = {
  events: CalendarEvent[];
  fetchEvents: () => void;
  highlightedEvent?: CalendarEvent | null;
};

const MonthCard = ({ events, fetchEvents, highlightedEvent }: MonthCardProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    if (highlightedEvent) {
      setSelectedDate(new Date(highlightedEvent.date));
    }
  }, [highlightedEvent]);

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setDraggedEvent(null);
    setModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    e.dataTransfer.setData("eventId", event.id.toString());
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, day: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    const event = events.find((ev) => ev.id.toString() === eventId);
    if (!event) return;

    const updatedEvent = { ...event, date: format(day, "yyyy-MM-dd") };

    try {
      const res = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      if (res.ok) {
        fetchEvents();
      } else {
        console.error("Failed to update event:", res.statusText);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }

    setDraggedEvent(null);
  };

  const formatReminder = (reminder?: number) => {
    if (!reminder) return "No reminder";
    if (reminder === 10) return "10 min before";
    if (reminder === 60) return "1 hr before";
    if (reminder === 1440) return "1 day before";
    return `${reminder} min before`;
  };

  const header = () => (
    <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold">
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="hover:scale-110 transition">
        Prev Month
      </button>
      <h2 className="text-2xl tracking-wider">{format(currentMonth, "MMMM yyyy")}</h2>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="hover:scale-110 transition">
        Next Month
      </button>
    </div>
  );

  const daysLabels = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
    return (
      <div className="grid grid-cols-7 bg-gray-300 border-b border-gray-300 text-base font-medium text-gray-700">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="py-4 text-center uppercase tracking-wide">
            {format(addDays(startDate, i), "EEE")}
          </div>
        ))}
      </div>
    );
  };

  const generateCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    let day = startDate;
    const weeks = [];

    while (day <= endDate) {
      const days = [...Array(7)].map(() => {
        const thisDay = day;
        const formatted = format(thisDay, "d");
        const isCurrentMonth = isSameMonth(thisDay, monthStart);
        const isToday = isSameDay(thisDay, new Date());
        const isSelected = isSameDay(thisDay, selectedDate);
        const dayEvents = events.filter((e) => isSameDay(new Date(e.date), thisDay));

        day = addDays(day, 1);

        return (
          <div
            key={thisDay.toString()}
            onClick={() => handleDateClick(thisDay)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, thisDay)}
            className={`p-3 h-24 border cursor-pointer transition-all ease-in-out duration-200 flex flex-col justify-start items-start relative
              ${isCurrentMonth ? "bg-white hover:bg-blue-100" : "bg-gray-50 text-gray-400"}
              ${isToday ? "border-blue-600 border-2 bg-gray-200" : ""}
              ${isSelected ? "ring-4 ring-blue-700 bg-blue-200" : ""}
            `}
          >
            <span className="text-sm font-semibold absolute top-2 left-3">{formatted}</span>
            <ul className="mt-6 text-xs space-y-1 w-full">
              {dayEvents.map((event) => (
                <li
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  className="truncate px-2 py-1 rounded bg-blue-300 hover:bg-blue-400 cursor-move"
                >
                  <div>{event.title}</div>
                  <div className="text-indigo-700 text-xs">{formatReminder(event.reminder)}</div>
                </li>
              ))}
            </ul>
          </div>
        );
      });

      weeks.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
    }

    return <div>{weeks}</div>;
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden max-w-7xl mx-auto mt-8 border border-gray-200">
      {header()}
      <div className="p-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Event
        </button>
      </div>
      {daysLabels()}
      {generateCalendar()}
      {modalOpen && (
        <EventModal
          selectedDate={selectedDate}
          closeModal={() => setModalOpen(false)}
          fetchEvents={fetchEvents}
          initialEvent={draggedEvent}
        />
      )}
    </div>
  );
};

export default MonthCard;

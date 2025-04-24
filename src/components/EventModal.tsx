import { useState} from "react";
import { addEvent } from "../services/api";
import { CalendarEvent } from "../types";

type EventModalProps = {
  selectedDate: Date;
  closeModal: () => void;
  fetchEvents: () => void;
  initialEvent?: CalendarEvent | null;
};

const EventModal = ({ selectedDate, closeModal, fetchEvents, initialEvent }: EventModalProps) => {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [date, setDate] = useState(initialEvent ? new Date(initialEvent.start).toISOString().split("T")[0] : selectedDate.toISOString().split("T")[0]);
  const [reminder, setReminder] = useState<number | undefined>(initialEvent?.reminder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(date);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

    const newEvent: CalendarEvent = {
      id: initialEvent ? initialEvent.id : Date.now(),  // Use a new ID if creating a new event
      title,
      date,
      reminder,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    try {
      await addEvent(newEvent);
      fetchEvents();
      closeModal();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{initialEvent ? "Edit" : "Add"} Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <div className="mb-5">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">
              Reminder
            </label>
            <select
              id="reminder"
              value={reminder || ""}
              onChange={(e) => setReminder(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">No reminder</option>
              <option value="10">10 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

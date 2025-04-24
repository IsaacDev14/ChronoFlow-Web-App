import { useState } from "react";
import { CalendarEvent } from "../types";
import { updateEvent } from "../services/api";

type EditEventModalProps = {
  event: CalendarEvent;
  closeModal: () => void;
  fetchEvents: () => void;
};

const EditEventModal = ({ event, closeModal, fetchEvents }: EditEventModalProps) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [reminder, setReminder] = useState<number | undefined>(event.reminder);
  const [start, setStart] = useState(event.start);
  const [end, setEnd] = useState(event.end);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure you include `start` and `end` in the updated event
      const updatedEvent: CalendarEvent = {
        id: event.id,
        title,
        date,
        reminder,
        start, // Add start
        end,   // Add end
      };

      await updateEvent(updatedEvent);
      fetchEvents();
      closeModal();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Event</h2>
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
          <div className="mb-5">
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              id="start"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              id="end"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;

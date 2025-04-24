import { CalendarEvent } from "../types";
import { format } from "date-fns";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported in this browser");
    return false;
  }

  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return true;
};

export const scheduleNotifications = (events: CalendarEvent[]) => {
  const now = new Date();
  events.forEach((event) => {
    if (event.reminder) {
      const eventDateTime = new Date(event.date);
      const reminderTime = new Date(eventDateTime.getTime() - event.reminder * 60 * 1000);

      if (reminderTime > now && reminderTime < new Date(now.getTime() + 60 * 1000)) {
        new Notification(`Reminder: ${event.title}`, {
          body: `Event starts on ${format(eventDateTime, "MMM d, yyyy")}`,
          icon: "/calendar-icon.png", // Optional: Add an icon in public/
        });
      }
    }
  });
};
// isaac the floor is yours
import { useState } from "react";
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

const MonthCard = () => {
  //state for the current month and state fro the selected date
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());


  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    console.log("Clicked:", format(day, 'PPP'));
  };

  //the header details including day name
  const header = () => (
    <div className="flex justify-center gap-10 items-center px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="hover:scale-110 transition"
      >
        prev Month
      </button>
      <h2 className="text-2xl tracking-wider">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="hover:scale-110 transition"
      >
        Next Month
      </button>
    </div>
  );

  const daysLabels = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    return (
      <div className="grid grid-cols-7 bg-gray-300  border-b border-gray-300 text-base font-medium text-gray-700">
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
        const isSelected = selectedDate && isSameDay(thisDay, selectedDate);

        day = addDays(day, 1);

        return (
          <div
            key={thisDay.toString()}
            onClick={() => handleDateClick(thisDay)}
            className={`p-3 h-16 sm:h-20 md:h-24 border cursor-pointer transition-all ease-in-out duration-200 
              flex flex-col justify-start items-start overflow-hidden relative
              ${
                isCurrentMonth
                  ? "bg-white hover:bg-blue-100"
                  : "bg-gray-50 text-gray-400"
              }
              ${isToday ? "border-blue-600 border-2 bg-gray-500" : ""}
              ${isSelected ? "ring-4 ring-blue-700 bg-gray-500" : ""}`}
          >
            <span className="text-sm font-semibold absolute top-2 left-3">
              {formatted}
            </span>
          </div>
        );
      });

      weeks.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
    }
    return <div>{weeks}</div>


  };

  return <div className="w-full bg-white rounded-3xl shadow-lg overflow-hidden max-w-7xl mx-auto mt-8 border border-gray-200">
    {header()}
    {daysLabels()}
    {generateCalendar()}
  </div>;
};

export default MonthCard;


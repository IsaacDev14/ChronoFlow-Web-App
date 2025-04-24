import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { CalendarEvent } from "../types";

type CalendarProps = {
  events: CalendarEvent[];
  onDragEnd: (result: DropResult) => void;
  onEventClick: (event: CalendarEvent) => void;
};

const Calendar = ({ events, onDragEnd, onEventClick }: CalendarProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="calendar">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="event-card">
                      <h3>{event.title}</h3>
                      <p>{event.date}</p>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext> // ✅ This was missing!
  );
};

export default Calendar;

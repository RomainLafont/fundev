import { create } from 'zustand';

interface EventsState {
  events: Event[];
  addEvent: (event: Event) => void;
  clearEvents: () => void;
}

const useEventsStore = create<EventsState>((set) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  clearEvents: () => set({ events: [] }),
}));

export const useEventsContext = () => {
  const { events, addEvent, clearEvents } = useEventsStore();

  // Wagmi hook to fetch events will be added here

  return {
    events,
    clearEvents,
  };
};
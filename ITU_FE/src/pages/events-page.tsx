import EventCard from '@/components/events/eventCard';

export function EventsPage() {
  return (
    <div className="flex flex-col w-[min(1400px,95%)] items-center justify-center">
      <h1 className="text-4xl font-bold">Events</h1>
      <div className="flex flex-wrap gap-4 w-full mt-4">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </div>
  );
}

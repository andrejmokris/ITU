import { CreateEvent } from '@/components/events/createEvent';
import EventCard from '@/components/events/eventCard';
import { ThriftEvent } from '@/types/event';
import { api_client } from '@/utils/api-client';
import { useQuery } from 'react-query';

export function EventsPage() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['eventsQuery'],
    queryFn: async () => {
      const { data } = await api_client.get('events');
      return data as Array<ThriftEvent>;
    }
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[min(1400px,95%)] items-center justify-center">
      <h1 className="text-4xl font-bold">Events</h1>
      <CreateEvent />
      <div className="flex flex-wrap gap-4 w-full mt-4">
        {isSuccess &&
          data?.map((thriftEvent) => <EventCard thriftEvent={thriftEvent} key={`thriftEvent${thriftEvent.id}`} />)}
      </div>
    </div>
  );
}

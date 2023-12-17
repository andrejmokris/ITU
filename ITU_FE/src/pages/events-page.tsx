/**
 * Author: Andrej Nespor xnespo10
 */

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
    <main className="p-4 md:p-6 lg:p-8 w-full flex items-center justify-center">
      <div className="flex flex-col w-[min(1400px,95%)] items-center justify-center">
        <div className="flex w-full justify-between">
          <h1 className="text-2xl font-semibold">Events</h1>
          <CreateEvent />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isSuccess &&
            data?.map((thriftEvent) => <EventCard thriftEvent={thriftEvent} key={`thriftEvent${thriftEvent.id}`} />)}
        </div>
      </div>
    </main>
  );
}

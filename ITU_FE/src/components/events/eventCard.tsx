import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { ThriftEvent } from '@/types/event';
import { api_client } from '@/utils/api-client';
import { SVGProps } from 'react';
import { JSX } from 'react/jsx-runtime';

export default function EventCard({ thriftEvent }: { thriftEvent: ThriftEvent }) {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden w-full md:w-2/3 lg:w-1/3 mx-auto">
      <div className="relative">
        <img
          alt="Thrift show event"
          className="w-full h-[] object-cover"
          height="100"
          src={thriftEvent.imageURL ? thriftEvent.imageURL : 'https://generated.vusercontent.net/placeholder.svg'}
          style={{
            aspectRatio: '400/200',
            objectFit: 'cover'
          }}
          width="400"
        />
        <div className="absolute bottom-0 bg-black bg-opacity-60 text-white px-4 py-2">
          <h3 className="text-xl font-semibold">{thriftEvent.title}</h3>
          <p className="text-sm">
            <CalendarDaysIcon className="inline-block mr-1 h-4 w-4" />
            {new Date(thriftEvent.startDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="text-gray-600">{thriftEvent.description}</p>
        <div className="flex justify-between items-center">
          <Button className="text-sm" variant="outline">
            Learn More
          </Button>
          {thriftEvent.EventParticipation.length > 0 ? (
            <p className="text-red-500 hover:text-red-600 text-sm">Remove from calendar</p>
          ) : (
            <p className="text-blue-500 hover:text-blue-600 text-sm">Add to Calendar</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarDaysIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}

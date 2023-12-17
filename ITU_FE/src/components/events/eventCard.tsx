import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { ThriftEvent } from '@/types/event';
import { api_client } from '@/utils/api-client';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '../ui/use-toast';
import useAuthStore from '@/store/user-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { CalendarDaysIcon, FileEdit, MoreHorizontal, Trash } from 'lucide-react';
import { EditEvent } from './editEvent';

export default function EventCard({ thriftEvent }: { thriftEvent: ThriftEvent }) {
  const queryClient = useQueryClient();
  const userStore = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const mutation = useMutation({
    mutationKey: ['toggleEventAttendance'],
    mutationFn: async () => {
      if (thriftEvent.EventParticipation.length > 0) {
        const { data } = await api_client.delete(`/events/signup/${thriftEvent.id}`);
        return data;
      } else {
        const { data } = await api_client.post(`/events/signup/${thriftEvent.id}`);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsQuery'] });
      toast({
        title:
          thriftEvent.EventParticipation.length > 0
            ? 'You are signed out from the event'
            : 'You are signed up for the event'
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  const deleteEventMutation = useMutation({
    mutationKey: ['deleteEventAttendance'],

    mutationFn: async () => {
      const { data } = await api_client.delete(`/events/${thriftEvent.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsQuery'] });
      toast({
        title: 'Event deleted from the database'
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative">
        <img
          alt="Thrift show event"
          className="w-full object-cover"
          height="100"
          src={
            thriftEvent.imageURL
              ? thriftEvent.imageURL
              : 'https://sustainablefashionconsumption.org/wp-content/uploads/2022/02/Karpova.jpg'
          }
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
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userStore.user?.id === thriftEvent.authorId && (
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <FileEdit className="w-4 mr-2" />
                  Edit the event
                </DropdownMenuItem>
              )}
              {userStore.user?.id === thriftEvent.authorId && (
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="w-4 mr-2" />
                  Delete the event
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="text-gray-600">{thriftEvent.description}</p>
        <div className="flex justify-between items-center">
          <Button className="text-sm" variant="outline">
            Learn More
          </Button>
          {thriftEvent.EventParticipation.length > 0 ? (
            <button onClick={() => mutation.mutateAsync()} className="text-red-500 hover:text-red-600 text-sm">
              Remove from calendar
            </button>
          ) : (
            <button onClick={() => mutation.mutateAsync()} className="text-blue-500 hover:text-blue-600 text-sm">
              Add to Calendar
            </button>
          )}
        </div>
      </CardContent>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action cannot be undone. This will permanently delete the ${thriftEvent.title} from the system.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEventMutation.mutateAsync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditEvent thriftEvent={thriftEvent} open={isEditDialogOpen} setOpen={setIsEditDialogOpen} />
    </Card>
  );
}

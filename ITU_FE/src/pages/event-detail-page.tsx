import { useParams } from 'react-router-dom';
import { CardTitle, CardHeader, CardContent, Card } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';
import { api_client } from '@/utils/api-client';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuthStore from '@/store/user-store';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { CreateComment } from '@/components/events/createComment';
import { CommentCard } from '@/components/events/commentCard';

export type EventComment = {
  user: {
    name: string;
  };
  EventCommentLike: {
    id: number;
    createdAt: Date;
    commentId: number;
    userId: number;
  }[];
} & {
  id: number;
  createdAt: Date;
  text: string;
  eventId: number;
  userId: number;
};

export default function EventDetailPage() {
  const params = useParams();
  const userStore = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['toggleEventAttendance'],
    mutationFn: async (value: boolean) => {
      if (!value) {
        const { data } = await api_client.delete(`/events/signup/${params.id}`);
        return data;
      } else {
        const { data } = await api_client.post(`/events/signup/${params.id}`);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`eventsQuery${params.id}`] });
      toast({
        title: 'Changes saved'
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: [`eventsQuery${params.id}`],
    queryFn: async () => {
      const { data } = await api_client.get(`events/${params.id}`);
      return data as {
        author: {
          name: string;
        };
        EventParticipation: {
          id: number;
          eventId: number;
          userId: number;
          createdAt: Date;
        }[];
      } & {
        id: number;
        title: string;
        createdAt: Date;
        description: string | null;
        imageURL: string | null;
        startDate: Date;
        authorId: number;
      };
    }
  });

  const { data: CommentData } = useQuery({
    queryKey: [`eventsQuery${params.id}Comment`],
    queryFn: async () => {
      const { data } = await api_client.get(`events/comments/${params.id}`);
      console.log(data);
      return data as Array<EventComment>;
    }
  });

  if (isLoading) {
    return <p className="font-semibold text-2xl">Loading...</p>;
  }

  if (!data || isError) {
    return <p className="font-semibold text-2xl">Loading...</p>;
  }

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-[min(1400px,95%)] flex items-center justify-center">
        <main className="p-4 space-y-4">
          <Card className="rounded-lg overflow-hidden shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{data?.title}</CardTitle>
              <p className="text-gray-500">
                {data &&
                  new Date(data.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  alt="Event cover image"
                  className="rounded-lg object-cover h-[400px] w-full"
                  height="400"
                  src={
                    data.imageURL
                      ? data.imageURL
                      : 'https://sustainablefashionconsumption.org/wp-content/uploads/2022/02/Karpova.jpg'
                  }
                  style={{
                    aspectRatio: '600/400',
                    objectFit: 'cover'
                  }}
                  width="600"
                />
                <div className="space-y-4">
                  <p>{data.description}</p>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4" />
                    <p className="font-semibold">{data.EventParticipation.length} going</p>
                  </div>
                  {data.EventParticipation.filter((item) => item.userId == userStore.user?.id).length > 0 ? (
                    <button
                      onClick={() => mutation.mutateAsync(false)}
                      className="text-red-500 hover:text-red-600 text-base font-semibold"
                    >
                      Remove from calendar
                    </button>
                  ) : (
                    <button
                      onClick={() => mutation.mutateAsync(true)}
                      className="text-blue-500 hover:text-blue-600 text-base font-semibold"
                    >
                      Add to Calendar
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex space-x-4 pt-5">
              <h2 className="text-2xl font-bold">Posts</h2>
              <CreateComment />
            </div>
            {CommentData?.map((item) => (
              <CommentCard key={`commentItem${item.id}`} CommentData={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

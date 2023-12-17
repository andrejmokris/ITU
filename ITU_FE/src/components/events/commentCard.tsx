import { CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { EventComment } from '@/pages/event-detail-page';
import { useMutation, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';
import useAuthStore from '@/store/user-store';
import { useParams } from 'react-router-dom';

export function CommentCard({ CommentData }: { CommentData: EventComment }) {
  const queryClient = useQueryClient();
  const params = useParams();
  const userStore = useAuthStore();
  const mutation = useMutation({
    mutationKey: ['toggleEventAttendance'],
    mutationFn: async () => {
      const { data } = await api_client.post(`/events/like/${CommentData.id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`eventsQuery${params.id}Comment`] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  return (
    <Card className="rounded-lg overflow-hidden shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10 rounded-full">
            {CommentData.user.name.split(' ').length > 0 ? (
              <AvatarFallback>
                {CommentData.user.name.split(' ')[0][0] + CommentData.user.name.split(' ')[1][0]}
              </AvatarFallback>
            ) : (
              <AvatarFallback>{CommentData.user.name[0]}</AvatarFallback>
            )}
          </Avatar>
          <p>{CommentData.user.name}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{CommentData.text}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Button
            variant="link"
            className={`${
              CommentData.EventCommentLike.filter((item) => item.userId === userStore.user?.id).length > 0 &&
              'text-blue-500'
            }`}
            onClick={() => mutation.mutateAsync()}
          >
            Like
          </Button>
          <p>{CommentData.EventCommentLike.length} Likes</p>
        </div>
      </CardFooter>
    </Card>
  );
}

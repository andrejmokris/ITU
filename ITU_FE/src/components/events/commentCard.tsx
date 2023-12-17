import { CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { EventComment } from '@/pages/event-detail-page';
import { useMutation, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';
import useAuthStore from '@/store/user-store';
import { useParams } from 'react-router-dom';
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
import { MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';

export function CommentCard({ CommentData }: { CommentData: EventComment }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const userStore = useAuthStore();
  const mutation = useMutation({
    mutationKey: ['toggleCommentLike'],
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

  const deleteMutation = useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: async () => {
      const { data } = await api_client.delete(`/events/comments/${CommentData.id}`);
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Comment successfully deleted'
      });
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
      <CardHeader className="flex flex-row justify-between">
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
        {userStore.user?.id === CommentData.userId && (
          <div>
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
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This action cannot be undone. This will permanently delete the comment.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutateAsync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

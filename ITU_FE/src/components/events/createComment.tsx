import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

const formSchema = z.object({
  text: z.string()
});

export function CreateComment() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: ''
    }
  });

  const mutation = useMutation({
    mutationKey: ['createEventMutation'],
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data } = await api_client.post(`events/comments/${params.id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`eventsQuery${params.id}Comment`] });
      toast({
        title: 'New comment created'
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.'
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Comment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Comment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Input placeholder="Thrifty Thursdays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Comment</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useMutation, useQueryClient } from 'react-query';
import { api_client } from '@/utils/api-client';
import { toast } from '../ui/use-toast';
import { MarketPlaceItem } from '@/pages/marketplace-page';

const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  price: z.string(),
  size: z.string()
});

export function EditMarketPlaceItem({
  marketItem,
  open,
  setOpen
}: {
  marketItem: MarketPlaceItem;
  open: boolean;
  setOpen: (x: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: marketItem.title,
      description: marketItem.description,
      price: String(marketItem.price),
      size: marketItem.size
    }
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['editMarketPlaceItemMutation'],
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data } = await api_client.put(`/marketplace/${marketItem.id}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketPlaceQuery'] });
      toast({
        title: 'Item edited'
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
    console.log(values);
    mutation.mutateAsync(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sell your clothes</DialogTitle>
          <DialogDescription>Edit the post. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Adidas jacket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item description</FormLabel>
                  <FormControl>
                    <Input placeholder="This will be the..." type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item price</FormLabel>
                    <FormControl>
                      <Input placeholder="$23" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item size</FormLabel>
                    <FormControl>
                      <Input placeholder="M" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/schemas/log-in-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useNavigate } from 'react-router-dom';
import { api_client } from '@/utils/api-client';

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const resp = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/log-in`, values);
      localStorage.setItem('authToken', resp.data.token);
      api_client.defaults.headers.common['Authorization'] = `Bearer ${resp.data.token}`;
      navigate('/');
    } catch (error) {
      form.setError('password', {
        type: undefined,
        message: 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or create an account</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        Sign Up
      </Button>
    </div>
  );
}

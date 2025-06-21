'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useAuthModalStore } from '@/stores/useAuthModalStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const formSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
});

export function LoginModal() {
  const { isLoginOpen, closeLogin, switchToRegister } = useAuthModalStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await signIn('credentials', {
      ...values,
      redirect: false,
    });

    if (result?.ok) {
      closeLogin();
    } else {
      // Handle error
      console.error('Failed to login');
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={closeLogin}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Se connecter</Button>
            </DialogFooter>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Pas encore de compte?{' '}
            <Button variant="link" onClick={switchToRegister}>
              S'inscrire
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

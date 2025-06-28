'use client';
import { useState } from 'react';
import { AddressForm } from './AddressForm';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AddressFormData } from '@/types/address';

export function AddressManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  type Address = {
    id?: string | number;
    street: string;
    postalCode: string;
    city: string;
    state?: string;
    country: string;
    isDefault?: boolean;
  };
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const queryClient = useQueryClient();

  // Récupérer les adresses
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await fetch('/api/addresses');
      return res.json();
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => 
      fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Adresse créée avec succès');
      setIsDialogOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => {
      if (!editingAddress) {
        return Promise.reject(new Error('No address selected for update'));
      }
      return fetch(`/api/addresses/${editingAddress.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Adresse mise à jour');
      setIsDialogOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!editingAddress) {
        return Promise.reject(new Error('No address selected for deletion'));
      }
      return fetch(`/api/addresses/${editingAddress.id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Adresse supprimée');
      setIsDialogOpen(false);
    }
  });

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingAddress) {
      await updateMutation.mutateAsync(data);
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mes adresses</h2>
        <Button onClick={() => {
          setEditingAddress(null);
          setIsDialogOpen(true);
        }}>
          Ajouter une adresse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses?.map((address: any) => (
          <div key={address.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">
                  {address.street}, {address.postalCode} {address.city}
                </p>
                <p className="text-sm text-gray-500">
                  {address.state && `${address.state}, `}
                  {address.country}
                </p>
                {address.isDefault && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Par défaut
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleEdit(address)}
              >
                Modifier
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </DialogTitle>
          </DialogHeader>
          {/* <AddressForm
            initialData={editingAddress}
            onSubmit={handleSubmit}
            onDelete={editingAddress ? () => deleteMutation.mutate() : undefined}
            isLoading={
              createMutation.isLoading || 
              updateMutation.isLoading || 
              deleteMutation.isLoading
            }
          /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
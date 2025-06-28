'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressFormData, AddressSchema } from '@/types/address';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AddressFormProps {
  initialData?: AddressFormData & { id?: string };
  onSubmit: (data: AddressFormData) => Promise<void>;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function AddressForm({ 
  initialData, 
  onSubmit, 
  onDelete,
  isLoading 
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initialData || {
      isDefault: false
    }
  });

  const isDefault = watch('isDefault');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Adresse*</Label>
          <Input
            id="street"
            {...register('street')}
            placeholder="123 Rue de l'Exemple"
          />
          {errors.street && (
            <p className="text-sm text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ville*</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder="Paris"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Code postal*</Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="75001"
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Région/Département</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="Île-de-France"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Pays*</Label>
          <Input
            id="country"
            {...register('country')}
            placeholder="France"
          />
          {errors.country && (
            <p className="text-sm text-red-500">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="isDefault"
          checked={isDefault}
          onCheckedChange={(value: any) => setValue('isDefault', value)}
        />
        <Label htmlFor="isDefault">Définir comme adresse par défaut</Label>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {initialData?.id && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
          >
            Supprimer
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
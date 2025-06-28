import { NextResponse } from 'next/server';
import { AddressSchema } from '@/types/address';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = await request.json();
  const parsed = AddressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  // Vérifier que l'adresse appartient à l'utilisateur
  const existingAddress = await prisma.address.findUnique({
    where: { id: params.id, userId: user.id }
  });

  if (!existingAddress) {
    return new NextResponse('Address not found', { status: 404 });
  }

  // Si c'est l'adresse par défaut, désactiver les autres
  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true, NOT: { id: params.id } },
      data: { isDefault: false }
    });
  }

  const updatedAddress = await prisma.address.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json(updatedAddress);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user ={ id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  // Vérifier que l'adresse appartient à l'utilisateur
  const address = await prisma.address.findUnique({
    where: { id: params.id, userId: user.id }
  });

  if (!address) {
    return new NextResponse('Address not found', { status: 404 });
  }

  // Ne pas supprimer l'adresse si c'est la seule
  const count = await prisma.address.count({ where: { userId: user.id } });
  if (count <= 1) {
    return new NextResponse('Cannot delete the only address', { status: 400 });
  }

  await prisma.address.delete({ where: { id: params.id } });

  // Si on supprime l'adresse par défaut, en définir une nouvelle
  if (address.isDefault) {
    const newDefault = await prisma.address.findFirst({
      where: { userId: user.id, NOT: { id: params.id } }
    });
    if (newDefault) {
      await prisma.address.update({
        where: { id: newDefault.id },
        data: { isDefault: true }
      });
    }
  }

  return new NextResponse(null, { status: 204 });
}
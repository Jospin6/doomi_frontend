import { NextResponse } from 'next/server';
import { AddressSchema } from '@/types/address';

export async function GET() {
  const user = { id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: 'desc' }
  });

  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  const user = { id: '123'};
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = await request.json();
  const parsed = AddressSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  // Si c'est l'adresse par défaut, désactiver les autres
  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: {
      ...parsed.data,
      userId: user.id
    }
  });

  return NextResponse.json(address, { status: 201 });
}
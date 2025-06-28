import { NextResponse } from 'next/server';

export async function GET() {
  const user = { id: '123', isAdmin: true }; // Simulating an admin user
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const warehouses = await prisma.warehouse.findMany({
    include: {
      address: true,
      _count: {
        select: { inventory: true }
      }
    }
  });

  return NextResponse.json(warehouses.map((w: any) => ({
    ...w,
    currentStock: w._count.inventory,
    address: w.address
  })));
}

export async function POST(request: Request) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { name, address, capacity } = await request.json();

  const warehouse = await prisma.warehouse.create({
    data: {
      name,
      capacity,
      address: {
        create: address
      }
    },
    include: { address: true }
  });

  return NextResponse.json(warehouse, { status: 201 });
}
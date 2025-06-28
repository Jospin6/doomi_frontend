import { NextResponse } from 'next/server';
import { DepositSchema } from '@/types/deposit';

export async function GET() {
  const user = { id: '123', isAdmin: true };
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const deposits = await prisma.productDeposit.findMany({
    where: { userId: user.id },
    include: {
      product: { select: { name: true, sku: true } },
      warehouse: { select: { name: true } }
    },
    orderBy: { depositDate: 'desc' }
  });

  return NextResponse.json(deposits);
}

export async function POST(request: Request) {
  const user = { id: '123', isAdmin: true };
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = await request.json();
  const parsed = DepositSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(parsed.error, { status: 400 });
  }

  const deposit = await prisma.productDeposit.create({
    data: {
      userId: user.id,
      productId: parsed.data.productId,
      warehouseId: parsed.data.warehouseId,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes
    },
    include: {
      product: { select: { name: true, sku: true } },
      warehouse: { select: { name: true } }
    }
  });

  return NextResponse.json(deposit, { status: 201 });
}
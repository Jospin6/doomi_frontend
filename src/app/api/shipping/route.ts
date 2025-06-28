import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const user = { id: '123', isAdmin: false };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { orderId, address, method, cost } = await request.json();

  const shipping = await prisma.shipping.create({
    data: {
      orderId,
      address,
      method,
      cost,
      status: 'PENDING'
    }
  });

  return NextResponse.json(shipping);
}

export async function GET(request: Request) {
  const user = { id: '123', isAdmin: false };
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) return new NextResponse('Order ID required', { status: 400 });

  const shipping = await prisma.shipping.findUnique({
    where: { orderId }
  });

  return NextResponse.json(shipping);
}
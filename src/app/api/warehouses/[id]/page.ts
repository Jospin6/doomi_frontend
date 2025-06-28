import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: params.id },
    include: {
      address: true,
      inventory: {
        include: {
          product: {
            include: {
              ProductImage: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        }
      }
    }
  });

  if (!warehouse) return new NextResponse('Not found', { status: 404 });

  return NextResponse.json({
    ...warehouse,
    inventory: warehouse.inventory.map((i: any) => ({
      id: i.id,
      quantity: i.quantity,
      safetyStock: i.safetyStock,
      product: {
        id: i.product.id,
        name: i.product.name,
        sku: i.product.sku,
        images: i.product.ProductImage.map((img: any) => img.url)
      }
    }))
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { name, isActive, capacity } = await request.json();

  const warehouse = await prisma.warehouse.update({
    where: { id: params.id },
    data: { name, isActive, capacity }
  });

  return NextResponse.json(warehouse);
}
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const inventory = await prisma.inventory.findMany({
    where: { warehouseId: params.id },
    include: { product: true }
  });

  return NextResponse.json(inventory);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { productId, quantity } = await request.json();

  await prisma.$transaction([
    // Créer ou mettre à jour l'inventaire
    prisma.inventory.upsert({
      where: { 
        productId_warehouseId: { 
          productId, 
          warehouseId: params.id 
        } 
      },
      update: { quantity: { increment: quantity } },
      create: { 
        productId, 
        warehouseId: params.id, 
        quantity,
        safetyStock: 10
      }
    }),
    // Enregistrer le mouvement
    prisma.stockMovement.create({
      data: {
        productId,
        warehouseId: params.id,
        quantity,
        type: 'IN',
        reason: 'Réapprovisionnement',
        userId: user.id
      }
    })
  ]);

  return new NextResponse(null, { status: 204 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = { id: '123', isAdmin: true };
  if (!user?.isAdmin) return new NextResponse('Forbidden', { status: 403 });

  const { productId, quantity } = await request.json();

  const inventory = await prisma.inventory.update({
    where: { 
      productId_warehouseId: { 
        productId, 
        warehouseId: params.id 
      } 
    },
    data: { quantity }
  });

  return NextResponse.json(inventory);
}
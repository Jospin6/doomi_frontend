import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET a single variant attribute by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const variantAttribute = await prisma.variantAttribute.findUnique({
      where: { id },
      include: { variant: true, attribute: true, value: true },
    });

    if (!variantAttribute) {
      return NextResponse.json({ error: 'Variant attribute not found' }, { status: 404 });
    }

    return NextResponse.json(variantAttribute);
  } catch (error) {
    console.error('Error fetching variant attribute:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a variant attribute by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    await prisma.variantAttribute.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting variant attribute:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ error: 'Variant attribute not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

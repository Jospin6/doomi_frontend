import { NextResponse } from 'next/server';
import prisma from "../../../../prisma/prisma"
import { CategoryCreateSchema } from '@/types/category';
import { generateSlug } from '@/lib/utils';

// GET: Liste des catégories (avec filtre parent)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentOnly = searchParams.get('parentOnly') === 'true';

    const categories = await prisma.category.findMany({
      where: parentOnly ? { parentId: null } : {},
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST: Création d'une catégorie
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CategoryCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, parentId } = parsed.data;

    // Vérification de l'unicité
    const existing = await prisma.category.findFirst({
      where: { name }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Cette catégorie existe déjà' },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        slug: generateSlug(name),
        parentId: parentId || null
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
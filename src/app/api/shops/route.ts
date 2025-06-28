import { NextResponse } from 'next/server';
import prisma from "../../../../prisma/prisma"
import { ShopCreateSchema } from '@/types/shop';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ShopCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, logo, banner, isActive } = parsed.data;

    // Génération du slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Vérification de l'unicité
    const existing = await prisma.shop.findFirst({
      where: { OR: [{ name }, { slug }] }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une boutique avec ce nom ou slug existe déjà' },
        { status: 409 }
      );
    }

    // Création (ownerId sera géré via session/auth)
    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        slug,
        logo,
        banner,
        isActive,
        ownerId: 'user-id-from-session' // À remplacer par votre logique d'authentification
      }
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
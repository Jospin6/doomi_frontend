import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, address, city, province, postalCode, country, userType } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Add password hashing here for security
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password, // In a real app, hash this password!
        phone,
        address,
        city,
        province,
        postalCode,
        country,
        userType,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    // Check for unique constraint violation
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

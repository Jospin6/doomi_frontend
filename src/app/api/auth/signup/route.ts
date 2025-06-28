import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { generateToken, setTokenCookie } from "@/lib/auth";


export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = await generateToken(user);
    const response = NextResponse.json(user, { status: 200 });

    setTokenCookie(token)
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
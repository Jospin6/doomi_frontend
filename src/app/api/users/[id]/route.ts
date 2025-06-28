import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma"
import { cookies } from "next/headers";
import { generateToken, setTokenCookie } from "@/lib/auth";

const secret = new TextEncoder().encode("secret_key");

export async function GET(req: Request) {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop() as string
    const user = await prisma.user.findUnique({
        where: { id, },
        include: {
            Experience: true,
            Education: true,
            Project: true,
            certifications: true
        },
    })
    if (!user) {
        return NextResponse.json({ message: "User not found" })
    }
    return NextResponse.json(user)
}

export async function PUT(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop() as string;
    const body = await req.json();

    const {
        name,
    } = body;

    let user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            name,
        },
    });

    const token = await generateToken(user);
    setTokenCookie(token)

    return NextResponse.json(updatedUser, { status: 200 });
}

export async function DELETE(req: Request) {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop() as string
    await prisma.user.delete({
        where: { id, },
    })
}
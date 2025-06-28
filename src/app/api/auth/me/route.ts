import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "secret_key";
const secret = new TextEncoder().encode(SECRET_KEY);

export async function GET() {
    try {
        const token = (await cookies()).get("doomi")?.value;

        if (!token) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, secret);

        return NextResponse.json(payload, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
    }
}
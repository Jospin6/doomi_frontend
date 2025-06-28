import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret_key");

export async function generateToken(user: any) {
    const token = await new SignJWT({
        id: user.id,
        email: user.email,
        role: user.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(100 * 365 * 24 * 60 * 60)
        .sign(secret);

    return token;
}


export async function setTokenCookie(token: string) {
    (await cookies()).set("doomi", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 100 * 365 * 24 * 60 * 60,
    });
}









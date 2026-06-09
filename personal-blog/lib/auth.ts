import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "private_margins_session";
const SESSION_DAYS = 30;

async function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    expires: expiresAt,
    priority: "high" as const
  };
}

export async function createSession(userId: string, role: string, email?: string) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const secret = await getJwtSecret();
  const jwt = await new SignJWT({ userId, role, ...(email && { email }) })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, jwt, sessionCookieOptions(expiresAt));
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      const secret = await getJwtSecret();
      const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
      if (payload.userId) {
        await prisma.session.deleteMany({ where: { userId: payload.userId as string } });
      }
    } catch {
      // invalid/expired JWT — nothing to revoke in DB
    }
  }

  cookieStore.set(SESSION_COOKIE, "", { ...sessionCookieOptions(new Date(0)), maxAge: 0 });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const secret = await getJwtSecret();
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (!payload.userId || !payload.role) return null;
    return {
      id: payload.userId as string,
      email: (payload.email as string) || "",
      role: payload.role as string,
      name: null
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return user;
}

export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

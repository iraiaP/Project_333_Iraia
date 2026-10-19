
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET!
);

export async function createSession(
  userId: string,
  accountType: "client" | "trainer"
) {
  const token = await new SignJWT({
    userId,
    accountType,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.userId !== "string" ||
      (payload.accountType !== "client" &&
        payload.accountType !== "trainer")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      accountType: payload.accountType,
    };
  } catch {
    return null;
  }
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getVisitorInfoForLogin } from "@/lib/visitor-info";
import { sendLoginToDiscord } from "@/lib/discord-webhook";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const shouldTrustHost =
  process.env.AUTH_TRUST_HOST === "true" ||
  process.env.NEXTAUTH_URL?.startsWith("http://localhost") ||
  process.env.NODE_ENV !== "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: shouldTrustHost,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash) return null;
        const isValid = await compare(parsed.data.password, user.passwordHash);
        if (!isValid) return null;

        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id as string;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    signIn: async ({ user }) => {
      if (user?.email) {
        // Fire-and-forget: never block the login response on Discord / 3rd-party
        // geolocation APIs. Any error is silently swallowed.
        void (async () => {
          try {
            const info = await getVisitorInfoForLogin();
            await sendLoginToDiscord({
              email: user.email!,
              ip: info.ip,
              isp: info.isp,
              city: info.city,
              region: info.region,
              country: info.country,
              time: new Date().toLocaleString(),
              device: info.device,
              browser: info.browser,
            });
          } catch {
            /* ignore webhook errors */
          }
        })();
      }
      return true;
    },
  },
});

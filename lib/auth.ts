import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * Single hard-coded admin identity, sourced from env vars -- there is no
 * signup flow and no user collection in MongoDB. Auth.js issues a JWT
 * session (no database adapter needed for a single Credentials-only user).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;

        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error(
            "ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not configured in environment variables."
          );
          return null;
        }

        if (username !== adminUsername) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
        if (!passwordMatches) {
          return null;
        }

        // Minimal user object; this is the only account in the system.
        return { id: "admin", name: "Admin", email: adminUsername };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true,
});

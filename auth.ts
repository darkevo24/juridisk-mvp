import NextAuth, { DefaultSession } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

declare module "next-auth" {
  interface Session {
    user: {
      email: string
      name?: string
      token: string
    } & DefaultSession["user"]
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  callbacks: {
    async redirect({ url }) {
      return url
    },
    async session({ session, token }) {
      session.user.token = token.idToken as string
      return session
    },
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
      }
      return token
    }
  }
})
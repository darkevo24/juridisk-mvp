import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

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
})
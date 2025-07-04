// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email"; 

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own login logic:
        const { username, password } = credentials;

        if (username === "admin" && password === "password123") {
          return { id: 1, name: "Admin User", email: "admin@example.com" };
        }
        // Return null if user not found or password incorrect
        return null;
      },
    }),

  
    EmailProvider({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM, }),
  ],

  // Optional NextAuth settings
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth/signin', 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
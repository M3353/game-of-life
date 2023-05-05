import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const isCorrectCredentials = (credentials) =>
  credentials.username === process.env.NEXT_PUBLIC_USERNAME &&
  credentials.password === process.env.NEXT_PUBLIC_PASSWORD;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        if (isCorrectCredentials(credentials)) {
          const user = { id: 1, name: "Admin" };
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);

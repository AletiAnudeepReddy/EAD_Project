import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent select_account", // 👈 Always ask which account to use
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // Credentials (custom login)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullname,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser && user.email) {
        await User.create({
          fullname: user.name,
          email: user.email,
          password: "google_oauth", // placeholder
        });
      }

      return true;
    },

    async session({ session, token }) {
      // You can attach extra info if needed
      return session;
    },
  },

  pages: {
    signIn: "/signin", // your custom sign-in page
  },

  session: {
    strategy: "jwt", // for Credentials auth
  },
  secret: process.env.NEXTAUTH_SECRET, // required for JWT sessions
});

export { handler as GET, handler as POST };

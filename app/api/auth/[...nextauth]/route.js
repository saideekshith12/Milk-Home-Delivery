
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Databaseconnection from "@/db/db";
import User from "@/model/user_signup";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Admin from "@/model/admin-model";
import Rider from "@/model/rider-registration";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" , placeholder : "Enter your email"},
        password: { label: "Password", type: "password", placeholder : "Enter your password"},
      },
      async authorize(credentials) {
        try {
          console.log("Authorization attempt:", credentials.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          if (!credentials.email.endsWith("@gmail.com")) {
            console.log("Invalid email domain");
            return null;
          }

          await Databaseconnection();
          console.log("Database connected");
          
          const user = await User.findOne({ email: credentials.email });
          console.log("User found:", user ? "Yes" : "No");

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          console.log("User authenticated successfully");
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    
    Credentials({
      id: "admin-login",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" , placeholder : "Enter your email"},
        password: { label: "Password", type: "password", placeholder : "Enter your password"},
      },
      async authorize(credentials) {
        try {
          console.log("Authorization attempt:", credentials.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          if (!credentials.email.endsWith("@gmail.com")) {
            console.log("Invalid email domain");
            return null;
          }

          await Databaseconnection();
          console.log("Database connected");
          
          const user = await Admin.findOne({ email: credentials.email });
          console.log("User found:", user ? "Yes" : "No");

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          console.log("User authenticated successfully");
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    Credentials({
      id: "rider-login",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" , placeholder : "Enter your email"},
        password: { label: "Password", type: "password", placeholder : "Enter your password"},
      },
      async authorize(credentials) {
        try {
          console.log("Authorization attempt:", credentials.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          if (!credentials.email.endsWith("@gmail.com")) {
            console.log("Invalid email domain");
            return null;
          }

          await Databaseconnection();
          console.log("Database connected");
          
          const rider = await Rider.findOne({ email: credentials.email });
          console.log("User found:", user ? "Yes" : "No");

          if (!rider) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            rider.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            return null;
          }

          console.log("User authenticated successfully");
          return {
            id: rider._id.toString(),
            name: rider.name,
            email: rider.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    
    
    
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }),


  ],
  adapter: MongoDBAdapter(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
});

export const { GET, POST } = handlers;




import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import axios from "axios";
import Cookies from "js-cookie";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(
          credentials?.email ?? credentials?.Email ?? ""
        ).trim();
        const password = String(
          credentials?.password ?? credentials?.Password ?? ""
        );
        if (!email || !password) {
          throw new Error("Email and password are required");
        }
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login?set-cookie=true`,
            { email, password }
          );
          if (res.status === 200 && res.data && res.data.result) {
            const inOneDay = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            ); // 1 day
            Cookies.set("access_token", res.data.accessToken, {
              expires: inOneDay,
            });
            Cookies.set("refresh_token", res.data.refreshToken, {
              expires: 30,
            }); // 30 days

            return res.data; // Return user object
          } else {
            console.error(
              "Login failed: Unexpected response structure",
              res.data
            );
            return null;
          }
        } catch (error) {
          console.error(
            "Login failed: Error from API",
            error?.response?.data?.message || error?.message
          );
          throw new Error(error?.response?.data?.message || "Login failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.provider === "google") {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google-login`,
          {
            email: profile.email,
            googleId: profile.sub,
            fname: profile.given_name,
            lname: profile.family_name,
          }
        );
        console.log(res.data);
        if (res.status === 200 && res.data && res.data.result) {
          user = res.data;
        } else {
          throw new Error(res.data?.message || "Google login failed");
        }
      }

      if (account && account.provider === "facebook") {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook-login`,
          {
            email: profile.email,
            facebookId: profile.id,
            fname: profile.name.split(" ")[0],
            lname: profile.name.split(" ")[1],
          }
        );
        if (res.status === 200 && res.data && res.data.result) {
          user = res.data;
        } else {
          throw new Error(res.data?.message || "Facebook login failed");
        }
      }

      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signOut(message) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    },
  },
});

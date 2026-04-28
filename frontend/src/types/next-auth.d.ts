import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      result: {
        fname: string;
        role: string;
        username: string;
        name: string;
        email: string;
      };
      id: number;
      userName: string;
      name: string;
      email: string;
      address: string;
      zip: string;
      role: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}

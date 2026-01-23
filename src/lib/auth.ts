import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs"; // Need to install bcryptjs and types

// Fallback hardcoded admin for initialization if DB is empty
const ADMIN_EMAIL = "oppspacesapp@gmail.com";
const ADMIN_PASS = "oppspaces2025";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // 1. Check DB first
                const user = await prisma.adminUser.findUnique({
                    where: { email: credentials.email },
                });

                if (user) {
                    const isValid = await compare(credentials.password, user.password);
                    if (isValid) {
                        return { id: user.id.toString(), email: user.email, name: "Admin" };
                    }
                    return null;
                }

                return null;
            },
        }),
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

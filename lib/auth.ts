

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { env } from "./env";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
   emailAndPassword: { 
     enabled: true, 
  }, 
   
  socialProviders: { 
    github: { 
      clientId: env.GITHUB_CLIENT_ID, 
      clientSecret: env.GITHUB_CLIENT_SECRET, 
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  }, 
  plugins: [
    admin()
  ]

});
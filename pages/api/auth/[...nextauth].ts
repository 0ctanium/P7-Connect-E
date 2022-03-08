import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import AppleProvider from "next-auth/providers/apple"
import LinkedInProvider from "next-auth/providers/linkedin"
import SlackProvider from "next-auth/providers/slack"

import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "lib/prisma"
import {createClient} from "redis";

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  secret: process.env.AUTH_SECRET,

  theme: {
    brandColor: "#fe2d01",
    logo: "/icons/icon.svg",
    colorScheme: "light"
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    jwt({ token, user}) {
      if (user?.role) {
        token.role = user.role
      }

      if(user?.id) {
        // set session alive status
        const cache = createClient();
        cache.on('error', (err) => console.log('Redis Client Error', err));
        cache.connect().then(() => {
          cache.set(`session:${user.id}`, new Date().getTime())
        });
      }

      return token
    },
    session({ session, user}) {
      session.user.role = user.role

      if(user?.id) {
        // set session alive status
        const cache = createClient();
        cache.on('error', (err) => console.log('Redis Client Error', err));
        cache.connect().then(() => {
          cache.set(`session:${user.id}`, new Date().getTime())
        });
      }

      return session
    }
  },

  providers: [
    // AppleProvider({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET,
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0"
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
    SlackProvider({
      clientId: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
    }),
  ],
})

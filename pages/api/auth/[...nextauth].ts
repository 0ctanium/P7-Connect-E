import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import AppleProvider from "next-auth/providers/apple"
import LinkedInProvider from "next-auth/providers/linkedin"
import SlackProvider from "next-auth/providers/slack"

import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "services/prisma"
import redis from "services/redis";
import * as crypto from "crypto";

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  // useSecureCookies: true,
  secret: process.env.AUTH_SECRET,

  theme: {
    brandColor: "#fe2d01",
    logo: "/icons/icon.svg",
    colorScheme: "light"
  },

  pages: {
    signIn: '/login',
  },

  events: {
    async signIn({user, account, profile, isNewUser}) {
      // Automatically update facebook profile picture
      if(account.provider === "facebook") {
        if(profile?.image) {
          await prisma.user.update({
            where: {
              id: user.id
            },
            data: {
              image: profile.image
            }
          })
        }
      }
    },
  },

  session: {
    strategy: 'jwt'
  },

  callbacks: {
    jwt({ token, user}) {
      token.online = true

      if (user?.role) {
        token.role = user.role
      }

      if(user?.id) {
        // set session alive status
        redis.set(`session:${user.id}`, new Date().getTime()).catch(console.error)
      }

      return token
    },
    session({ session, user, token}) {
      session.user.online = true

      session.user.id = token.sub || user.id
      session.user.role = token.role

      if(token?.sub) {
        // set session alive status
        redis.set(`session:${token.sub}`, new Date().getTime()).catch(console.error)
      }

      return session
    }
  },

  providers: [
    CredentialsProvider({
      id: 'credentials',
      type: 'credentials',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Mot de passe',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Adresse email", type: "email", placeholder: "mail@exemple.fr" },
        password: {  label: "Mot de passe", type: "password" }
      },
      async authorize(credentials, req) {
        if(!credentials) {
          throw new Error('No credentials given');
        }
        const { email, password } = credentials

        if(!email) {
          throw new Error('No email given');
        }
        if(!password) {
          throw new Error('No password given');
        }

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        })

        if (!user) {
          throw new Error('User not found');
        }

        if(!user.hash || !user.salt) {
          throw new Error('No password configured')
        }

        const passHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`)
        if(passHash !== user.hash) {
          throw new Error('Password is incorrect')
        }

        return {
          id: user.id,
          name: user.id,
          email: user.email,
          role: user.role,
          picture: user.image,
          sub: user.id,
        }
      }
    }),

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

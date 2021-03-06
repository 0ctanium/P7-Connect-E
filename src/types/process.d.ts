declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string

    GITHUB_ID: string
    GITHUB_SECRET: string

    FACEBOOK_ID: string
    FACEBOOK_SECRET: string

    TWITTER_ID: string
    TWITTER_SECRET: string

    LINKEDIN_ID: string
    LINKEDIN_SECRET: string

    SLACK_ID: string
    SLACK_SECRET: string

    GOOGLE_ID: string
    GOOGLE_SECRET: string

    // AUTH0_ID: string
    // AUTH0_SECRET: string

    APPLE_ID: string
    APPLE_SECRET: string

    OWN_AWS_ACCESS_KEY_ID: string
    OWN_AWS_SECRET_ACCESS_KEY: string
    OWN_AWS_BUCKET_NAME: string

    DATABASE_URL: string
    REDIS_URL: string
  }
}

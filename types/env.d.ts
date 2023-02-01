export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Built-in
      NODE_ENV: 'development' | 'production' | 'test'

      // App identity
      BRAND_NAME: string
      BRAND_JURIDICAL_NAME: string

      // App content
      DEFAULT_PAGE_TITLE: string
      DEFAULT_PAGE_DESCRIPTION: string
      DEFAULT_ASSETS_SOURCE: string

      // App documenttion posts
      DOCS_POSTS_SOURCE: string
      DOCS_PUSHER_CHANNEL: string

      // Mailer config
      MAILER_USER: string
      MAILER_PASS: string
      MAILER_HOST: string
      MAILER_PORT: '465' | string
      MAILER_TYPE: 'login' | 'Login' | 'LOGIN'
      MAILER_FROM: string
      MAILER_TO: string

      // ReCaptcha config keys
      CAPTCHA_VERIFIER_API: string
      CAPTCHA_KEY: string
      CAPTCHA_SECRET: string
      CAPTCHA_MIN_SCORE: string

      // Pusher config keys
      PUSHER_APP_ID: string
      PUSHER_APP_KEY: string
      PUSHER_APP_SECRET: string
      PUSHER_APP_CLUSTER: string
    }
  }
}

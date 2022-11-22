export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Built-in
      NODE_ENV: 'development' | 'production' | 'test'

      // Sources base links
      PAGES_TEMPLATES_SOURCE?: string

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
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_KEY: string;
      CLOUDINARY_SECRET: string;
      SESSION_SECRET: string;
      DATABASE_URL: string;
      STRIPE_SECRET: string;
      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASS: string;
      FRONTEND_URL: string;
    }
  }
}

export {};
declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    JWT_SECRET: string;
    DATABASE_URI: string;
    SERVER_KEY: string;
    SERVER_IV: string;
    NODE_ENV?: 'development' | 'production';
  }
}
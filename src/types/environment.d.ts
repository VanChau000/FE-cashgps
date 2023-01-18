export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number;
      DB_USER: string;
      REACT_APP_CLIENT: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}

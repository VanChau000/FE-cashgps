/// <reference types="react-scripts" />
export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      NODE_ENV: string;
      REACT_APP_API_URL: string;
      REACT_APP_MAIN_STYLE: string;
      REACT_APP_WEBSITE_NAME: string;
      REACT_APP_DOMAIN: string;
    };
  }
}

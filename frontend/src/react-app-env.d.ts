/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_WDS_SOCKET_HOST: string;
    REACT_APP_WDS_SOCKET_PORT: string;
    REACT_APP_ALLOWED_HOSTS: string;
  }
}
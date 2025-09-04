// This file is used to define TypeScript types for environment variables and module augmentations when you want to use strict type checking. though it works fine without it, it's a good practice to define types for your environment variables and any module augmentations you might use in your project.
// src/types/env.d.ts or in a global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    CORS_ORIGIN: string;
    // add others as needed
  }
}

declare module "colors" {
  interface String {
    bgCyan: () => string;
    white: () => string;
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_GITHUB_TOKEN: string;
      EXPO_PUBLIC_GITHUB_REPO: string;
    }
  }
}

export {};
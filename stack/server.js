import "server-only";

import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    afterSignIn: "/auth/callback",
    afterSignUp: "/auth/callback",
    home: "/auth/callback",
  },
});

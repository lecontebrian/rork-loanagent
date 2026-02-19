import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  if (!url) {
    console.log('[tRPC] No API base URL configured');
    return '';
  }
  return url;
};

const baseUrl = getBaseUrl();

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: baseUrl ? `${baseUrl}/api/trpc` : 'https://localhost:0/api/trpc',
      transformer: superjson,
      fetch: async (input, init) => {
        if (!baseUrl) {
          console.log('[tRPC] No backend configured, returning empty response');
          return new Response(
            JSON.stringify([{ result: { data: null } }]),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch(input, {
            ...init,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          console.log('[tRPC] Network request failed:', error);
          return new Response(
            JSON.stringify([{ result: { data: null } }]),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      },
    }),
  ],
});

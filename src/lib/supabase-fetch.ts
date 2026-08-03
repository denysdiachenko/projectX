type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

const defaultFetch = fetch.bind(globalThis);

export const supabaseFetch: typeof fetch = async (input, init) => {
  const response = await defaultFetch(input, init);

  if (response.status === 401) {
    unauthorizedHandler?.();
  }

  return response;
};

export function setSupabaseUnauthorizedHandler(handler: UnauthorizedHandler) {
  unauthorizedHandler = handler;

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null;
    }
  };
}

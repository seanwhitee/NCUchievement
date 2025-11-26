interface APIErrorResponse {
  detail?: string;
  [key: string]: unknown;
}

type TryCatchResult<T, E> = Promise<[T | null, E | null]>;

export const tryCatch = async <T, E = Error>(
  fn: () => Promise<Response>
): TryCatchResult<T, E> => {
  try {
    const res = await fn();
    if (!res.ok) {
      const data = (await res.json()) as APIErrorResponse;
      throw new Error(data.detail || `HTTP error: ${res.status}`);
    }
    return [(await res.json()) as T, null];
  } catch (err) {
    return [null, err as E];
  }
};

export type Observable<T> = {
  subscribe: (observer: (next: T) => void) => Subscription;
};

export type Subscription = {
  unsubscribe: () => void;
};

export function isObservable<T>(data: any): data is Observable<T> {
  return typeof data === "object" && "subscribe" in data && typeof data.subscribe === "function";
}

import { urlJoin } from 'url-join-ts';

export const objectId = (value: string) => ({
  value,
});

// eslint-disable-next-line no-promise-executor-return
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// url-join-ts auto implements base url
// but we should wrap urls using it to correct use PUBLIC_URL
export const relativeUrl = (path: string) => urlJoin(path);

export function omit<T>(list: string[], props: T) {
  return Object.entries(props).reduce((obj, [key, value]) => {
    if (list.some((k) => k === key)) return obj;
    return { ...obj, [key]: value };
  }, {} as T) as T;
}
